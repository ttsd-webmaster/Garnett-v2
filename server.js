const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const path = require('path');
const compression = require('compression');
const app = express();
const firebase = require('@firebase/app').firebase;
require('@firebase/auth');
require('@firebase/database');
require('@firebase/messaging');
const admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");
var port = process.env.PORT || 4000;
global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

require('dotenv').config();

// Firebase Config
firebase.initializeApp({
  apiKey: "AIzaSyAR48vz5fVRMkPE4R3jS-eI8JRnqEVlBNc",
  authDomain: "garnett-42475.firebaseapp.com",
  databaseURL: "https://garnett-42475.firebaseio.com",
  projectId: "garnett-42475",
  storageBucket: "garnett-42475.appspot.com",
  messagingSenderId: "741733387760"
})

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://garnett-42475.firebaseio.com"
})

// Redirect all HTTP traffic to HTTPS
function ensureSecure(req, res, next){
  if(req.headers["x-forwarded-proto"] === "https"){
    // OK, continue
    return next();
  };
  res.redirect('https://'+ req.hostname + req.url);
};

// Handle environments
if (process.env.NODE_ENV == 'production') {
  app.all('*', ensureSecure);
}

app.use(compression()); // Gzips file
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './client/build/index.html'));
});

// Retrieving Authentication Status Route
app.post('/api', function(req, res) {
  // Send back user's info to the client
  let fullName = req.body.user.displayName;
  console.log(fullName)

  // Look for user's info in data base
  let userRef = admin.database().ref('/users/' + fullName);
  userRef.once('value', (snapshot) => {
    const userInfo = snapshot.val();
    const data = {
      token: req.body.token,
      user: userInfo,
      firebaseData: {
        apiKey: 'AIzaSyAR48vz5fVRMkPE4R3jS-eI8JRnqEVlBNc',
        authDomain: 'garnett-42475.firebaseapp.com',
        databaseURL: 'https://garnett-42475.firebaseio.com',
        storageBucket: 'garnett-42475.appspot.com',
        messagingSenderId: '741733387760'
      }
    };
    res.json(data);
  });
});

// Login Post Route
app.post('/api/login', function(req, res) {

  // Authenticate the credentials
  firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password)
  .then((user) => {
    if (user) {
      const uid = user.uid;
      const fullName = user.displayName;

      // Send back user's info and a token to the client
      admin.auth().createCustomToken(uid)
      .then(function(customToken) {
        // Look for user's info in data base
        let userRef = admin.database().ref('/users/' + fullName);

        userRef.once('value', (snapshot) => {
          const userInfo = snapshot.val();
          const data = {
            token: customToken,
            user: userInfo,
            firebaseData: {
              apiKey: 'AIzaSyAR48vz5fVRMkPE4R3jS-eI8JRnqEVlBNc',
              authDomain: 'garnett-42475.firebaseapp.com',
              databaseURL: 'https://garnett-42475.firebaseio.com',
              storageBucket: 'garnett-42475.appspot.com',
              messagingSenderId: '741733387760'
            }
          };
          res.json(data);
        });
      })
      .catch(function(error) {
        console.log("Error creating custom token:", error);
      });
    }
    else {
      res.status(200).send('Email not verified.');
    }
  })
  .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
    console.log(errorCode, errorMessage);
    res.status(400).send(error);
  });
});

// Signup Route
app.post('/api/signup', function(req, res) {
  let dbRef = admin.database().ref('/users/');
  let firstName = req.body.firstName.replace(/ /g,'');
  let lastName = req.body.lastName.replace(/ /g,'');
  let fullName = firstName + lastName;
  let checkRef = admin.database().ref('/users/' + fullName);

  checkRef.once('value', (snapshot) => {
    // if (snapshot.val()) {
    //   res.status(400).send('This active is already signed up.');
    // }
    // else {
      // Create user with email and password
      firebase.auth().createUserWithEmailAndPassword(req.body.email, req.body.password)
      .then((user) => {
        if (user && !user.emailVerified) {
          let firstName = req.body.firstName.replace(/ /g,'');
          let lastName = req.body.lastName.replace(/ /g,'');

          user.updateProfile({
            displayName: fullName
          })
          .then(function() {
            let userRef = admin.database().ref('/users/' + user.displayName);

            userRef.set({
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              class: req.body.className,
              major: req.body.majorName,
              year: req.body.year,
              phone: req.body.phone,
              email: req.body.email,
              photoURL: 'https://cdn1.iconfinder.com/data/icons/ninja-things-1/720/ninja-background-512.png',
            });

            if (req.body.code === req.body.pledgeCode) {
              userRef.update({
                status: 'pledge',
                totalMerits: 0
              });

              dbRef.once('value', (snapshot) => {
                snapshot.forEach((child) => {
                  let activeRef = firebase.database().ref('/users/' + child.key);
                  let pledgeName = user.displayName;
                  
                  if (child.val().status === 'active') {
                    activeRef.child('/Pledges/' + pledgeName).set({
                      merits: 100
                    });
                  }
                  else if (child.val().status === 'alumni') {
                    activeRef.child('/Pledges/' + pledgeName).set({
                      merits: 200
                    });
                  }
                });
              });
            }
            else if (req.body.year === 'Alumni') {
              userRef.update({
                status: 'alumni',
              });

              dbRef.once('value', (snapshot) => {
                snapshot.forEach((child) => {
                  if (child.val().status === 'pledge') {
                    let pledgeName = child.key;

                    userRef.child('/Pledges/' + pledgeName).set({
                      merits: 200
                    });
                  }
                });
              });
            }
            else {
              userRef.update({
                status: 'active',
              });

              dbRef.once('value', (snapshot) => {
                snapshot.forEach((child) => {
                  if (child.val().status === 'pledge') {
                    let pledgeName = child.key;

                    userRef.child('/Pledges/' + pledgeName).set({
                      merits: 100
                    });
                  }
                });
              });
            }

            user.sendEmailVerification()
            .then(function() {
              res.sendStatus(200);
            });
          })
          .catch(function(error) {
            // Handle errors here.
            let errorCode = error.code;
            let errorMessage = error.message;

            console.log(errorCode, errorMessage);
            res.status(400).send('Something went wrong on the server.');
          });
        }
      })
      .catch(function(error) {
        // Handle errors here.
        let errorCode = error.code;
        let errorMessage = error.message;

        console.log(errorCode, errorMessage);
        res.status(400).send('Email has already been taken.');
      });
    // }
  });
});

// Log Out Route
app.post('/api/logout', function(req, res) {
  firebase.auth().signOut()
  .then(function() {
    res.sendStatus(200);
  })
  .catch(function(error) {
    console.log(error);
    res.status(400).send(error);
  });
});

// Sets the user photo
app.post('/api/photo', function(req, res) {
  let fullName = req.body.displayName;
  let userRef = admin.database().ref('/users/' + fullName);

  userRef.update({
    photoURL: req.body.url
  });

  userRef.once('value', (snapshot) => {
    const userInfo = snapshot.val();
    const data = {
      token: req.body.token,
      user: userInfo
    };
    res.json(data);
  });
});

// Query for pledges data
app.post('/api/pledges', function(req, res) {
  let dbRef = admin.database().ref('/users/');
  let pledgeArray = [];

  dbRef.once('value', (snapshot) => {
    pledgeArray = Object.keys(snapshot.val()).map(function(key) {
      return snapshot.val()[key];
    });
    pledgeArray = pledgeArray.filter(function(user) {
      return user.status === 'pledge';
    })
    console.log("Pledge array: ", pledgeArray);
    res.json(pledgeArray);
  });
});

// Query for active data
app.post('/api/actives', function(req, res) {
  let dbRef = admin.database().ref('/users/');
  let activeArray = [];

  dbRef.once('value', (snapshot) => {
    activeArray = Object.keys(snapshot.val()).map(function(key) {
      return snapshot.val()[key];
    });
    activeArray = activeArray.filter(function(user) {
      return user.status === 'active' || user.status === 'alumni';
    })
    console.log("Active array: ", activeArray);
    res.json(activeArray);
  });
});

// Post merit data
app.post('/api/merit', function(req, res) {
  let fullName = req.body.displayName;
  let userRef = admin.database().ref('/users/' + fullName + '/Pledges/' + req.body.pledgeName);
  let pledgeRef = admin.database().ref('/users/' + req.body.pledgeName);
  let meritRef = admin.database().ref('/users/' + req.body.pledgeName + '/Merits/');

  userRef.once('value', (snapshot) => {
    if (req.body.amount > 0) {
      userRef.update({
        merits: snapshot.val().merits - req.body.amount 
      });
    }
  });

  pledgeRef.once('value', (snapshot) => {
    pledgeRef.update({
      totalMerits: snapshot.val().totalMerits + req.body.amount
    });
  });

  meritRef.push({
    name: req.body.activeName,
    description: req.body.description,
    amount: req.body.amount,
    photoURL: req.body.photoURL,
    date: req.body.date
  });

  res.sendStatus(200);
});

// Post merit data for all pledges
app.post('/api/meritall', function(req, res) {
  let fullName = req.body.displayName;
  let dbRef = admin.database().ref('/users/');
  let userRef = admin.database().ref('/users/' + fullName + '/Pledges/');

  userRef.once('value', (snapshot) => {
    snapshot.forEach((child) => {
      let userPledgeRef = admin.database().ref('/users/' + fullName + '/Pledges/' + child.key);
      let pledgeRef = admin.database().ref('/users/' + child.key);
      let meritRef = admin.database().ref('/users/' + child.key + '/Merits/');
      let remainingMerits = snapshot.val().merits - req.body.amount;

      if (req.body.amount > 0) {
        if (remainingMerits > 0) {
          pledgeRef.once('value', (snap) => {
            pledgeRef.update({
              totalMerits: snap.val().totalMerits + req.body.amount
            });

            userPledgeRef.update({
              merits: snapshot.val().merits - req.body.amount
            });

            meritRef.push({
              name: req.body.activeName,
              description: req.body.description,
              amount: req.body.amount,
              photoURL: req.body.photoURL
            });

            if (!res.headersSent) {
              res.sendStatus(200);
            }
          });
        }
        else {
          pledgeRef.once('value', (snap) => {
            let pledgeName = `${snap.val().firstName} ${snap.val().lastName}`;
            if (!res.headersSent) {
              res.status(400).send(pledgeName);
            }
          });
        }
      }
      else {
        pledgeRef.once('value', (snap) => {
          pledgeRef.update({
            totalMerits: snap.val().totalMerits + req.body.amount
          });

          meritRef.push({
            name: req.body.activeName,
            description: req.body.description,
            amount: req.body.amount,
            photoURL: req.body.photoURL,
            date: req.body.date
          });

          if (!res.headersSent) {
            res.sendStatus(200);
          }
        });
      }
    });
  });
});

// Post complaint data
app.post('/api/complain', function(req, res) {
  let complaintsRef = admin.database().ref('/users/' + req.body.pledgeName + '/Complaints/');

  complaintsRef.push({
    description: req.body.description,
    name: req.body.activeName
  });

  res.sendStatus(200);
});

// Query for merit data on Active App
app.post('/api/activemerits', function(req, res) {
  let fullName = req.body.displayName;
  let pledgeName = req.body.pledge.firstName + req.body.pledge.lastName;
  let meritRef = admin.database().ref('/users/' + pledgeName + '/Merits/');
  let userRef = admin.database().ref('/users/' + fullName + '/Pledges/' + pledgeName);
  let remainingMerits;
  let meritArray = [];
  
  userRef.once('value', (snapshot) => {
    remainingMerits = snapshot.val().merits;

    meritRef.once('value', (snapshot) => {
      if (snapshot.val()) {
        meritArray = Object.keys(snapshot.val()).map(function(key) {
          return snapshot.val()[key];
        });
      }

      const data = {
        remainingMerits: remainingMerits,
        meritArray: meritArray
      };
      res.json(data);
    });
  });
});

// Query for merit data on Pledge App
app.post('/api/pledgedata', function(req, res) {
  let fullName = req.body.displayName;
  let userRef = admin.database().ref('/users/' + fullName);
  let meritRef = admin.database().ref('/users/' + fullName + '/Merits/');
  let complaintsRef = admin.database().ref('/users/' + fullName + '/Complaints/');
  let totalMerits;
  let meritArray = [];
  let complaintsArray = [];

  userRef.on('value', (snapshot) => {
    totalMerits = snapshot.val().totalMerits;

    meritRef.once('value', (snapshot) => {
      if (snapshot.val()) {
        meritArray = Object.keys(snapshot.val()).map(function(key) {
          return snapshot.val()[key];
        });
      }

      complaintsRef.once('value', (snapshot) => {
        if (snapshot.val()) {
          complaintsArray = Object.keys(snapshot.val()).map(function(key) {
            return snapshot.val()[key];
          });
        }

        console.log('Merit array: ', meritArray);
        console.log('Complaints array: ', complaintsArray);

        const data = {
          totalMerits: totalMerits,
          meritArray: meritArray,
          complaintsArray: complaintsArray
        };

        res.json(data);
      });
    });
  });
});

// Save message token from server
app.post('/api/savemessagetoken', function(req, res) {
  let fullName = req.body.displayName;
  let userRef = admin.database().ref('/users/' + fullName);

  userRef.update({
    registrationToken: req.body.token
  });

  res.sendStatus(200);
});

// Send message from server
app.post('/api/sendmessage', function(req, res) {
  let pledgeRef = admin.database().ref('/users/' + req.body.pledgeName);
  let merits = '';

  if (req.body.amount > 0) {
    merits = 'merits';
  }
  else {
    merits = 'demerits';
  }

  pledgeRef.once('value', (snapshot) => {
    let registrationToken = snapshot.val().registrationToken;
    let amount = Math.abs(req.body.amount);

    let payload = {
      notification: {
        title: 'Garnett',
        body: `You have received ${amount} ${merits} from ${req.body.activeName}`,
        clickAction: 'https://garnett-app.herokuapp.com',
        icon: 'https://farm5.staticflickr.com/4555/24846365458_2fa6bb5179.jpg'
      }
    };

    if (registrationToken) {
      admin.messaging().sendToDevice(registrationToken, payload)
      .then(function(response) {
        console.log("Successfully sent message:", response);
        res.sendStatus(200);
      })
      .catch(function(error) {
        console.log("Error sending message:", error);
        res.sendStatus(400);
      });
    }
    else {
      res.sendStatus(200);
    }
  });
});

app.listen(port, function () {
  console.log('Example app listening on port 4000!')
});

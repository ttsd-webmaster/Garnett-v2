const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const path = require('path');
const compression = require('compression');
const app = express();
const equal = require('deep-equal');
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
  if (req.headers["x-forwarded-proto"] === "https") {
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
      res.status(400).send('Email is not verified.');
    }
  })
  .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
    console.log(errorCode, errorMessage);
    res.status(400).send('Email or password is incorrect.');
  });
});

// Signup Route
app.post('/api/signup', function(req, res) {
  let dbRef = admin.database().ref('/users');
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
          user.updateProfile({
            displayName: fullName
          })
          .then(function() {
            let userRef = dbRef.child(user.displayName);

            userRef.set({
              firstName: req.body.firstName.trim(),
              lastName: req.body.lastName.trim(),
              class: req.body.className,
              major: req.body.majorName,
              year: req.body.year,
              phone: req.body.phone,
              email: req.body.email.trim(),
              photoURL: 'https://cdn1.iconfinder.com/data/icons/ninja-things-1/720/ninja-background-512.png',
            });

            if (req.body.code === req.body.pledgeCode) {
              userRef.update({
                status: 'pledge',
                totalMerits: 0
              });

              dbRef.once('value', (snapshot) => {
                snapshot.forEach((brother) => {
                  let pledgeName = user.displayName;
                  
                  if (child.val().status === 'active') {
                    brother.ref.child('/Pledges/' + pledgeName).set({
                      merits: 100
                    });
                  }
                  else if (child.val().status === 'alumni') {
                    brother.ref.child('/Pledges/' + pledgeName).set({
                      merits: 200
                    });
                  }
                });
              });
            }
            else {
              if (req.body.year === 'Alumni') {
                userRef.update({
                  status: 'alumni'
                });
              }
              else {
                userRef.update({
                  status: 'active'
                });
              }

              dbRef.once('value', (snapshot) => {
                snapshot.forEach((child) => {
                  if (child.val().status === 'pledge') {
                    let pledgeName = child.key;

                    if (req.body.year === 'Alumni') {
                      userRef.child('/Pledges/' + pledgeName).set({
                        merits: 200
                      });
                    }
                    else {
                      userRef.child('/Pledges/' + pledgeName).set({
                        merits: 100
                      });
                    }
                  }
                });
              });
            }

            user.sendEmailVerification()
            .then(function() {
              res.status(200).send('Verification email has been sent.');
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

// Forgot Password Route
app.post('/api/forgotpassword', function(req, res) {
  firebase.auth().sendPasswordResetEmail(req.body.email).then(function() {
    res.status(200).send('Email to reset password has been sent.');
  }).catch(function(error) {
    console.log(error);

    res.status(400).send('This email is not registered.');
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
      user: userInfo
    };
    res.json(data);
  });
});

// Query for pledges data
app.post('/api/pledges', function(req, res) {
  let dbRef = admin.database().ref('/users');
  let pledgeArray = [];

  dbRef.once('value', (snapshot) => {
    pledgeArray = Object.keys(snapshot.val()).map(function(key) {
      return snapshot.val()[key];
    });
    pledgeArray = pledgeArray.filter(function(user) {
      return user.status === 'pledge';
    });
    pledgeArray.sort((a, b) => {
      return a.lastName > b.lastName ? 1 : -1;
    });

    console.log("Pledge array: ", pledgeArray);
    res.json(pledgeArray);
  });
});

// Query for active data
app.post('/api/actives', function(req, res) {
  let dbRef = admin.database().ref('/users');
  let activeArray = [];

  dbRef.once('value', (snapshot) => {
    activeArray = Object.keys(snapshot.val()).map(function(key) {
      return snapshot.val()[key];
    });
    activeArray = activeArray.filter(function(user) {
      return user.status !== 'pledge';
    });
    activeArray.sort((a, b) => {
      return a.lastName > b.lastName ? 1 : -1;
    });

    console.log("Active array: ", activeArray);
    res.json(activeArray);
  });
});

// Query for merit data on Active App
app.post('/api/activemerits', function(req, res) {
  let fullName = req.body.displayName;
  let pledgeName = req.body.pledge.firstName + req.body.pledge.lastName;
  let meritRef = admin.database().ref('/users/' + pledgeName + '/Merits');
  let userRef = admin.database().ref('/users/' + fullName + '/Pledges/' + pledgeName);
  let remainingMerits;
  let merits = [];
  
  userRef.once('value', (snapshot) => {
    remainingMerits = snapshot.val().merits;

    meritRef.once('value', (snapshot) => {
      if (snapshot.val()) {
        merits = Object.keys(snapshot.val()).map(function(key) {
          return snapshot.val()[key];
        });
      }

      const data = {
        remainingMerits: remainingMerits,
        merits: merits
      };
      res.json(data);
    });
  });
});

// Query for merit data on Pledge App
app.post('/api/pledgedata', function(req, res) {
  let fullName = req.body.displayName;
  let userRef = admin.database().ref('/users/' + fullName);
  let meritRef = userRef.child('/Merits');
  let complaintsRef = userRef.child('/Complaints');
  let totalMerits;
  let meritArray = [];
  let complaintsArray = [];

  userRef.once('value', (snapshot) => {
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

// Post merit data
app.post('/api/merit', function(req, res) {
  let fullName = req.body.displayName;
  let userRef = admin.database().ref('/users/' + fullName + '/Pledges/' + req.body.pledgeName);
  let pledgeRef = admin.database().ref('/users/' + req.body.pledgeName);
  let meritRef = pledgeRef.child('/Merits');

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
  let userRef = admin.database().ref('/users/' + fullName + '/Pledges');
  let counter = 0;

  userRef.once('value', (snapshot) => {
    snapshot.forEach((child) => {
      let userPledgeRef = child.ref;
      let pledgeRef = admin.database().ref('/users/' + child.key);
      let meritRef = pledgeRef.child('/Merits/');
      let remainingMerits = child.val().merits - req.body.amount;
      counter++;

      if (req.body.amount > 0) {
        if (remainingMerits > 0) {
          pledgeRef.once('value', (snap) => {
            pledgeRef.update({
              totalMerits: snap.val().totalMerits + req.body.amount
            });

            userPledgeRef.update({
              merits: remainingMerits
            });

            meritRef.push({
              name: req.body.activeName,
              description: req.body.description,
              amount: req.body.amount,
              photoURL: req.body.photoURL,
              date: req.body.date
            });

            if (!res.headersSent && counter === snapshot.numChildren()) {
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

          if (!res.headersSent && counter === snapshot.numChildren()) {
            res.sendStatus(200);
          }
        });
      }
    });
  });
});

// Creates a chalkboard
app.post('/api/createchalkboard', function(req, res) {
  let fullName = req.body.displayName;
  let chalkboardsRef = admin.database().ref('/chalkboards');

  // Adds chalkboards to general chalkboards and user's chalkboards
  chalkboardsRef.once('value', (snapshot) => {
    snapshot.forEach((chalkboard) => {
      if (req.body.title === chalkboard.val().title) {
        res.sendStatus(400);
      }
      else {
        chalkboardsRef.push({
          displayName: req.body.displayName,
          activeName: req.body.activeName,
          photoURL: req.body.photoURL,
          title: req.body.title,
          description: req.body.description,
          date: req.body.date,
          time: req.body.time,
          location: req.body.location
        });
        res.sendStatus(200);
      }
    });
  });
});

// Edits chalkboard
app.post('/api/editchalkboard', function(req, res) {
  let editedField = req.body.field;
  let fullName = req.body.displayName;
  let chalkboardsRef = admin.database().ref('/chalkboards');

  chalkboardsRef.once('value', (snapshot) => {
    snapshot.forEach((chalkboard) => {
      // Looks for the chalkboard in the chalkboards ref
      if (req.body.chalkboard.title === chalkboard.val().title) {
        // Updates the chalkboard
        chalkboard.ref.update({
          [editedField]: req.body.newValue
        });

        res.sendStatus(200);
      }
    });
  });
});

// Joins chalkboard as an attendee
app.post('/api/joinchalkboard', function(req, res) {
  let chalkboardsRef = admin.database().ref('/chalkboards');

  chalkboardsRef.once('value', (snapshot) => {
    snapshot.forEach((chalkboard) => {
      // Looks for the chalkboard in the chalkboards ref
      if (req.body.chalkboard.title === chalkboard.val().title) {
        // Adds the user to the Attendees ref
        chalkboard.ref.child('attendees').push({
          name: req.body.name,
          photoURL: req.body.photoURL
        });
        
        res.sendStatus(200);
      }
    });
  });
});

// Removes chalkboard from both user's list and general list
app.post('/api/removechalkboard', function(req, res) {
  let fullName = req.body.displayName;
  let chalkboardsRef = admin.database().ref('/chalkboards');

  chalkboardsRef.once('value', (snapshot) => {
    snapshot.forEach((chalkboard) => {
      // Removes chalkboard in the chalkboards ref
      if (req.body.chalkboard.title === chalkboard.val().title) {
        chalkboard.ref.remove(() => {
          res.sendStatus(200);
        });
      }
    });
  });
});

// Leaves chalkboard as an attendee
app.post('/api/leavechalkboard', function(req, res) {
  let name = req.body.name;
  let chalkboardsRef = admin.database().ref('/chalkboards');

  chalkboardsRef.once('value', (snapshot) => {
    snapshot.forEach((chalkboard) => {
      // Looks for the chalkboard in the chalkboards ref
      if (req.body.chalkboard.title === chalkboard.val().title) {
        chalkboard.ref.child('attendees').once('value', (snapshot) => {
          snapshot.forEach((attendee) => {
            // Checks if the user is an attendee
            if (equal(name, attendee.val().name)) {
              // Removes user from the Attendees list
              attendee.ref.remove(() => {
                res.sendStatus(200);
              });
            }
          });
        });
      }
    });
  });
});

app.post('/api/getattendees', function(req, res) {
  let attendeesArray = [];
  let chalkboardsRef = admin.database().ref('/chalkboards');

  chalkboardsRef.once('value', (snapshot) => {
    snapshot.forEach((chalkboard) => {
      // Looks for the chalkboard in the chalkboards ref
      if (req.body.chalkboard.title === chalkboard.val().title) {
        chalkboard.ref.child('attendees').once('value', (snapshot) => {
          // Finds the attendees if there are any
          if (snapshot.val()) {
            attendeesArray = Object.keys(snapshot.val()).map(function(key) {
              return snapshot.val()[key];
            });
          }

          res.json(attendeesArray);
        });
      }
    });
  });
});

// Post complaint data
app.post('/api/complain', function(req, res) {
  let fullName = req.body.displayName;
  let complaintInfo = {
    activeDisplayName: req.body.displayName,
    activeName: req.body.activeName,
    pledgeDisplayName: req.body.pledge.value,
    pledgeName: req.body.pledge.label,
    description: req.body.description,
    photoURL: req.body.pledge.photoURL,
    date: req.body.date
  };

  // Check if active is PI/PM or not
  if (req.body.status === 'active') {
    let complaintsRef = admin.database().ref('/pendingComplaints');
    let pendingComplaintsRef = admin.database().ref('/users/' + fullName + '/pendingComplaints');

    // Add complaints to active's pending complaints list and the pending complaints list
    complaintsRef.push(complaintInfo);
    pendingComplaintsRef.push(complaintInfo);
  }
  else {
    let complaintsRef = admin.database().ref('/approvedComplaints');
    let pledgeComplaintsRef = admin.database().ref('/users/' + req.body.pledge.value + '/Complaints');

    // Add complaints to the approved complaints list and the specified pledge's complaints list
    complaintsRef.push(complaintInfo);

    pledgeComplaintsRef.push({
      activeName: req.body.activeName,
      description: req.body.description,
      date: req.body.date
    });
  }

  res.sendStatus(200);
});

// Removes complaint for active
app.post('/api/removecomplaint', function(req, res) {
  let activeName = req.body.complaint.activeDisplayName;
  let userPendingComplaintsRef = admin.database().ref('/users/' + activeName + '/pendingComplaints');
  let pendingComplaintsRef = admin.database().ref('/pendingComplaints');

  pendingComplaintsRef.once('value', (snapshot) => {
    snapshot.forEach((complaint) => {
      // Removes complaint from the pending complaints list
      if (equal(req.body.complaint, complaint.val())) {
        complaint.ref.remove(() => {
          userPendingComplaintsRef.once('value', (snapshot) => {
            snapshot.forEach((complaint) => {
              // Removes complaint from the active's pending complaints list
              if (equal(req.body.complaint, complaint.val())) {
                complaint.ref.remove(() => {
                  res.sendStatus(200);
                });
              }
            });
          });
        });
      }
    });
  });
});

// Approves complaint for PI/PM
app.post('/api/approvecomplaint', function(req, res) {
  let activeName = req.body.complaint.activeDisplayName;
  let pledgeName = req.body.complaint.pledgeDisplayName;
  let activeRef = admin.database().ref('/users/' + activeName);
  let pledgeComplaintsRef = admin.database().ref('/users/' + pledgeName + '/Complaints');
  let approvedComplaintsRef = admin.database().ref('/approvedComplaints');
  let pendingComplaintsRef = admin.database().ref('/pendingComplaints');

  pendingComplaintsRef.once('value', (snapshot) => {
    snapshot.forEach((complaint) => {
      // Removes complaint from the pending complaints list
      if (equal(req.body.complaint, complaint.val())) {
        complaint.ref.remove(() => {
          // Adds complaint to the approved complaints list
          approvedComplaintsRef.push(req.body.complaint);
          activeRef.child('/pendingComplaints').once('value', (snapshot) => {
            snapshot.forEach((complaint) => {
              // Removes complaint from the active's pending complaints list
              if (equal(req.body.complaint, complaint.val())) {
                complaint.ref.remove(() => {
                  // Adds complaint to the active's approved complaints list
                  activeRef.child('/approvedComplaints').push(req.body.complaint);
                  // Adds complaint to the pledge's complaints list
                  pledgeComplaintsRef.push({
                    activeName: req.body.complaint.activeName,
                    description: req.body.complaint.description,
                    date: req.body.complaint.date
                  });

                  res.sendStatus(200);
                });
              }
            });
          });
        });
      }
    });
  });
});

app.post('/api/pledgecomplaints', function(req, res) {
  let dbRef = admin.database().ref('/users');

  // Loop through all users for pledges
  dbRef.once('value', (snapshot) => {
    let pledgeArray = Object.keys(snapshot.val()).map(function(key) {
      return snapshot.val()[key];
    });
    // Filter pledges
    pledgeArray = pledgeArray.filter(function(user) {
      return user.status === 'pledge';
    });
    // Save the value, label, and photoURL for each pledge
    pledgeArray = pledgeArray.map(function(pledge) {
      return {'value': pledge.firstName + pledge.lastName, 
              'label': `${pledge.firstName} ${pledge.lastName}`,
              'photoURL': pledge.photoURL
             };
    });

    res.json(pledgeArray);
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

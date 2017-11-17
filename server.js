const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const path = require('path');
const app = express();
const firebase = require('@firebase/app').firebase;
require('@firebase/auth');
require('@firebase/database');
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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './client/build/index.html'));
});

// Login Get Route
app.post('/api', function(req, res) {
  if (req.body.token === null) {
    res.status(200).send('Not Authenticated');
  }
  else {
    // Send back user's info and a token to the client
    firebase.auth().signInWithCustomToken(req.body.token)
    .then(function() {
      let fullName = firebase.auth().currentUser.displayName;
      console.log(fullName)
      // Look for user's info in data base
      let userRef = firebase.database().ref('/users/' + fullName);
      userRef.once('value', (snapshot) => {
        const userInfo = snapshot.val();
        const data = {
          token: req.body.token,
          user: userInfo,
          databaseURL: 'https://garnett-42475.firebaseio.com'
        };
        res.json(data);
      });
    })
    .catch(function(error) {
      console.log("Error signing in with custom token:", error);
    });
  }
});

// Login Post Route
app.post('/api/login', function(req, res) {

  // Authenticate the credentials
  firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password)
  .then((user) => {
    if (user && user.emailVerified) {
      const uid = user.uid;
      const fullName = user.displayName;

      // Send back user's info and a token to the client
      admin.auth().createCustomToken(uid)
      .then(function(customToken) {
        // Look for user's info in data base
        let userRef = firebase.database().ref('/users/' + fullName);
        userRef.once('value', (snapshot) => {
          const userInfo = snapshot.val();
          const data = {
            token: customToken,
            user: userInfo,
            databaseURL: 'https://garnett-42475.firebaseio.com'
          };
          res.json(data);
        });
      })
      .catch(function(error) {
        console.log("Error creating custom token:", error);
      });
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
  let dbRef = firebase.database().ref('/users/');

  // Create user with email and password
  firebase.auth().createUserWithEmailAndPassword(req.body.email, req.body.password)
  .then((user) => {
    if (user && !user.emailVerified) {
      user.updateProfile({
        displayName: req.body.firstName + req.body.lastName
      })
      .then(function() {
        let userRef = firebase.database().ref('/users/' + user.displayName);

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
        if (req.body.code === req.body.activeCode) {
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
        else {
          userRef.update({
            status: 'pledge',
            totalMerits: 0
          });

          dbRef.once('value', (snapshot) => {
            snapshot.forEach((child) => {
              if (child.val().status === 'active') {
                let pledgeName = user.displayName;

                memberRef.child('/Pledges/' + pledgeName).set({
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
        console.log(error);
        res.status(400).send(error);
      });
    }
  })
  .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    console.log(errorCode, errorMessage);
    res.status(400).send(error);
  });
});

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

// Query for pledges data
app.post('/api/pledges', function(req, res) {
  let dbRef = firebase.database().ref('/users/');
  let userArray = [];

  dbRef.once('value', (snapshot) => {
    userArray = Object.keys(snapshot.val()).map(function(key) {
      return snapshot.val()[key];
    });
    userArray = userArray.filter(function(user) {
      return user.status === 'pledge';
    })
    console.log("Pledge array: ", userArray);
    res.json(userArray);
  });
});

// Post merit data
app.post('/api/merit', function(req, res) {
  let user = firebase.auth().currentUser;
  let userRef = firebase.database().ref('/users/' + user.displayName + '/Pledges/' + req.body.pledgeName);
  let pledgeRef = firebase.database().ref('/users/' + req.body.pledgeName);
  let meritRef = firebase.database().ref('/users/' + req.body.pledgeName + '/Merits/');

  // Verify the Token
  firebase.auth().signInWithCustomToken(req.body.token)
  .then(function() {
    userRef.once('value', (snapshot) => {
      userRef.update({
        merits: snapshot.val().merits - req.body.amount 
      });
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
      photoURL: req.body.photoURL
    });

    res.sendStatus(200);
  })
  .catch(function(error) {
    console.log("Token error: ", error);
  });
});

// Query for merit data on Active App
app.post('/api/activemerits', function(req, res) {
  let user = firebase.auth().currentUser;
  let pledgeName = req.body.pledge.firstName + req.body.pledge.lastName;
  let meritRef = firebase.database().ref('/users/' + pledgeName + '/Merits/');
  let userRef = firebase.database().ref('/users/' + user.displayName + '/Pledges/' + pledgeName);
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
app.post('/api/pledgemerits', function(req, res) {
  let user = firebase.auth().currentUser;
  let meritRef = firebase.database().ref('/users/' + user.displayName + '/Merits/');
  let meritArray = [];

  meritRef.once('value', (snapshot) => {
    if (snapshot.val()) {
      meritArray = Object.keys(snapshot.val()).map(function(key) {
        return snapshot.val()[key];
      });
    }
    
    console.log('Merit array: ', meritArray);
    res.json(meritArray);
  });
});

app.listen(port, function () {
  console.log('Example app listening on port 4000!')
});

const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const http = require('http');
const path = require('path');
const app = express();
const firebase = require('firebase')
const admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");
var port = process.env.PORT || 4000;

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './client/public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './client/public/index.html'));
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('./client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './client/build/index.html'));
  })
}

// Login Get Route
app.post('/api', function(req, res) {
  let user = firebase.auth().currentUser;

  if (user === null) {
    res.status(200).send('Not Authenticated');
  }
  else {
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
          user: userInfo
        };
        res.json(data);
      });
    })
    .catch(function(error) {
      console.log("Error creating custom token:", error);
    });
  }
});

// Login Post Route
app.post('/api/login', function(req, res) {

  // Authenticate the credentials
  firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password)
  .then((user) => {
    if (user && !user.emailVerified) {
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
            user: userInfo
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
    res.status(404).send('Wrong credentials')
  })
});

// Signup Route
app.post('/api/signup', function(req, res) {

  // Create user with email and password
  firebase.auth().createUserWithEmailAndPassword(req.body.email, req.body.password)
  .then((user) => {
    if (user && !user.emailVerified) {
      let dbRef = firebase.database().ref('/users/');

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
        }
        else {
          userRef.update({
            status: 'pledge',
            totalMerits: 0
          });

          dbRef.once('value', (snapshot) => {
            snapshot.forEach((child) => {
              let activeRef = firebase.database().ref('/users/' + child.key);

              activeRef.once('value', (snapshot) => {
                if (snapshot.val().status === 'active') {
                  activeRef.child('/Pledges/' + user.displayName).set({
                    merits: 0
                  });
                }
              });
            });
          });
        }

        user.sendEmailVerification()
        .then(function() {
          res.sendStatus(200);
        });
      })
      .catch(function(error) {
        console.log(error)
      });
    }
  })
  .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    console.log(errorCode, errorMessage);
  });
});

// Query for pledges data
app.post('/api/pledges', function(req, res) {
  // Verify the Token
  firebase.auth().signInWithCustomToken(req.body.token)
  .then(function() {
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
    })
  })
  .catch(function(error) {
    console.log("Token error: ", error);
  });
});

// Post merit data
app.post('/api/merit', function(req, res) {
  let user = firebase.auth().currentUser;

  // Verify the Token
  firebase.auth().signInWithCustomToken(req.body.token)
  .then(function() {
    let userRef = firebase.database().ref('/users/' + user.displayName + '/Pledges/' + req.body.pledgeName);
    let pledgeRef = firebase.database().ref('/users/' + req.body.pledgeName);
    let meritRef = firebase.database().ref('/users/' + req.body.pledgeName + '/Merits/');

    userRef.once('value', (snapshot) => {
      userRef.update({
        merits: snapshot.val().merits + req.body.amount 
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

// Query for merit data
app.post('/api/merits', function(req, res) {
  let user = firebase.auth().currentUser;

  // Verify the Token
  firebase.auth().signInWithCustomToken(req.body.token)
  .then(function() {
    let meritRef = firebase.database().ref('/users/' + user.displayName + '/Merits/');
    let meritArray = [];

    meritRef.once('value', (snapshot) => {
      meritArray = Object.keys(snapshot.val()).map(function(key) {
        return snapshot.val()[key];
      });
      console.log('Merit array: ', meritArray);
      res.json(meritArray);
    })
  })
  .catch(function(error) {
    console.log('Token error: ', error)
  })
})

app.listen(port, function () {
  console.log('Example app listening on port 4000!')
});

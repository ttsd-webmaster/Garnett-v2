const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const http = require('http');
const path = require('path');
const app = express();
const firebase = require('firebase')
const admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

require('dotenv').config();

//Firebase Config
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
app.use(express.static(path.join(__dirname, '../build')));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

//Login Route
app.post('/login', function(req,res){

  //Authenticate the credentials
  firebase.auth().signInWithEmailAndPassword(req.body.username, req.body.password)
  .then((user) => {
    if (user && !user.emailVerified) {
      const uid = user.uid
      const fullName = user.displayName

      //Send back user's info and a token to the client
      admin.auth().createCustomToken(uid)
        .then(function(customToken) {
          //Look for user's info in data base
          let userRef = firebase.database().ref('/users/' + fullName);
          userRef.once('value', (snapshot) => {
            const userInfo = snapshot.val()
            const data = {
              token : customToken,
              user  : userInfo
            }
            res.json(data)
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
})

//Query for pledges data
app.post('/pledges', function(req,res){
  //Verify the Token
  firebase.auth().signInWithCustomToken(req.body.token)
  .then(function() {
    let dbRef = firebase.database().ref('/users/');
    let userArray = [];

    dbRef.once('value', (snapshot) => {
      userArray = Object.keys(snapshot.val()).map(function(key) {
        return snapshot.val()[key]
      });
      userArray = userArray.filter(function(user) {
        return user.status === 'pledge';
      })
      console.log("Pledge array: ",userArray)
      res.json(userArray);
    })
  })
  .catch(function(error) {
    console.log("Token error:",error)
  });
})

const server = http.createServer(app);
server.listen(4000, function () {
  console.log('Example app listening on port 4000!')
});

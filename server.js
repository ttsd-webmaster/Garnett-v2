const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const shrinkRay = require('shrink-ray');
const app = express();
const indexRouter = require('./routes/index');
const meritRouter = require('./routes/merit');
const chalkboardRouter = require('./routes/chalkboard');
const complaintRouter = require('./routes/complaint');
const notificationRouter = require('./routes/notification');
const delibsRouter = require('./routes/delibs');
const equal = require('deep-equal');
const firebase = require('@firebase/app').firebase;
require('@firebase/auth');
require('@firebase/messaging');
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const port = process.env.PORT || 4000;
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
});

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://garnett-42475.firebaseio.com",
  projectId: "garnett-42475"
});

// Redirect all HTTP traffic to HTTPS
function ensureSecure(req, res, next){
  if (req.headers["x-forwarded-proto"] === "https") {
    // OK, continue
    return next();
  }
  res.redirect('https://'+ req.hostname + req.url);
};

// Handle environments
if (process.env.NODE_ENV == 'production') {
  app.all('*', ensureSecure);
}

app.use(shrinkRay()); // Gzips file
app.use(express.static(path.join(__dirname, './client/build')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', indexRouter);
app.use('/api/merit', meritRouter);
app.use('/api/chalkboard', chalkboardRouter);
app.use('/api/complaint', complaintRouter);
app.use('/api/notification', notificationRouter);
app.use('/api/delibs', delibsRouter);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './client/build/index.html'));
});

app.listen(port, function () {
  console.log('Example app listening on port 4000!')
});

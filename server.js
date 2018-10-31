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
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const port = process.env.PORT || 4000;
global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

require('dotenv').config();

// Firebase Config
firebase.initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
});

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
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

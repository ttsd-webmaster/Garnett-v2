const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const shrinkRay = require('shrink-ray');
const app = express();
const equal = require('deep-equal');
const firebase = require('@firebase/app').firebase;
const admin = require('firebase-admin');
const indexRouter = require('./routes/index');
const meritsRouter = require('./routes/merits');
const chalkboardsRouter = require('./routes/chalkboards');
const complaintsRouter = require('./routes/complaints');
const notificationsRouter = require('./routes/notifications');
const dataRouter = require('./routes/data');
const delibsRouter = require('./routes/delibs');
const port = process.env.PORT || 4000;
global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

require('dotenv').config();

// Firebase Config
firebase.initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
});

admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
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
app.use('/api/merit', meritsRouter);
app.use('/api/chalkboard', chalkboardsRouter);
app.use('/api/complaint', complaintsRouter);
app.use('/api/notification', notificationsRouter);
app.use('/api/data', dataRouter);
app.use('/api/delibs', delibsRouter);

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, './client/build/index.html'));
});

app.listen(port, function () {
  console.log('Example app listening on port 4000!')
});

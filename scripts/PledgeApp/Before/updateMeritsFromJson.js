const data = require('./garnett-data.json');
const admin = require("firebase-admin");
require('dotenv').config({ path: `${process.env.HOME}/Projects/React/Garnett/.env` });

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
  databaseURL: process.env.FIREBASE_DATABASE_URL
})

const meritsRef = admin.database().ref('/merits');

const users = Object.keys(data.users).map(function(key) {
  return data.users[key];
})

users.forEach((user) => {
  if (user.status === 'pledge' && user.Merits) {
    const merits = Object.keys(user.Merits).map(function(key) {
      return user.Merits[key];
    })

    merits.forEach((merit) => {
      const updatedMerit = {
        pledgeName: `${user.firstName} ${user.lastName}`,
        pledgePhoto: user.photoURL,
        activeName: merit.name,
        activePhoto: merit.photoURL,
        amount: merit.amount,
        description: merit.description,
        date: merit.date
      };
      meritsRef.push(updatedMerit);
    })
  } else if (user.Merits) {
    const merits = Object.keys(user.Merits).map(function(key) {
      return user.Merits[key];
    })

    merits.forEach((merit) => {
      const updatedMerit = {
        pledgeName: merit.name,
        pledgePhoto: merit.photoURL,
        activeName: `${user.firstName} ${user.lastName}`,
        activePhoto: user.photoURL,
        amount: merit.amount,
        description: merit.description,
        date: merit.date
      };
      meritsRef.push(updatedMerit);
    })
  }
})

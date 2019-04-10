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

let usersRef = admin.database().ref('/users');
let meritsRef = admin.database().ref('/merits');

usersRef.once('value', (users) => {
  users.forEach((user) => {
    if (user.val().status === 'pledge' && user.val().Merits) {
      const merits = Object.keys(user.val().Merits).map(function(key) {
        return user.val().Merits[key];
      })
      meritsRef.once('value', (allMerits) => {
        merits.forEach((merit) => {
          if (allMerits.val()[merit] !== undefined && !allMerits.val()[merit].pledgeName) {
            meritsRef.child(merit).update({
              pledgeName: `${user.val().firstName} ${user.val().lastName}`,
              pledgePhoto: user.val().photoURL,
              name: null,
              photoURL: null
            })
          }
        })
      });
    } else if (user.val().Merits) {
      const merits = Object.keys(user.val().Merits).map(function(key) {
        return user.val().Merits[key];
      })
      meritsRef.once('value', (allMerits) => {
        merits.forEach((merit) => {
          if (allMerits.val()[merit] !== undefined && !allMerits.val()[merit].activeName) {
            meritsRef.child(merit).update({
              activeName: `${user.val().firstName} ${user.val().lastName}`,
              activePhoto: user.val().photoURL,
              name: null,
              photoURL: null
            })
          }
        })
      });
    }
  });
});

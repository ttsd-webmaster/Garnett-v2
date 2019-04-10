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

let usersRef = admin.database().ref('/users/');

usersRef.once('value', (snapshot) => {
  snapshot.forEach((user) => {
    // Updates status and year for all users except alumni
    if (user.val().status !== 'alumni') {
      let newYear = parseInt(user.val().year.charAt(0)) + 1;
      let yearString = 'th Year';

      if (newYear === 2) {
        yearString = 'nd Year';
      }
      else if (newYear === 3) {
        yearString = 'rd Year';
      }

      let updatedYear = newYear + yearString;
      let updatedStatus = 'active';

      // Keeps pledge's status as pledge
      if (user.val().status === 'pledge') {
        updatedStatus = 'pledge';
      }
      // Updates 4th and 5th years to be alumni
      if (user.val().year === '4th Year' || user.val().year === '5th Year') {
        updatedStatus = 'alumni';
        updatedYear = 'Alumni';
      }

      console.log(user.key, updatedStatus, updatedYear);

      user.ref.update({
        status: updatedStatus,
        year: updatedYear
      });
    }
  });
});

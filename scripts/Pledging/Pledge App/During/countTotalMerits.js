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

const usersRef = admin.database().ref('/users');
const meritsRef = admin.database().ref('/merits');

usersRef.once('value', (snapshot) => {
  snapshot.forEach((user) => {
    if (user.val().Merits) {
      let merits = Object.keys(user.val().Merits).map(function(key) {
        return user.val().Merits[key];
      });

      meritsRef.once('value', (meritsList) => {
        let totalMerits = 0;

        merits.forEach((merit) => {
          totalMerits += meritsList.val()[merit].amount;
        })

        if (user.val().totalMerits !== totalMerits) {
          console.log(`Previous: ${user.key} had ${user.val().totalMerits}`);
          user.ref.update({ totalMerits });
          console.log(`Updated: ${user.key} has ${totalMerits}`);
        }
      })
    }
  });
});

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
    if (user.val().status === 'pledge') {
      console.log(user.key);

      // Update pledge's status to active
      user.ref.update({
        status: 'active'
      });

      // Remove Merits for pledge
      user.ref.child('Merits').remove(() => {
        console.log(`Removed merits for ${user.key}.`);
      });
      // Remove Complaints for pledge
      user.ref.child('Complaints').remove(() => {
        console.log(`Removed complaints for ${user.key}.`);
      });
      // Remove total merits for pledge
      user.ref.child('totalMerits').remove(() => {
        console.log(`Removed total merits for ${user.key}.`);
      });
    }
  });
});

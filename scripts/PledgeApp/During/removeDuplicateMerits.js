const admin = require("firebase-admin");
const equal = require('deep-equal');
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

meritsRef.once('value', (merits) => {
  let updatedMerits = Object.keys(merits.val()).map(function(key) {
    return merits.val()[key];
  });

  updatedMerits = updatedMerits.filter((merit, index, self) =>
    index === self.findIndex((m) => (
      m.description === merit.description &&
      m.activeName === merit.activeName &&
      m.pledgeName === merit.pledgeName &&
      m.amount === merit.amount
    ));
  );

  meritsRef.set(updatedMerits);
});

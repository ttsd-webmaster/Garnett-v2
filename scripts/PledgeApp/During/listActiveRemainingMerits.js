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

function shouldCountTowardsMeritCap(merit) {
  const nonPCStandardizedMerit =
    merit.type === 'standardized' &&
    merit.description !== 'PC Merits';

  const shouldCountTowardsMeritCap =
    merit.type === 'personal' ||
    merit.type === 'interview' ||
    nonPCStandardizedMerit;

  return shouldCountTowardsMeritCap;
}

// Capitalize the first letter of every word in the given string
const activeName = process.argv[2].match(/[A-Z][a-z]+|[0-9]+/g).join(' ');
const pledgeName = process.argv[3].match(/[A-Z][a-z]+|[0-9]+/g).join(' ');
const meritsRef = admin.database().ref('/merits');
let remainingMerits = 100;

meritsRef.once('value', (merits) => {
  merits.forEach((merit) => {
    if ((activeName === merit.val().activeName) &&
        (pledgeName === merit.val().pledgeName) &&
        shouldCountTowardsMeritCap(merit.val())) {
      console.log(merit.val().type, merit.val().description)
      remainingMerits -= merit.val().amount;
    }
  });

  console.log(remainingMerits);
});

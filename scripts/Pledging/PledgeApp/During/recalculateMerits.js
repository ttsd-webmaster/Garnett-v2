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

const usersRef = admin.database().ref('/users/');
const meritsRef = admin.database().ref('/merits');

 // Set merits
usersRef.once('value', (users) => {
  users.forEach((user) => {
    // Reset merit amounts
    if (user.val().status === 'alumni') {
      users.forEach((pledge) => {
        if (pledge.val().status === 'pledge') {
          user.ref.child(`/Pledges/${pledge.key}`).update({ merits: 200 });
        }
      })
    } else if (user.val().status === 'active') {
      users.forEach((pledge) => {
        if (pledge.val().status === 'pledge') {
          user.ref.child(`/Pledges/${pledge.key}`).update({ merits: 100 });
        }
      })
    }
  })

  // Recalculate merit amounts for each active and alumni
  meritsRef.once('value', (merits) => {
    merits.forEach((merit) => {
      const activeName = merit.val().activeName.replace(/ /g, '');
      const pledgeName = merit.val().pledgeName.replace(/ /g, '');
      const activeMeritsRef = usersRef.child(`/${activeName}/Pledges/${pledgeName}`);
      activeMeritsRef.child('merits').once('value', (meritCount) => {
        const merits = meritCount.val() - merit.val().amount;
        activeMeritsRef.update({ merits });
        console.log(`Recalculated merits for ${merit.val().activeName}`);
      });
    });
  })
});

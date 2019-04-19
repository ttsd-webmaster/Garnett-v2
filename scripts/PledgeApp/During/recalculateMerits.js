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
let usersMerits = {};

 // Set merits
usersRef.once('value', (users) => {
  users.forEach((user) => {
    if (user.val().status !== 'pledge') {
      usersMerits[user.key] = {};
      // Reset merit amounts
      if (user.val().status === 'alumni') {
        users.forEach((pledge) => {
          if (pledge.val().status === 'pledge') {
            usersMerits[user.key][pledge.key] = 200;
          }
        });
      } else if (user.val().status === 'active') {
        users.forEach((pledge) => {
          if (pledge.val().status === 'pledge') {
            usersMerits[user.key][pledge.key] = 100;
          }
        });
      } else if (user.val().status === 'pipm') {
        users.forEach((pledge) => {
          if (pledge.val().status === 'pledge') {
            usersMerits[user.key][pledge.key] = 'Unlimited';
          }
        });
      }
    }
  });

  // Recalculate merit amounts for each active and alumni
  meritsRef.once('value', (merits) => {
    merits.forEach((merit) => {
      const activeName = merit.val().activeName.replace(/ /g, '');
      const pledgeName = merit.val().pledgeName.replace(/ /g, '');
      if (usersMerits[activeName][pledgeName] !== 'Unlimited') {
        usersMerits[activeName][pledgeName] = usersMerits[activeName][pledgeName] - merit.val().amount;
      }
    });

    usersMerits = Object.keys(usersMerits).map(function(key) {
      return [key, usersMerits[key]];
    });

    usersMerits.forEach((userMerits) => {
      const userKey = userMerits[0];
      pledgeMerits = Object.keys(userMerits[1]).map(function(key) {
        return [key, userMerits[1][key]];
      });
      pledgeMerits.forEach((pledgeInfo) => {
        const pledgeKey = pledgeInfo[0];
        const merits = pledgeInfo[1];
        usersRef.child(userKey).child(`/Pledges/${pledgeKey}`).update({ merits });
        console.log(`${userKey} has ${merits} merits left for ${pledgeKey}`);
      })
    });
  });
});

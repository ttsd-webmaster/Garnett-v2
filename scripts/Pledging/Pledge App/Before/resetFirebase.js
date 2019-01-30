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
let approvedComplaints = admin.database().ref('/approvedComplaints');
let pendingComplaints = admin.database().ref('/pendingComplaints');
let chalkboards = admin.database().ref('/chalkboards');

approvedComplaints.remove();
pendingComplaints.remove();
chalkboards.remove();

usersRef.once('value', (snapshot) => {
  snapshot.forEach((user) => {
    let userRef = admin.database().ref('/users/' + user.key);

    console.log(`Reset data for ${user.key}`)

    if (user.val().status === 'pledge') {
      userRef.update({
        Merits: null,
        Complaints: null,
        totalMerits: 0
      });
    }
    else {
      userRef.update({
        Merits: null,
        Complaints: null,
        Pledges: null,
        totalMerits: null
      });

      usersRef.once('value', (snapshot) => {
        snapshot.forEach((child) => {
          if (child.val().status === 'pledge') {
            let pledgeName = child.key;

            if (user.val().status === 'alumni') {
              userRef.child('/Pledges/' + pledgeName).update({
                merits: 200
              });
            }
            else if (user.val().status === 'pipm') {
              userRef.child('/Pledges/' + pledgeName).update({
                merits: 'Unlimited'
              }); 
            }
            else {
              userRef.child('/Pledges/' + pledgeName).update({
                merits: 100
              });
            }
          }
        });
      });
    }
  });
});

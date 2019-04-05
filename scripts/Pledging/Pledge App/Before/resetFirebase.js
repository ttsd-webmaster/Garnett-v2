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
const approvedComplaints = admin.database().ref('/approvedComplaints');
const pendingComplaints = admin.database().ref('/pendingComplaints');
const chalkboards = admin.database().ref('/chalkboards');

meritsRef.remove();
approvedComplaints.remove();
pendingComplaints.remove();
chalkboards.remove();

usersRef.once('value', (snapshot) => {
  snapshot.forEach((user) => {
    const userRef = admin.database().ref('/users/' + user.key);

    console.log(`Reset data for ${user.key}`)

    userRef.update({
      Merits: null,
      Complaints: null,
      Pledges: null,
      totalMerits: 0
    });

    // Update the active's pledge merit count for each pledge
    if (user.val().status !== 'pledge') {
      usersRef.once('value', (snapshot) => {
        snapshot.forEach((child) => {
          if (child.val().status === 'pledge') {
            const pledgeName = child.key;
            switch (user.val().status) {
              case 'alumni':
                userRef.child(`/Pledges/${pledgeName}`).update({
                  merits: 200
                });
                break;
              case 'pipm':
                userRef.child(`/Pledges/${pledgeName}`).update({
                  merits: 'Unlimited'
                });
                break;
              default:
                userRef.child(`/Pledges/${pledgeName}`).update({
                  merits: 100
                });
            }
          }
        });
      });
    }
  });
});

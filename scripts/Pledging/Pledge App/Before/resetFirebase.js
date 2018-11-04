const admin = require("firebase-admin");
var serviceAccount = require("../../../../serviceAccountKey.json");
require('dotenv').config({ path: process.env.OLDPWD + '/.env' })

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
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

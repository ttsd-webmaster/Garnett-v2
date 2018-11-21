const admin = require("firebase-admin");
var serviceAccount = require("../../../serviceAccountKey.json");
require('dotenv').config({ path: `${process.env.HOME}/Projects/React/Garnett/.env` });

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

let rusheesRef = admin.database().ref('/rushees');
let usersRef = admin.database().ref('/users');
let activeArray = [];

usersRef.once('value', (snapshot) => {
  snapshot.forEach((user) => {
    if (user.val().status !== 'pledge' && user.val().status !== 'alumni') {
      let activeName = user.key;
      
      rusheesRef.once('value', (snapshot) => {
        snapshot.forEach((rushee) => {
          rushee.ref.child('/Actives/' + activeName).update({
            vote: 'false',
            voted: false,
            interacted: false
          });
          rushee.ref.update({
            totalVotes: 0,
            votes: 0,
            totalInteractions: 0
          });
        });
      });
    }
  });
});

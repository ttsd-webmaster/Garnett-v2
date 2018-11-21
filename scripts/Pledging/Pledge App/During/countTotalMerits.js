const admin = require("firebase-admin");
var serviceAccount = require("../../../../serviceAccountKey.json");
require('dotenv').config({ path: `${process.env.HOME}/Projects/React/Garnett/.env` });

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
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

const admin = require("firebase-admin");
var serviceAccount = require("../../../serviceAccountKey.json");
require('dotenv').config({ path: process.env.OLDPWD + '/.env' })

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
})

let usersRef = admin.database().ref('/users');
let meritsRef = admin.database().ref('/merits');

usersRef.once('value', (users) => {
  users.forEach((user) => {
    if (user.val().status == 'pledge' && user.val().Merits) {
      let merits = [];
      merits = Object.keys(user.val().Merits).map(function(key) {
        return user.val().Merits[key];
      })
      meritsRef.once('value', (allMerits) => {
        merits.forEach((merit) => {
          if (allMerits.val()[merit] !== null && !allMerits.val()[merit].pledgeName) {
            meritsRef.child(merit).update({
              pledgeName: `${user.val().firstName} ${user.val().lastName}`,
              pledgePhoto: user.val().photoURL,
            })
          }
        })
      });
    }
  });
});

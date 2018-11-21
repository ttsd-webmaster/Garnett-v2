const admin = require("firebase-admin");
var serviceAccount = require("../../../serviceAccountKey.json");
require('dotenv').config({ path: `${process.env.HOME}/Projects/React/Garnett/.env` });

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
})

let usersRef = admin.database().ref('/users');
let meritsRef = admin.database().ref('/merits');

usersRef.once('value', (users) => {
  users.forEach((user) => {
    if (user.val().Merits) {
      user.ref.child('Merits').remove();
    }
  });
});

meritsRef.once('value', (merits) => {
  merits.forEach((merit) => {
    const activeName = merit.val().activeName.replace(/ /g, '');
    const pledgeName = merit.val().pledgeName.replace(/ /g, '');

    usersRef.child(activeName).child('Merits').push(merit.key);
    usersRef.child(pledgeName).child('Merits').push(merit.key);
  })
});

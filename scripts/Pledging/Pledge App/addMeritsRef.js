const admin = require("firebase-admin");
var serviceAccount = require("../../../serviceAccountKey.json");
require('dotenv').config({ path: process.env.OLDPWD + '/.env' })

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
})

let usersRef = admin.database().ref('/users/');
let meritsRef = admin.database().ref('/merits');

usersRef.once('value', (snapshot) => {
  let merits = [];

  snapshot.forEach((user) => {
    if (user.val().Merits) {
      let userMerits = Object.keys(user.val().Merits).map(function(key) {
        return user.val().Merits[key];
      });

      userMerits.forEach((merit) => {
        let updatedMerit;
        if (user.val().status === 'pledge') {
          updatedMerit = {
            activeName: merit.name,
            activePhoto: merit.photoURL,
            pledgeName: `${user.val().firstName} ${user.val().lastName}`,
            pledgePhoto: user.val().photoURL,
            description: merit.description,
            amount: merit.amount,
            date: merit.date
          }
        } else {
          updatedMerit = {
            activeName: `${user.val().firstName} ${user.val().lastName}`,
            activePhoto: user.val().photoURL,
            pledgeName: merit.name,
            pledgePhoto: merit.photoURL,
            description: merit.description,
            amount: merit.amount,
            date: merit.date
          }
        }
        merits.push(updatedMerit)
      });
    }
  })

  merits = merits.filter((merit, index, self) =>
    index === self.findIndex((m) => (
      m.description === merit.description && m.name === merit.name
    ))
  )

  merits.forEach((merit) => {
    meritsRef.push(merit)
  })
})

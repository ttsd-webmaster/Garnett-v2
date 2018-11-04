const admin = require("firebase-admin");
var serviceAccount = require("../../../../serviceAccountKey.json");
require('dotenv').config({ path: process.env.OLDPWD + '/.env' })

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
})

let usersRef = admin.database().ref('/users/');

usersRef.once('value', (snapshot) => {
  snapshot.forEach((active) => {
    if (active.val().status !== 'pledge') {
      const fullName = `${active.val().firstName} ${active.val().lastName}`;

      console.log(fullName)

      active.ref.child('Merits').remove();

      snapshot.forEach((pledge) => {
        if (pledge.val().status === 'pledge' && pledge.val().Merits) {
          const merits = Object.keys(pledge.val().Merits).map(function(key) {
            return pledge.val().Merits[key];
          });

          merits.forEach((merit) => {
            if (merit.name === fullName) {
              merit.name = `${pledge.val().firstName } ${pledge.val().lastName}`;
              merit.photoURL = pledge.val().photoURL;
              active.ref.child('Merits').push(merit);
            }
          })
        }
      })

      console.log('Updated merits');
    }
  })
})

const admin = require("firebase-admin");
var serviceAccount = require("../../../../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://garnett-42475.firebaseio.com"
})

let usersRef = admin.database().ref('/users/');
let chalkboardsRef = admin.database().ref('/chalkboards');
let complaintsRef = admin.database().ref('/approvedComplaints');

usersRef.once('value', (snapshot) => {
  snapshot.forEach((active) => {
    if (active.val().status !== 'pledge') {
      const fullName = `${active.val().firstName} ${active.val().lastName}`;

      console.log(fullName)

      snapshot.forEach((pledge) => {
        if (pledge.val().status === 'pledge') {
          const merits = Object.keys(pledge.val().Merits).map(function(key) {
            return pledge.val().Merits[key];
          });

          merits.forEach((merit) => {
            if (merit.name === fullName) {
              active.ref.child('Merits').push(merit);
            }
          })
        }
      })
    }
  })
})

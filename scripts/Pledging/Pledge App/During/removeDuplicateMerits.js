const admin = require("firebase-admin");
const equal = require('deep-equal');
var serviceAccount = require("../../../../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://garnett-42475.firebaseio.com"
})

let usersRef = admin.database().ref('/users/');
let chalkboardsRef = admin.database().ref('/chalkboards');
let complaintsRef = admin.database().ref('/approvedComplaints');

usersRef.once('value', (snapshot) => {
  snapshot.forEach((user) => {
    if (user.val().status === 'pledge') {
      const result = [];
      let merits = Object.keys(user.val().Merits).map(function(key) {
        return user.val().Merits[key];
      });

      merits = merits.filter((merit, index, self) =>
        index === self.findIndex((m) => (
          m.description === merit.description && m.name === merit.name
        ))
      )

      user.ref.update({
        Merits: merits
      });
    }
  })
})
const admin = require("firebase-admin");
var serviceAccount = require("../../../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://garnett-42475.firebaseio.com"
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

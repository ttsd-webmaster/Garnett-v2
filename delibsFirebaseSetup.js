const admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://garnett-42475.firebaseio.com"
})

let rusheesRef = admin.database().ref('/rushees');
let usersRef = admin.database().ref('/users');
let activeArray = [];

usersRef.once('value', (snapshot) => {
  snapshot.forEach((child) => {
    if (child.val().status !== 'pledge' && child.val().status !== 'alumni') {
      let activeName = child.key;
      
      rusheesRef.once('value', (snapshot) => {
        snapshot.forEach((child) => {
          child.ref.child('/Actives/' + activeName).update({
            vote: 'false',
            voted: false
          });
          child.ref.update({
            totalVotes: 0,
            votes: 0
          });
        });
      });
    }
  });
});

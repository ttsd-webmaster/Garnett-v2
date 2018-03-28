const admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://garnett-42475.firebaseio.com"
})

let usersRef = admin.database().ref('/users/');
let approvedComplaints = admin.database().ref('/approvedComplaints');
let pendingComplaints = admin.database().ref('/pendingComplaints');
let chalkboards = admin.database().ref('/chalkboards');

approvedComplaints.remove();
pendingComplaints.remove();
chalkboards.remove();

usersRef.once('value', (snapshot) => {
  snapshot.forEach((user) => {
    let userRef = admin.database().ref('/users/' + user.key);

    if (user.val().status === 'pledge') {
      userRef.update({
        Complaints: null,
        Merits: null,
        totalMerits: 0
      });
    }
    else {
      userRef.update({
        Pledges: null
      });

      usersRef.once('value', (snapshot) => {
        snapshot.forEach((child) => {
          if (child.val().status === 'pledge') {
            let pledgeName = child.key;

            if (user.val().status === 'alumni') {
              userRef.child('/Pledges/' + pledgeName).update({
                merits: 200
              });
            }
            else {
              userRef.child('/Pledges/' + pledgeName).update({
                merits: 100
              });
            }
          }
        });
      });
    }
  });
});

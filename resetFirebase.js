const admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://garnett-42475.firebaseio.com"
})

let dbRef = admin.database().ref('/users/');

dbRef.once('value', (snapshot) => {
  snapshot.forEach((child) => {
    let childRef = admin.database().ref('/users/' + child.key);

    if (child.val().status === 'pledge') {
      childRef.update({
        Complaints: null,
        Merits: null,
        totalMerits: 0
      });
    }
    else {
      childRef.update({
        Pledges: null
      });

      dbRef.once('value', (snapshot) => {
        snapshot.forEach((child) => {
          if (child.val().status === 'pledge') {
            let pledgeName = child.key;

            if (child.val().status === 'alumni') {
              childRef.child('/Pledges/' + pledgeName).update({
                merits: 200
              });
            }
            else {
              childRef.child('/Pledges/' + pledgeName).update({
                merits: 100
              });
            }
          }
        });
      });
    }
  });
});

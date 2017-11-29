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
        totalMerits: 0,
      });
    }
    else if (child.val().status === 'active') {
      let activePledgeRef = childRef.child('/Pledges/');
      let pledgeArray = [];

      activePledgeRef.once('value', (pledges) => {
        if (pledges.val()) {
          pledgeArray = Object.keys(pledges.val()).map(function(key) {
            return key;
          });
          pledgeArray.forEach((pledge) => {
            let pledgeRef = admin.database().ref('/users/' + child.key + '/Pledges/' + pledge);
            pledgeRef.update({
              merits: 100
            });
          });
        }
      });
    }
  });
});

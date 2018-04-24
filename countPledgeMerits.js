const admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://garnett-42475.firebaseio.com"
})

let usersRef = admin.database().ref('/users/');

usersRef.once('value', (snapshot) => {
  snapshot.forEach((user) => {
    if (user.val().status === 'pledge') {
      let totalMerits = 0;
      let meritRef = user.ref.child('Merits');

      meritRef.once('value', (merits) => {
        merits.forEach((merit) => {
          totalMerits += merit.val().amount;
        });

        console.log(`Previous: ${user.key} ${totalMerits}`);

        user.ref.update({
          totalMerits: totalMerits
        });

        console.log(`Updated: ${user.key} ${totalMerits}`);
      }); 
    }
  });
});

const admin = require("firebase-admin");
var serviceAccount = require("../../../../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://garnett-42475.firebaseio.com"
})

let usersRef = admin.database().ref('/users/');

usersRef.once('value', (snapshot) => {
  snapshot.forEach((user) => {
    let totalMerits = 0;

    if (user.val().Merits) {
      const merits = Object.keys(user.val().Merits).map(function(key) {
        return user.val().Merits[key];
      });

      merits.forEach((merit) => {
        totalMerits += merit.amount;
      })
    }

    console.log(`Previous: ${user.key} had ${user.val().totalMerits}`);

    user.ref.update({ totalMerits });

    console.log(`Updated: ${user.key} has ${totalMerits}`);
  });
});

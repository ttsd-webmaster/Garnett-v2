const admin = require("firebase-admin");
var serviceAccount = require("../../../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://garnett-42475.firebaseio.com"
})

let usersRef = admin.database().ref('/users/');

usersRef.once('value', (snapshot) => {
  snapshot.forEach((user) => {
    if (user.val().status === 'pledge') {
      console.log(user.key);

      user.ref.update({
        status: 'active'
      });

      user.ref.child('Merits').remove(() => {
        console.log(`Removed merits for ${user.key}.`);
      });

      user.ref.child('totalMerits').remove(() => {
        console.log(`Removed total merits for ${user.key}.`);
      });
    }
  });
});

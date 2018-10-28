const admin = require("firebase-admin");
var serviceAccount = require("../../../../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://garnett-42475.firebaseio.com"
})

let usersRef = admin.database().ref('/users/');

usersRef.once('value', (snapshot) => {
  snapshot.forEach((user) => {
    if (user.val().status === 'pledge') {
      console.log(user.key);

      // Update pledge's status to active
      user.ref.update({
        status: 'active'
      });

      // Remove Merits for pledge
      user.ref.child('Merits').remove(() => {
        console.log(`Removed merits for ${user.key}.`);
      });
      // Remove Complaints for pledge
      user.ref.child('Complaints').remove(() => {
        console.log(`Removed complaints for ${user.key}.`);
      });
      // Remove total merits for pledge
      user.ref.child('totalMerits').remove(() => {
        console.log(`Removed total merits for ${user.key}.`);
      });
    }
  });
});

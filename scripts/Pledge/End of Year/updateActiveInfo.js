const admin = require("firebase-admin");
var serviceAccount = require("../../../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://garnett-42475.firebaseio.com"
})

let usersRef = admin.database().ref('/users/');

usersRef.once('value', (snapshot) => {
  snapshot.forEach((user) => {
    let oldYear = parseInt(user.val().year.charAt(0));
    let updatedYear = (oldYear + 1).toString() + 'th Year';
    let updatedStatus = 'active';

    if (user.val().status !== 'alumni') {
      if (user.val().status === 'pledge') {
        updatedStatus = 'pledge';
      }

      if (user.val().year === '4th Year' || user.val().year === '5th Year') {
        updatedStatus = 'alumni';
        updatedYear = 'Alumni';
      }

      console.log(user.key, updatedStatus, updatedYear);

      user.ref.update({
        status: updatedStatus,
        year: updatedYear
      });
    }
  });
});

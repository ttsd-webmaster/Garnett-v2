const admin = require("firebase-admin");
var serviceAccount = require("../../../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://garnett-42475.firebaseio.com"
})

let usersRef = admin.database().ref('/users/');

usersRef.once('value', (snapshot) => {
  snapshot.forEach((user) => {
    // Updates status and year for all users except alumni
    if (user.val().status !== 'alumni') {
      let newYear = parseInt(user.val().year.charAt(0)) + 1;
      let yearString = 'th Year';

      if (newYear === 2) {
        yearString = 'nd Year';
      }
      else if (newYear === 3) {
        yearString = 'rd Year';
      }

      let updatedYear = newYear + yearString;
      let updatedStatus = 'active';

      // Keeps pledge's status as pledge
      if (user.val().status === 'pledge') {
        updatedStatus = 'pledge';
      }
      // Updates 4th and 5th years to be alumni
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

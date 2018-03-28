const admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://garnett-42475.firebaseio.com"
})

let usersRef = admin.database().ref('/users');

usersRef.once('value', (snapshot) => {
  snapshot.forEach((user) => {
    let userRef = admin.database().ref('/users/' + user.key);
    let bucket = admin.storage().bucket("garnett-42475.appspot.com");

    bucket.file(`${user.key}.jpg`).getSignedUrl({
      action: 'read',
      expires: '03-17-2025'
    })
    .then((url) => {
      userRef.update({
        photoURL: url[0]
      });
    })
    .catch((err) => {
      console.log(err);
    })
  });
});

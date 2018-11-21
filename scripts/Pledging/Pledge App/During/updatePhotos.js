var urlExists = require('url-exists');
const admin = require("firebase-admin");
var serviceAccount = require("../../../../serviceAccountKey.json");
require('dotenv').config({ path: `${process.env.HOME}/Projects/React/Garnett/.env` });

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

let usersRef = admin.database().ref('/users');

usersRef.once('value', (snapshot) => {
  snapshot.forEach((user) => {
    let defaultPhoto = 'https://cdn1.iconfinder.com/data/icons/ninja-things-1/720/ninja-background-512.png';
    let userRef = admin.database().ref('/users/' + user.key);
    let bucket = admin.storage().bucket("garnett-42475.appspot.com");

    bucket.file(`${user.key}.jpg`).getSignedUrl({
      action: 'read',
      expires: '03-17-2025'
    })
    .then((url) => {
      urlExists(url[0], function(err, exists) {
        if (exists) {
          userRef.update({
            photoURL: url[0]
          });
        }
        else {
          bucket.file(`${user.key}.JPG`).getSignedUrl({
            action: 'read',
            expires: '03-17-2025'
          })
          .then((url) => {
            urlExists(url[0], function(err, exists) {
              if (exists) {
                userRef.update({
                  photoURL: url[0]
                });
              }
              else {
                urlExists(url[0], function(err, exists) {
                  if (exists) {
                    userRef.update({
                      photoURL: url[0]
                    });
                  }
                  else {
                    userRef.update({
                      photoURL: defaultPhoto
                    });
                  }
                });
              }
            });
          })
          .catch((err) => {
            console.log(err);
          })
        }
      });
    })
    .catch((err) => {
      console.log(err);
    })
  });
});

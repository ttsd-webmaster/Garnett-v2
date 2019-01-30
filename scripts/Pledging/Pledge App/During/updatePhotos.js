var urlExists = require('url-exists');
const admin = require("firebase-admin");
require('dotenv').config({ path: `${process.env.HOME}/Projects/React/Garnett/.env` });

admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL
})

let usersRef = admin.database().ref('/users');

usersRef.once('value', (snapshot) => {
  snapshot.forEach((user) => {
    let defaultPhoto = 'https://cdn1.iconfinder.com/data/icons/ninja-things-1/720/ninja-background-512.png';
    let userRef = admin.database().ref('/users/' + user.key);
    let bucket = admin.storage().bucket("garnett-230209.appspot.com");

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

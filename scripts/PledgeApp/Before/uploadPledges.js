const folder = './images';
const fs = require('fs');
const urlExists = require('url-exists');
const admin = require('firebase-admin');
require('dotenv').config({ path: `${process.env.HOME}/Projects/React/Garnett/.env` });

***REMOVED***
***REMOVED***
***REMOVED***
***REMOVED***
***REMOVED***
***REMOVED***
***REMOVED***
***REMOVED***
***REMOVED***
***REMOVED***
***REMOVED***
***REMOVED***
***REMOVED***
***REMOVED***
***REMOVED***
***REMOVED***
***REMOVED***
***REMOVED***



admin.initializeApp({
  credential: admin.credential.cert({
    type: FIREBASE_TYPE,
    project_id: FIREBASE_PROJECT_ID,
    private_key_id: FIREBASE_PRIVATE_KEY_ID,
    private_key: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: FIREBASE_CLIENT_EMAIL,
    client_id: FIREBASE_CLIENT_ID,
    auth_uri: FIREBASE_AUTH_URI,
    token_uri: FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: FIREBASE_CLIENT_X509_CERT_URL
  }),
  databaseURL: FIREBASE_DATABASE_URL
})

const bucket = admin.storage().bucket('garnett-230209.appspot.com');
const usersRef = admin.database().ref('/users');

function uploadFile(file) {
  const userName = file.slice(0, -4);
  const names = userName.match(/[A-Z][a-z]+/g);
  const userRef = usersRef.child(userName);
  console.log(names)
  bucket.upload(`images/${file}`, {
    destination: file,
    gzip: true,
    metadata: {
      cacheControl: 'public, max-age=31536000'
    }
  }).then(() => {
    const uploadedFile = bucket.file(file);
    uploadedFile.getSignedUrl({ action: 'read', expires: '03-17-2027' })
    .then((signedUrls) => {
      console.log(`Updated ${userName}'s photo`);
      userRef.update({
        firstName: names[0],
        lastName: names[1],
        class: 'Alpha Epsilon',
        email: 'alphaepsilon@thetatau.org',
        year: '1st Year',
        status: 'pledge',
        phone: '1234567890',
        major: 'Computer Science',
        photoURL: signedUrls[0]
      });
    })
    .catch((err) => console.error(err));
  }).catch(err => {
    console.error('ERROR:', err);
  });
}

fs.readdir(folder, (err, files) => {
  files.forEach(file => {
    const userName = file.slice(0, -4);
    const jpg = `${userName}.jpg`;
    const JPG = `${userName}.JPG`;
    bucket.file(jpg).delete()
    .then(() => {
      uploadFile(file);
    })
    .catch((error) => {
      bucket.file(JPG).delete()
      .then(() => {
        uploadFile(file);
      })
      .catch((error) => {
        uploadFile(file);
      });
    });
  });
});

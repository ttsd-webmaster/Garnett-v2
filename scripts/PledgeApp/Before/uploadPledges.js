const folder = './images';
const fs = require('fs');
const urlExists = require('url-exists');
const admin = require('firebase-admin');
require('dotenv').config({ path: `/Users/julianyan/Desktop/tt webmaster/Garnett-v2/controllers/.env` });

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
});

const bucket = admin.storage().bucket('garnett-230209.appspot.com');
const usersRef = admin.database().ref('/users');

function uploadFile(file) {
  const userName = file.slice(0, -4);
  const names = userName.match(/[A-Z][a-z]+/g);
  const userRef = usersRef.child(userName);

  bucket.upload(`images/${file}`, {
    destination: file,
    gzip: true,
    metadata: {
      cacheControl: 'public, max-age=31536000'
    }
  }).then(() => {
    const uploadedFile = bucket.file(file);
    uploadedFile.getSignedUrl({ action: 'read', expires: '03-17-2025' })
    .then((signedUrls) => {
      console.log(`Updated ${userName}'s photo`);
      userRef.update({
        firstName: names[0],
        lastName: names[1],
        class: 'Alpha Gamma',
        email: 'arkhanna@ucsd.edu',
        year: '1st Year',
        status: 'pledge',
        phone: '9258170137',
        major: 'Data Science',
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

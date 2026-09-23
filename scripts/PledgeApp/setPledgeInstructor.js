/**
 * Hands the pledge instructor role to a new brother.
 *
 * The app has no separate PI field: the pledge instructor and the pledge
 * marshal both carry the `pipm` status. This script only touches the two
 * people named below, so the other pipm user (the PM) keeps their access.
 *
 * Dry run by default. Nothing is written until you pass --commit:
 *
 *   node scripts/PledgeApp/setPledgeInstructor.js            (preview)
 *   node scripts/PledgeApp/setPledgeInstructor.js --commit   (apply)
 */
const path = require('path');
const fs = require('fs');
const admin = require('firebase-admin');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Who takes over, who steps down, and the new PI's photo
const INCOMING = 'EmanuelNader';
const OUTGOING = 'BenedictPham';
// The PI uses the shared pledge instructor badge, not a personal photo.
// It still uploads under the new PI's user key, which is what the app reads.
const PHOTO = path.join(__dirname, '../../PIPhoto/pi-pfp.jpg');
const BUCKET = 'garnett-230209.appspot.com';
// uploadPhotos.js used 03-17-2026, which has already passed and expires the
// stored photoURL. Keep this far out.
const SIGNED_URL_EXPIRES = '01-01-2100';

const commit = process.argv.includes('--commit');

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
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  storageBucket: BUCKET
});

const usersRef = admin.database().ref('/users');

function getUser(key) {
  return usersRef.child(key).once('value').then((user) => user.val());
}

function name(user) {
  return `${user.firstName} ${user.lastName}`;
}

// Everyone who currently holds pipm, so it is obvious who the PM is
function listPipm() {
  return usersRef.orderByChild('status').equalTo('pipm').once('value').then((users) => {
    const current = [];
    users.forEach((user) => current.push(`${name(user.val())} (${user.key})`));
    return current;
  });
}

// Uploads the new PI's photo and returns a signed URL for it
function uploadPhoto() {
  if (!fs.existsSync(PHOTO)) {
    console.log(`No photo at ${PHOTO}, leaving photoURL alone.`);
    return Promise.resolve(null);
  }

  const destination = `${INCOMING}.jpg`;

  if (!commit) {
    console.log(`Would upload ${path.basename(PHOTO)} to ${BUCKET}/${destination}`);
    return Promise.resolve(null);
  }

  const bucket = admin.storage().bucket(BUCKET);

  return bucket.upload(PHOTO, {
    destination,
    gzip: true,
    metadata: { cacheControl: 'public, max-age=31536000' }
  })
  .then(() => bucket.file(destination).getSignedUrl({
    action: 'read',
    expires: SIGNED_URL_EXPIRES
  }))
  .then((urls) => {
    console.log(`Uploaded ${destination}`);
    return urls[0];
  });
}

Promise.all([getUser(INCOMING), getUser(OUTGOING), listPipm()])
.then(([incoming, outgoing, currentPipm]) => {
  if (!incoming) {
    throw new Error(`${INCOMING} is not in the database. Check the spelling of the key.`);
  }
  if (!outgoing) {
    throw new Error(`${OUTGOING} is not in the database. Check the spelling of the key.`);
  }

  console.log(`\nCurrently pipm: ${currentPipm.join(', ') || 'nobody'}`);
  console.log(`\n${commit ? 'Applying' : 'Dry run, nothing will be written'}:`);
  console.log(`  ${name(incoming)}  ${incoming.status} -> pipm`);
  console.log(`  ${name(outgoing)}  ${outgoing.status} -> active`);

  const untouched = currentPipm.filter((entry) => !entry.includes(`(${OUTGOING})`) && !entry.includes(`(${INCOMING})`));
  if (untouched.length) {
    console.log(`  untouched: ${untouched.join(', ')}`);
  }

  return uploadPhoto().then((photoURL) => {
    if (!commit) {
      console.log('\nRe-run with --commit to apply.');
      return null;
    }

    const update = photoURL ? { status: 'pipm', photoURL } : { status: 'pipm' };

    return usersRef.child(INCOMING).update(update)
      .then(() => usersRef.child(OUTGOING).update({ status: 'active' }))
      .then(() => listPipm())
      .then((after) => console.log(`\nDone. pipm is now: ${after.join(', ')}`));
  });
})
.then(() => process.exit(0))
.catch((error) => {
  console.error(`\nFailed: ${error.message}`);
  process.exit(1);
});

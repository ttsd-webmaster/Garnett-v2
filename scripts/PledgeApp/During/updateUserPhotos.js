/**
 * Replaces users' photos from a folder of images named by user key
 * (firstName + lastName, no spaces), e.g. EvanNgo.jpg.
 *
 * Each image is uploaded to Storage as <key>.jpg, overwriting the old one,
 * and the user's photoURL is pointed at a fresh signed URL. The old Storage
 * files are saved to backups/ next to this script (gitignored) first.
 *
 * Images should already be upright JPGs. Files that don't match a user key
 * are skipped and listed.
 *
 * Dry run by default. Nothing is written until you pass --commit:
 *
 *   node scripts/PledgeApp/During/updateUserPhotos.js <folder>            (preview)
 *   node scripts/PledgeApp/During/updateUserPhotos.js <folder> --commit   (apply)
 */
const path = require('path');
const fs = require('fs');
const admin = require('firebase-admin');
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });

const BUCKET = 'garnett-230209.appspot.com';
// Keep this far out so the stored photoURL doesn't expire
const SIGNED_URL_EXPIRES = '01-01-2100';
const BACKUP_DIR = path.join(__dirname, 'backups');

const commit = process.argv.includes('--commit');
const folder = process.argv.slice(2).find((arg) => !arg.startsWith('--'));

if (!folder || !fs.existsSync(folder)) {
  console.error('Usage: node scripts/PledgeApp/During/updateUserPhotos.js <folder> [--commit]');
  process.exit(1);
}

if (!process.env.FIREBASE_PRIVATE_KEY || !process.env.FIREBASE_DATABASE_URL) {
  console.error(`Missing Firebase credentials. Put the .env file at ${path.join(__dirname, '../../../.env')}`);
  process.exit(1);
}

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

const bucket = admin.storage().bucket(BUCKET);
const usersRef = admin.database().ref('/users');

const images = fs.readdirSync(folder).filter((file) => /\.jpe?g$/i.test(file));

// Old photos were uploaded gzipped, which fails the download checksum
function backUp(destination, backupFolder) {
  const file = bucket.file(destination);
  return file.exists().then(([exists]) => exists &&
    file.download({ destination: path.join(backupFolder, destination), validation: false }));
}

function upload(image, destination) {
  return bucket.upload(path.join(folder, image), {
    destination,
    gzip: true,
    metadata: { contentType: 'image/jpeg', cacheControl: 'public, max-age=31536000' }
  })
  .then(() => bucket.file(destination).getSignedUrl({ action: 'read', expires: SIGNED_URL_EXPIRES }))
  .then((urls) => urls[0]);
}

usersRef.once('value')
.then((snapshot) => {
  const users = snapshot.val() || {};
  const matched = images.filter((image) => users[image.replace(/\.jpe?g$/i, '')]);
  const skipped = images.filter((image) => !matched.includes(image));

  console.log(`\n${commit ? 'Applying' : 'Dry run, nothing will be written'}:`);
  matched.forEach((image) => {
    const key = image.replace(/\.jpe?g$/i, '');
    console.log(`  ${users[key].firstName} ${users[key].lastName} (${key}) <- ${image}`);
  });
  if (skipped.length) {
    console.log(`\n  Skipped, no user with that key: ${skipped.join(', ')}`);
  }
  if (!matched.length) {
    throw new Error('No images match a user key.');
  }

  if (!commit) {
    console.log('\nRe-run with --commit to apply.');
    return null;
  }

  const backupFolder = path.join(BACKUP_DIR, `photos-${new Date().toISOString().replace(/[:.]/g, '-')}`);
  fs.mkdirSync(backupFolder, { recursive: true });

  // One at a time so a failure leaves a clear stopping point
  return matched.reduce((chain, image) => chain.then(() => {
    const key = image.replace(/\.jpe?g$/i, '');
    const destination = `${key}.jpg`;
    return backUp(destination, backupFolder)
      .then(() => upload(image, destination))
      .then((photoURL) => usersRef.child(key).update({ photoURL }))
      .then(() => console.log(`  updated ${key}`));
  }), Promise.resolve())
  .then(() => {
    console.log(`\nDone. Old photos backed up to ${path.relative(process.cwd(), backupFolder)}`);
  });
})
.then(() => process.exit(0))
.catch((error) => {
  console.error(`\nFailed: ${error.message}`);
  process.exit(1);
});

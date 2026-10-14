/**
 * Creates the database records for a new pledge class so they can sign up.
 *
 * Takes a class folder (gitignored, under classes/) holding:
 *   pledges.json   { "class": "Alpha Mu", "pledges": [{ firstName, lastName,
 *                    year, major, phone, email }, ...] }
 *   <key>.jpg      one upright photo per pledge, key = firstName + lastName
 *
 * Each pledge gets /users/<key> with status "pledge" and their photo
 * uploaded to Storage. When they sign up with the pledge code, the first and
 * last name they type have to match their record exactly.
 *
 * Refuses to run while anyone still has status "pledge", because
 * initiatePledges.js would sweep the new class in with the old one. Run that
 * first.
 *
 * Dry run by default. Nothing is written until you pass --commit:
 *
 *   node scripts/PledgeApp/Before/uploadPledges.js <folder>            (preview)
 *   node scripts/PledgeApp/Before/uploadPledges.js <folder> --commit   (apply)
 */
const path = require('path');
const fs = require('fs');
const admin = require('firebase-admin');
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });

const BUCKET = 'garnett-230209.appspot.com';
// Keep this far out so the stored photoURL doesn't expire
const SIGNED_URL_EXPIRES = '01-01-2100';

const commit = process.argv.includes('--commit');
const folder = process.argv.slice(2).find((arg) => !arg.startsWith('--'));

if (!folder || !fs.existsSync(path.join(folder, 'pledges.json'))) {
  console.error('Usage: node scripts/PledgeApp/Before/uploadPledges.js <folder with pledges.json> [--commit]');
  process.exit(1);
}

if (!process.env.FIREBASE_PRIVATE_KEY || !process.env.FIREBASE_DATABASE_URL) {
  console.error(`Missing Firebase credentials. Put the .env file at ${path.join(__dirname, '../../../.env')}`);
  process.exit(1);
}

// The Brothers tab and signup form only know these classes
const KNOWN_CLASSES = (() => {
  const data = fs.readFileSync(
    path.join(__dirname, '../../../client/src/containers/PledgeApp/components/Contacts/data.js'),
    'utf8'
  );
  const classBlock = data.match(/class:\s*\[([\s\S]*?)\]/);
  return classBlock ? classBlock[1].match(/"([^"]+)"/g).map((c) => c.slice(1, -1)) : [];
})();

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

const { class: className, pledges } = JSON.parse(fs.readFileSync(path.join(folder, 'pledges.json'), 'utf8'));
const keyFor = (pledge) => (pledge.firstName + pledge.lastName).replace(/\s/g, '');

function upload(photo, destination) {
  return bucket.upload(photo, {
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
  const currentPledges = Object.keys(users).filter((key) => users[key].status === 'pledge');

  console.log(`\n${commit ? 'Applying' : 'Dry run, nothing will be written'}: ${pledges.length} pledges in ${className}`);
  pledges.forEach((pledge) => {
    const key = keyFor(pledge);
    const photo = fs.existsSync(path.join(folder, `${key}.jpg`)) ? `${key}.jpg` : 'NO PHOTO';
    console.log(`  ${pledge.firstName} ${pledge.lastName} (${key}), ${pledge.year}, ${pledge.major}, ${photo}`);
  });

  const problems = [];
  if (!KNOWN_CLASSES.includes(className)) {
    problems.push(`"${className}" isn't in Contacts/data.js.`);
  }
  if (currentPledges.length) {
    problems.push(`${currentPledges.length} users are still pledges. Run initiatePledges.js first.`);
  }
  const taken = pledges.map(keyFor).filter((key) => users[key]);
  if (taken.length) {
    problems.push(`Already in the database: ${taken.join(', ')}`);
  }
  const missingPhotos = pledges.map(keyFor).filter((key) => !fs.existsSync(path.join(folder, `${key}.jpg`)));
  if (missingPhotos.length) {
    problems.push(`Missing photos: ${missingPhotos.join(', ')}`);
  }
  if (problems.length) {
    throw new Error(`\n  ${problems.join('\n  ')}`);
  }

  if (!commit) {
    console.log('\nRe-run with --commit to apply.');
    return null;
  }

  // One at a time so a failure leaves a clear stopping point
  return pledges.reduce((chain, pledge) => chain.then(() => {
    const key = keyFor(pledge);
    return upload(path.join(folder, `${key}.jpg`), `${key}.jpg`)
      .then((photoURL) => usersRef.child(key).set({
        firstName: pledge.firstName,
        lastName: pledge.lastName,
        class: className,
        year: pledge.year,
        major: pledge.major,
        phone: pledge.phone,
        email: pledge.email,
        status: 'pledge',
        photoURL
      }))
      .then(() => console.log(`  added ${key}`));
  }), Promise.resolve())
  .then(() => console.log(`\nDone. ${pledges.length} ${className} pledges can now sign up with the pledge code.`));
})
.then(() => process.exit(0))
.catch((error) => {
  console.error(`\nFailed: ${error.message}`);
  process.exit(1);
});

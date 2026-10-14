/**
 * Adds actives directly, for people who join without pledging through the app.
 *
 * Active signup refuses if a record already exists, and sign in needs a
 * verified email, so this creates the whole account: the /users record with
 * status "active", their photo, and a Firebase Auth login (verified, with a
 * random password). They set their own password with "Forgot password" on
 * the login page.
 *
 * Takes a folder (gitignored, under Before/classes/) holding:
 *   actives.json   { "class": "Tau Beta", "actives": [{ firstName, lastName,
 *                    year, major, phone, email }, ...] }
 *   <key>.jpg      one upright photo per person, key = firstName + lastName
 *
 * Dry run by default. Nothing is written until you pass --commit:
 *
 *   node scripts/PledgeApp/During/addActives.js <folder>            (preview)
 *   node scripts/PledgeApp/During/addActives.js <folder> --commit   (apply)
 */
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const admin = require('firebase-admin');
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });

const BUCKET = 'garnett-230209.appspot.com';
// Keep this far out so the stored photoURL doesn't expire
const SIGNED_URL_EXPIRES = '01-01-2100';

const commit = process.argv.includes('--commit');
const folder = process.argv.slice(2).find((arg) => !arg.startsWith('--'));

if (!folder || !fs.existsSync(path.join(folder, 'actives.json'))) {
  console.error('Usage: node scripts/PledgeApp/During/addActives.js <folder with actives.json> [--commit]');
  process.exit(1);
}

if (!process.env.FIREBASE_PRIVATE_KEY || !process.env.FIREBASE_DATABASE_URL) {
  console.error(`Missing Firebase credentials. Put the .env file at ${path.join(__dirname, '../../../.env')}`);
  process.exit(1);
}

// The Brothers tab only groups classes it knows about
const ACTIVE_CLASSES = (() => {
  const data = fs.readFileSync(
    path.join(__dirname, '../../../client/src/containers/PledgeApp/components/Contacts/data.js'),
    'utf8'
  );
  const activeBlock = data.match(/active:\s*\[([\s\S]*?)\]/);
  return activeBlock ? activeBlock[1].match(/"([^"]+)"/g).map((c) => c.slice(1, -1)) : [];
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

const { class: className, actives } = JSON.parse(fs.readFileSync(path.join(folder, 'actives.json'), 'utf8'));
const keyFor = (person) => (person.firstName + person.lastName).replace(/\s/g, '');

function emailTaken(email) {
  return admin.auth().getUserByEmail(email).then(() => true, () => false);
}

function upload(photo, destination) {
  return bucket.upload(photo, {
    destination,
    gzip: true,
    metadata: { contentType: 'image/jpeg', cacheControl: 'public, max-age=31536000' }
  })
  .then(() => bucket.file(destination).getSignedUrl({ action: 'read', expires: SIGNED_URL_EXPIRES }))
  .then((urls) => urls[0]);
}

Promise.all([usersRef.once('value'), Promise.all(actives.map((person) => emailTaken(person.email)))])
.then(([snapshot, takenEmails]) => {
  const users = snapshot.val() || {};

  console.log(`\n${commit ? 'Applying' : 'Dry run, nothing will be written'}: ${actives.length} actives in ${className}`);
  actives.forEach((person) => {
    const key = keyFor(person);
    const photo = fs.existsSync(path.join(folder, `${key}.jpg`)) ? `${key}.jpg` : 'NO PHOTO';
    console.log(`  ${person.firstName} ${person.lastName} (${key}), ${person.year}, ${person.major}, ${person.email}, ${photo}`);
  });

  const problems = [];
  if (!ACTIVE_CLASSES.includes(className)) {
    problems.push(`"${className}" isn't in the active list in Contacts/data.js.`);
  }
  const takenKeys = actives.map(keyFor).filter((key) => users[key]);
  if (takenKeys.length) {
    problems.push(`Already in the database: ${takenKeys.join(', ')}`);
  }
  const usedEmails = actives.filter((_, i) => takenEmails[i]).map((person) => person.email);
  if (usedEmails.length) {
    problems.push(`Email already has a login: ${usedEmails.join(', ')}`);
  }
  const missingPhotos = actives.map(keyFor).filter((key) => !fs.existsSync(path.join(folder, `${key}.jpg`)));
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
  return actives.reduce((chain, person) => chain.then(() => {
    const key = keyFor(person);
    return upload(path.join(folder, `${key}.jpg`), `${key}.jpg`)
      .then((photoURL) => usersRef.child(key).set({
        firstName: person.firstName,
        lastName: person.lastName,
        class: className,
        year: person.year,
        major: person.major,
        phone: person.phone,
        email: person.email,
        status: 'active',
        photoURL
      }))
      // Login looks the user up by displayName, so it has to be the key
      .then(() => admin.auth().createUser({
        email: person.email,
        emailVerified: true,
        displayName: key,
        password: crypto.randomBytes(24).toString('base64')
      }))
      .then(() => console.log(`  added ${key}`));
  }), Promise.resolve())
  .then(() => {
    console.log(`\nDone. They set a password with "Forgot password" on the login page, using their email.`);
  });
})
.then(() => process.exit(0))
.catch((error) => {
  console.error(`\nFailed: ${error.message}`);
  process.exit(1);
});

/**
 * Hands the pledge instructor role to a new brother.
 *
 * The PI is the brother's own account, renamed to "Pledge Instructor <Last>"
 * with the shared PI badge as its photo and a non pledge class, so it drops
 * out of the class groups on the Brothers tab.
 *
 * User keys are `firstName + lastName` with spaces removed, and the Firebase
 * Auth displayName has to match the key or login breaks. So renaming means
 * moving the whole /users record to a new key and updating the Auth
 * displayName. The PI record keeps the brother's original first name, class
 * and photo under `original*` so the next handoff can put them back.
 *
 * The other pipm user (the PM) is never touched.
 *
 * Dry run by default. Nothing is written until you pass --commit:
 *
 *   node scripts/PledgeApp/setPledgeInstructor.js            (preview)
 *   node scripts/PledgeApp/setPledgeInstructor.js --commit   (apply)
 *
 * Afterwards both people need to sign out and back in.
 */
const path = require('path');
const fs = require('fs');
const admin = require('firebase-admin');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Who takes over, by their current user key
const INCOMING = 'EmanuelNader';
// The current PI record. Found automatically if this key doesn't exist.
const OUTGOING = 'PledgeInstructorLam';
// Only used when the outgoing PI record has no saved originals (Ethan's was
// renamed by hand before this script existed). Fill these in if the dry run
// asks for them.
const OUTGOING_FIRST_NAME = 'Ethan';
const OUTGOING_CLASS = 'Alpha Eta';

const PI_FIRST_NAME = 'Pledge Instructor';
// Used when the outgoing PI's class is itself a pledge class
const DEFAULT_PI_CLASS = 'Pledge Instructor';

// The PI uses the shared pledge instructor badge, not a personal photo
const PI_PHOTO = path.join(__dirname, '../../PIPhoto/pi-pfp.jpg');
// The outgoing PI's personal photo, named after their restored key
const photoFor = (key) => path.join(__dirname, `../../PIPhoto/${key}.jpg`);
const BUCKET = 'garnett-230209.appspot.com';
// uploadPhotos.js used 03-17-2026, which has already passed and expires the
// stored photoURL. Keep this far out.
const SIGNED_URL_EXPIRES = '01-01-2100';

const commit = process.argv.includes('--commit');

// Pledge classes the Brothers tab groups by. A PI class outside this list
// keeps the PI out of every class group.
const PLEDGE_CLASSES = (() => {
  const data = fs.readFileSync(
    path.join(__dirname, '../../client/src/containers/PledgeApp/components/Contacts/data.js'),
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

const usersRef = admin.database().ref('/users');
const pointsRef = admin.database().ref('/activePoints');

const keyFor = (firstName, lastName) => (firstName + lastName).replace(/\s/g, '');
const name = (user) => `${user.firstName} ${user.lastName}`;

function getUser(key) {
  return usersRef.child(key).once('value').then((user) => user.val());
}

// Falls back to the pipm user whose first name is the PI title
function findOutgoing() {
  return getUser(OUTGOING).then((user) => {
    if (user) {
      return { key: OUTGOING, user };
    }
    return usersRef.orderByChild('status').equalTo('pipm').once('value').then((users) => {
      const matches = [];
      users.forEach((u) => {
        if ((u.val().firstName || '').toLowerCase() === PI_FIRST_NAME.toLowerCase()) {
          matches.push({ key: u.key, user: u.val() });
        }
      });
      if (matches.length !== 1) {
        throw new Error(`Expected one current PI record, found ${matches.length}. Set OUTGOING to their key.`);
      }
      return matches[0];
    });
  });
}

function listPipm() {
  return usersRef.orderByChild('status').equalTo('pipm').once('value').then((users) => {
    const current = [];
    users.forEach((user) => current.push(`${name(user.val())} (${user.key})`));
    return current;
  });
}

// Uploads a photo under a user key and returns a signed URL for it
function uploadPhoto(photo, userKey) {
  if (!fs.existsSync(photo)) {
    return Promise.resolve(null);
  }

  const destination = `${userKey}.jpg`;

  if (!commit) {
    console.log(`  would upload ${path.basename(photo)} to ${BUCKET}/${destination}`);
    return Promise.resolve(null);
  }

  const bucket = admin.storage().bucket(BUCKET);

  return bucket.upload(photo, {
    destination,
    gzip: true,
    metadata: { cacheControl: 'public, max-age=31536000' }
  })
  .then(() => bucket.file(destination).getSignedUrl({
    action: 'read',
    expires: SIGNED_URL_EXPIRES
  }))
  .then((urls) => urls[0]);
}

// Login looks the user up by their Auth displayName, so it has to follow the key
function renameAuthUser(email, displayName) {
  return admin.auth().getUserByEmail(email)
    .then((authUser) => admin.auth().updateUser(authUser.uid, { displayName }));
}

// Active points are matched to people by full name, so they follow the rename
function renamePoints(fromName, toName, updates) {
  return pointsRef.orderByChild('activeName').equalTo(fromName).once('value').then((points) => {
    let count = 0;
    points.forEach((point) => {
      updates[`/activePoints/${point.key}/activeName`] = toName;
      count += 1;
    });
    return count;
  });
}

Promise.all([getUser(INCOMING), findOutgoing(), listPipm()])
.then(([incoming, outgoingRecord, currentPipm]) => {
  if (!incoming) {
    throw new Error(`${INCOMING} is not in the database. Check the spelling of the key.`);
  }

  const { key: outgoingKey, user: outgoing } = outgoingRecord;

  if (!incoming.email || !outgoing.email) {
    throw new Error('Both records need an email to update their logins.');
  }

  // Put the outgoing PI back to who they were
  const restoredFirstName = outgoing.originalFirstName || OUTGOING_FIRST_NAME;
  const restoredClass = outgoing.originalClass || OUTGOING_CLASS;
  const restoredKey = keyFor(restoredFirstName, outgoing.lastName);

  // Keep whatever non pledge class the PI already used, if any
  const piClass = outgoing.class && !PLEDGE_CLASSES.includes(outgoing.class)
    ? outgoing.class
    : DEFAULT_PI_CLASS;
  const piKey = keyFor(PI_FIRST_NAME, incoming.lastName);

  console.log(`\nCurrently pipm: ${currentPipm.join(', ') || 'nobody'}`);
  console.log(`\n${commit ? 'Applying' : 'Dry run, nothing will be written'}:`);
  console.log(`  ${name(incoming)} (${INCOMING}, ${incoming.class})`);
  console.log(`    -> ${PI_FIRST_NAME} ${incoming.lastName} (${piKey}, ${piClass}), pipm, PI badge`);
  console.log(`  ${name(outgoing)} (${outgoingKey}, ${outgoing.class})`);
  console.log(`    -> ${restoredFirstName} ${outgoing.lastName} (${restoredKey}, ${restoredClass || '?'}), active`);

  if (!restoredClass) {
    throw new Error(
      `${name(outgoing)} has no saved original class. Set OUTGOING_CLASS ` +
      `at the top of this script to their pledge class and re-run.`
    );
  }
  if (!PLEDGE_CLASSES.includes(restoredClass)) {
    throw new Error(`"${restoredClass}" isn't a pledge class the Brothers tab knows.`);
  }

  const collisions = [piKey, restoredKey].filter((key) => key !== INCOMING && key !== outgoingKey);

  return Promise.all(collisions.map(getUser)).then((existing) => {
    const taken = collisions.filter((_, i) => existing[i]);
    if (taken.length) {
      throw new Error(`${taken.join(', ')} already exists. Refusing to overwrite.`);
    }

    const outgoingPhoto = photoFor(restoredKey);
    if (!outgoing.originalPhotoURL && !fs.existsSync(outgoingPhoto)) {
      console.log(`  note: no ${path.relative(process.cwd(), outgoingPhoto)}, so ${restoredFirstName} keeps the PI badge until a photo is added`);
    }

    return Promise.all([
      uploadPhoto(PI_PHOTO, piKey),
      uploadPhoto(outgoingPhoto, restoredKey)
    ]);
  })
  .then(([piPhotoURL, restoredPhotoURL]) => {
    const newPi = Object.assign({}, incoming, {
      firstName: PI_FIRST_NAME,
      status: 'pipm',
      class: piClass,
      photoURL: piPhotoURL || incoming.photoURL,
      originalFirstName: incoming.firstName,
      originalClass: incoming.class,
      originalPhotoURL: incoming.photoURL || ''
    });

    const restored = Object.assign({}, outgoing, {
      firstName: restoredFirstName,
      status: 'active',
      class: restoredClass,
      photoURL: restoredPhotoURL || outgoing.originalPhotoURL || outgoing.photoURL
    });
    delete restored.originalFirstName;
    delete restored.originalClass;
    delete restored.originalPhotoURL;

    // One multi path update, so both moves land together or not at all
    const updates = {
      [`/users/${INCOMING}`]: null,
      [`/users/${outgoingKey}`]: null,
      [`/users/${piKey}`]: newPi,
      [`/users/${restoredKey}`]: restored
    };

    return Promise.all([
      renamePoints(name(incoming), name(newPi), updates),
      renamePoints(name(outgoing), name(restored), updates)
    ]).then(([incomingPoints, outgoingPoints]) => {
      console.log(`  active point awards renamed: ${incomingPoints} + ${outgoingPoints}`);

      if (!commit) {
        console.log('\nRe-run with --commit to apply.');
        return null;
      }

      return admin.database().ref().update(updates)
        .then(() => renameAuthUser(newPi.email, piKey))
        .then(() => renameAuthUser(restored.email, restoredKey))
        .then(() => listPipm())
        .then((after) => {
          console.log(`\nDone. pipm is now: ${after.join(', ')}`);
          console.log('Both of them need to sign out and back in.');
        });
    });
  });
})
.then(() => process.exit(0))
.catch((error) => {
  console.error(`\nFailed: ${error.message}`);
  process.exit(1);
});

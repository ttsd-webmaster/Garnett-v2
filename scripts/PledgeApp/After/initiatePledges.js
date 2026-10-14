/**
 * Initiates the current pledge class and clears out pledge data so the next
 * class can be uploaded.
 *
 * Every user with status "pledge" becomes an active in NEW_CLASS, and their
 * per-user Complaints are dropped. The pledge-only collections below are
 * removed entirely. /activePoints and everything else is left alone.
 *
 * Before anything is removed, the old data is saved to backups/ next to this
 * script (gitignored) so it can be restored if needed.
 *
 * Dry run by default. Nothing is written until you pass --commit:
 *
 *   node scripts/PledgeApp/After/initiatePledges.js            (preview)
 *   node scripts/PledgeApp/After/initiatePledges.js --commit   (apply)
 */
const path = require('path');
const fs = require('fs');
const admin = require('firebase-admin');
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });

const NEW_CLASS = 'Alpha Lambda';

// Pledge-only data, wiped so the next class starts clean
const PLEDGE_COLLECTIONS = [
  'merits',
  'interviews',
  'chalkboards',
  'pendingComplaints',
  'approvedComplaints'
];

const BACKUP_DIR = path.join(__dirname, 'backups');

const commit = process.argv.includes('--commit');

// The Brothers tab only groups classes it knows about
const PLEDGE_CLASSES = (() => {
  const data = fs.readFileSync(
    path.join(__dirname, '../../../client/src/containers/PledgeApp/components/Contacts/data.js'),
    'utf8'
  );
  const classBlock = data.match(/class:\s*\[([\s\S]*?)\]/);
  return classBlock ? classBlock[1].match(/"([^"]+)"/g).map((c) => c.slice(1, -1)) : [];
})();

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
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

const db = admin.database();

const count = (value) => (value ? Object.keys(value).length : 0);

if (!PLEDGE_CLASSES.includes(NEW_CLASS)) {
  console.error(`"${NEW_CLASS}" isn't in Contacts/data.js, so the Brothers tab won't show it.`);
  process.exit(1);
}

Promise.all([
  db.ref('/users').orderByChild('status').equalTo('pledge').once('value'),
  ...PLEDGE_COLLECTIONS.map((name) => db.ref(`/${name}`).once('value'))
])
.then(([pledgesSnap, ...collectionSnaps]) => {
  const pledges = pledgesSnap.val() || {};
  const collections = {};
  PLEDGE_COLLECTIONS.forEach((name, i) => {
    collections[name] = collectionSnaps[i].val();
  });

  console.log(`\n${commit ? 'Applying' : 'Dry run, nothing will be written'}:`);
  console.log(`\n  ${count(pledges)} pledges -> active, ${NEW_CLASS}`);
  Object.keys(pledges).sort().forEach((key) => {
    const { firstName, lastName, class: currentClass } = pledges[key];
    console.log(`    ${firstName} ${lastName} (${key}, was ${currentClass || 'no class'})`);
  });
  console.log('\n  Removing:');
  PLEDGE_COLLECTIONS.forEach((name) => {
    console.log(`    /${name}: ${count(collections[name])} entries`);
  });

  if (!count(pledges)) {
    throw new Error('No users have status "pledge". Already initiated?');
  }

  const updates = {};
  Object.keys(pledges).forEach((key) => {
    updates[`/users/${key}/status`] = 'active';
    updates[`/users/${key}/class`] = NEW_CLASS;
    updates[`/users/${key}/Complaints`] = null;
  });
  PLEDGE_COLLECTIONS.forEach((name) => {
    updates[`/${name}`] = null;
  });

  if (!commit) {
    console.log('\nRe-run with --commit to apply.');
    return null;
  }

  // Back up everything being changed or removed before touching it
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  const backupFile = path.join(BACKUP_DIR, `pledge-data-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
  fs.writeFileSync(backupFile, JSON.stringify({ pledges, ...collections }, null, 2));
  console.log(`\n  Backup saved to ${path.relative(process.cwd(), backupFile)}`);

  // One multi path update, so it all lands together or not at all
  return db.ref().update(updates).then(() => {
    console.log(`\nDone. ${count(pledges)} new ${NEW_CLASS} actives, pledge data cleared.`);
    console.log('They need to sign out and back in to see the active view.');
  });
})
.then(() => process.exit(0))
.catch((error) => {
  console.error(`\nFailed: ${error.message}`);
  process.exit(1);
});

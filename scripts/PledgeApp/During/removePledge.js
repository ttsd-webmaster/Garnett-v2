const admin = require('firebase-admin');
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
});

// Capitalize the first letter of every word in the given string
const removedPledge =
  process.argv[2]
  .toLowerCase()
  .split(' ')
  .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
  .join(' ');
const usersRef = admin.database().ref('/users');
const meritsRef = admin.database().ref('/merits');
const chalkboardsRef = admin.database().ref('/chalkboards');
const approvedComplaintsRef = admin.database().ref('/approvedComplaints');
const pendingComplaintsRef = admin.database().ref('/pendingComplaints');

usersRef.once('value', (users) => {
  users.forEach((user) => {
    const { firstName, lastName, email, status } = user.val();
    const fullName = `${firstName} ${lastName}`;
    if (status === 'pledge' && (removedPledge === fullName)) {
      admin.auth().getUserByEmail(email).then((userRecord) => {
        // Remove pledge from authentication
        admin.auth().deleteUser(userRecord.uid).then(() => {
          console.log(`Removed ${removedPledge} from authentication.`);
          // Remove pledge from database
          user.ref.remove(() => {
            console.log(`Removed ${removedPledge} from database.`);
          });
        })
        .catch((error) => console.error(error));
      })
      .catch((error) => console.error(error));
    } else if (status !== 'pledge') {
      const pledgeDisplayName = removedPledge.replace(/ /g, '');
      // Remove from active's Pledges array
      user.ref.child(`Pledges/${pledgeDisplayName}`).remove(() => {
        console.log(`Removed ${removedPledge} from ${fullName}'s' Pledges array`);
      });
    }
  });
});

// Remove pledge's merits
meritsRef.once('value', (merits) => {
  merits.forEach((merit) => {
    if (merit.val().pledgeName === removedPledge) {
      merit.ref.remove(() => {
        console.log(`Removed ${removedPledge}'s merit from Merits.`);
      });
    }
  });
});

// Remove pledge from chalkboard attendees
chalkboardsRef.once('value', (chalkboards) => {
  chalkboards.forEach((chalkboard) => {
    const attendeesRef = chalkboard.ref.child('attendees');
    attendeesRef.once('value', (attendees) => {
      attendees.forEach((attendee) => {
        if (attendee.val().name === removedPledge) {
          attendee.ref.remove(() => {
            console.log(`Removed ${removedPledge} from Chalkboards.`);
          });
        }
      });
    });
  });
});

// Remove approved complaints
approvedComplaintsRef.once('value', (approvedComplaints) => {
  approvedComplaints.forEach((approvedComplaint) => {
    if (approvedComplaint.val().pledgeDisplayName === removedPledge) {
      approvedComplaint.ref.remove(() => {
        console.log(`Removed ${removedPledge} from Approved Complaints.`);
      });
    }
  });
});

// Remove pending complaints
pendingComplaintsRef.once('value', (pendingComplaints) => {
  pendingComplaints.forEach((pendingComplaint) => {
    if (pendingComplaint.val().pledgeDisplayName === removedPledge) {
      pendingComplaint.ref.remove(() => {
        console.log(`Removed ${removedPledge} from Pending Complaints.`);
      });
    }
  });
});

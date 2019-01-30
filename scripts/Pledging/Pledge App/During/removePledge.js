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
let chalkboardsRef = admin.database().ref('/chalkboards');
let approvedComplaintsRef = admin.database().ref('/approvedComplaints');
let pendingComplaintsRef = admin.database().ref('/pendingComplaints');

usersRef.once('value', (snapshot) => {
  snapshot.forEach((user) => {
    if (user.val().status !== 'pledge') {
      let pledgesRef = user.ref.child('Pledges');

      pledgesRef.once('value', (pledges) => {
        let removedPledge;
        let newPledgeArray = [];
        let pledgeArray = Object.keys(pledges.val()).map(function(key) {
          return key;
        });

        snapshot.forEach((user) => {
          if (user.val().status === 'pledge') {
            newPledgeArray.push(user.key);
          }
        });

        pledgeArray.forEach((pledge) => {
          if (!newPledgeArray.includes(pledge)) {
            removedPledge = pledge;
            pledgesRef.child(pledge).remove(() => {
              console.log(`Removed ${pledge}`);
            });
          }
        });

        chalkboardsRef.once('value', (snapshot) => {
          snapshot.forEach((chalkboard) => {
            let attendeesRef = chalkboard.ref.child('attendees');

            attendeesRef.once('value', (attendees) => {
              attendees.forEach((attendee) => {
                let attendeeName = attendee.val().name.replace(/ /g,'');

                if (attendeeName === removedPledge) {
                  attendee.ref.remove(() => {
                    console.log(`Removed ${attendeeName} from Chalkboards.`);
                  });
                }
              });
            });
          });

          approvedComplaintsRef.once('value', (snapshot) => {
            snapshot.forEach((complaint) => {
              let pledgeName = complaint.val().pledgeDisplayName;

              if (pledgeName === removedPledge) {
                complaint.ref.remove(() => {
                  console.log(`Removed ${pledgeName} from Approved Complaints.`);
                });
              }
            });

            pendingComplaintsRef.once('value', (snapshot) => {
              snapshot.forEach((complaint) => {
                let pledgeName = complaint.val().pledgeDisplayName;

                if (pledgeName === removedPledge) {
                  complaint.ref.remove(() => {
                    console.log(`Removed ${pledgeName} from Pending Complaints.`);
                  });
                }
              });
            });
          });
        });
      });
    }
  });
});

const admin = require("firebase-admin");
var serviceAccount = require("../../../../serviceAccountKey.json");
require('dotenv').config({ path: process.env.OLDPWD + '/.env' })

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
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

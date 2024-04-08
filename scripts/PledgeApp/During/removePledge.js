const admin = require('firebase-admin');
require('dotenv').config({ path: `${process.env.HOME}/Projects/React/Garnett/.env` });

// admin.initializeApp({
//   credential: admin.credential.cert({
//     type: process.env.FIREBASE_TYPE,
//     project_id: process.env.FIREBASE_PROJECT_ID,
//     private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
//     private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
//     client_email: process.env.FIREBASE_CLIENT_EMAIL,
//     client_id: process.env.FIREBASE_CLIENT_ID,
//     auth_uri: process.env.FIREBASE_AUTH_URI,
//     token_uri: process.env.FIREBASE_TOKEN_URI,
//     auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
//     client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
//   }),
//   databaseURL: process.env.FIREBASE_DATABASE_URL
// });

const ACTIVE_AUTHORIZATION_CODE="garnett"
const FIREBASE_API_KEY="AIzaSyBH389MDOmNgFGokEIaeiLe0FzMpmTtwuY"
const FIREBASE_AUTH_DOMAIN="garnett-230209.firebaseapp.com"
const FIREBASE_AUTH_PROVIDER_X509_CERT_URL="https://www.googleapis.com/oauth2/v1/certs"
const FIREBASE_AUTH_URI="https://accounts.google.com/o/oauth2/auth"
const FIREBASE_CLIENT_EMAIL="firebase-adminsdk-3lhy7@garnett-230209.iam.gserviceaccount.com"
const FIREBASE_CLIENT_ID="100275998956866457615"
const FIREBASE_CLIENT_X509_CERT_URL="https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-3lhy7%40garnett-230209.iam.gserviceaccount.com"
const FIREBASE_DATABASE_URL="https://garnett-230209.firebaseio.com"
const FIREBASE_MESSAGING_SENDER_ID="881082882960"
const FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCeEtDHHDfhBwEn\nMoz7/LcLKkxdOG+xPD7mTmeI37B/oj6uGC9gFbgSV7VJVqtBSkDIiiFoYP6XIt0/\nGJcQ3C189UW9OpQ+BOqGWuTn7zTbxjIzQ4kSh4ysbi8Ue+lPtKvdiUUJp+iuJsUu\nK9nozKBohIBTK8Lcs/ZAsIJuzOnovnEXSpV1H4UlvwCrJE+TX9jt5vDZY+UcqTWa\nzS7AcbNjYJINGpgKo5gNgl83FkB1lpFMWOwpubCaTP6YDS3XhpuYub/eIVCJur3P\nqv+KVI2Eu9eWUdbHRRvMryGI9hPYGSMD7AZp8DauPClmk0yll+5B9o7gk9qbPwd/\nc6sLq9/RAgMBAAECggEAC4MBxtpYfHAS5qyhBVHqb6r5LDnJso3ZY9LWaeqmcykY\n6PtUaeozAUz3ZBumdacHcENU+wHDULTmiWuMRttOCcFf/o+nT5vyi23PqU9rmUzG\nB6M1to5+EWmlzpdWjqow8P2H9FPQ12v15K6nXDOYw/vQT55KfuGxP5VLLnAIYd1t\nWH4QbEQl0BmiS3rDtZpWSL4AG65islUNjesH8Gj9ZHIIzi48aqvXkfcyYKm1E4z9\ni44wOITwzK1VUHMVh6zjWVitpVKWwFe6ZAoOBY5uJLcynLUjXEyFCDHCJx+l2x3E\n8Bjt7i/IsCsOlDQ+qh1vAdwjzG9hm23ok4afZRnUFQKBgQDKlv8v2kWet485ktf3\n2bQ3yCXRP2KIfKZuOejtdrlyP3Q8mldbvsJ80jDRfbaQWG51ZX/mWspuqUoNjjsB\ng0RgAwBArB2cFI4nPUoBaOEqPrFU8R7Z6Kl8F/p7X7kL0no/OgJLd2V77VtAjJo+\nLnBes5bJq7Fccf4qAM62hUVspQKBgQDHv10yHyUmVwt1Bd7UtWPr98/NKfTKUO9v\nX64g8o/joFAxqQq6xBg7rfSDhuw/GTlgD0BXVxJ7BOrbzza0eZF3y06tcc3ZOulC\nmc+GCwGBAglrhOHiOnSqP2XE+Ay+tjCROG1vva8JHvI4qfn5s6OsE2NXl/iTcE8s\nPRMoiq3ivQKBgBUr/JVCqV3x7vzkVL+pN8VQnGsmxaRf6oDAepA+hRjkesBOnOyQ\nngCvcryh969UHo8UQW6QdHFmLcAG6jG5Ry8FgURA+IM0PrrpE8/b5xQkIyIuZLv/\nLZ8zXlEAavVKVM5AwLakTq3J22x+hSwUbFfpSsverpVrsFUxamj2uo+lAoGAaU2z\nXhcZSKse+SSNIuo1sVLFlE2IJZihgb+ZVvlJbiE35dZON8PlWqEMhMJ+jY1IuCGS\nM/lNXtlqz1Lgbiigzdy6r6mNcfYivt/DjdEDi/V87dfyFYfntVES39I9NdVqqURs\nPTpsqoxL+h9yD3fq026tMqKFg4Tz2Eiibv8dSKkCgYEAtEW6mxQumLN7G2ybgP/+\nax1Q6+3oD2DCxdfN15AjPiheqFslTaH0GzW4GAO79070n8tlQlDNj6m/DpBCmJzp\nagcwQyoFYnNIu7NCcSLB2KgwTQZEOuhdjlqWt4dqfWeYVs/o+wr9tE28f+aH5+yE\ngDOQV82Hll/wqFXinKhZk2I=\n-----END PRIVATE KEY-----\n"
const FIREBASE_PRIVATE_KEY_ID="33075f583165729d2c6e81af611cc20c5caee92d"
const FIREBASE_PROJECT_ID="garnett-230209"
const FIREBASE_STORAGE_BUCKET="garnett-230209.appspot.com"
const FIREBASE_TOKEN_URI="https://accounts.google.com/o/oauth2/token"
const FIREBASE_TYPE="service_account"
const NODE_PATH="src/"
const PLEDGE_AUTHORIZATION_CODE="phipledge!"



admin.initializeApp({
  credential: admin.credential.cert({
    type: FIREBASE_TYPE,
    project_id: FIREBASE_PROJECT_ID,
    private_key_id: FIREBASE_PRIVATE_KEY_ID,
    private_key: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: FIREBASE_CLIENT_EMAIL,
    client_id: FIREBASE_CLIENT_ID,
    auth_uri: FIREBASE_AUTH_URI,
    token_uri: FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: FIREBASE_CLIENT_X509_CERT_URL
  }),
  databaseURL: FIREBASE_DATABASE_URL
})

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

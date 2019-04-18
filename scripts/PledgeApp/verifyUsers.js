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

function verifyAllUsers(nextPageToken) {
  // List batch of users, 1000 at a time.
  admin.auth().listUsers(1000, nextPageToken)
    .then(function(listUsersResult) {
      listUsersResult.users.forEach(function(userRecord) {
        let user = userRecord.toJSON();
        if (!user.emailVerified) {
          admin.auth().updateUser(user.uid, {
            emailVerified: true
          })
          .then(function(updatedUserRecord) {
            // See the UserRecord reference doc for the contents of userRecord.
            let updatedUser = updatedUserRecord.toJSON();
            console.log("Successfully updated ", updatedUser.displayName, ' to ', updatedUser.emailVerified);
          })
          .catch(function(error) {
            console.log("Error updating user:", error);
          });
        }
        else {
          console.log('Everyone has been updated already.');
        }
      });
      if (listUsersResult.pageToken) {
        // List next batch of users.
        verifyAllUsers(listUsersResult.pageToken)
      }
    })
    .catch(function(error) {
      console.log("Error listing users:", error);
    });
}
// Start listing users from the beginning, 1000 at a time.
verifyAllUsers();

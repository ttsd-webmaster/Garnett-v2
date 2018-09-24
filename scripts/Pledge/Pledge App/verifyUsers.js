const admin = require("firebase-admin");
var serviceAccount = require("../../../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://garnett-42475.firebaseio.com"
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

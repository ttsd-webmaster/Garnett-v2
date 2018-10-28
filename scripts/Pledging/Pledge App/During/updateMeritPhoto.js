const admin = require("firebase-admin");
var serviceAccount = require("../../../../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://garnett-42475.firebaseio.com"
})

let usersRef = admin.database().ref('/users/');

usersRef.once('value', (snapshot) => {
  snapshot.forEach((user) => {
    if (user.val().status === 'pledge') {
      snapshot.forEach((pledge) => {
        pledge.ref.child('Merits').once('value', (merits) => {
          merits.forEach((merit) => {
            snapshot.forEach((active) => {
              const activeName = `${active.val().firstName} ${active.val().lastName}`;
              
              console.log(activeName, merit.val().name)

              if (activeName === merit.val().name) {
                merit.ref.update({
                  photoURL: active.val().photoURL
                })
              }
            })
          });
        })
      })
    }
  })
})

const admin = require("firebase-admin");
var serviceAccount = require("../../../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://garnett-42475.firebaseio.com"
})

let rusheesRef = admin.database().ref('/rushees');

rusheesRef.once('value', (snapshot) => {
  snapshot.forEach((rushee) => {
    let otherReasons;
    let rusheeActiveRef = rushee.ref.child('Actives');
    let interviewResponsesRef = rushee.ref.child('interviewResponses');
    console.log(rushee.key)

    if (rushee.val().otherReasons === '') {
      otherReasons = 'N/A';
    }
    else {
      otherReasons = rushee.val().otherReasons;
    }

    rusheeActiveRef.once('value', (snapshot) => {
      let totalInteractions = 0;

      snapshot.forEach((active => {
        if (active.val().interacted) {
          totalInteractions++;
        }
      }));

      interviewResponsesRef.once('value', (snapshot) => {
        snapshot.forEach((response) => {
          let answer;

          if (response.val() === '') {
            answer = 'N/A';
          }
          else {
            answer = response.val();
          }

          rushee.ref.update({
            totalInteractions: totalInteractions,
            otherReasons: otherReasons
          });

          interviewResponsesRef.update({
            [response.key]: answer
          });
        });
      });
    });
  });
});

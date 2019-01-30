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

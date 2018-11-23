const admin = require("firebase-admin");
const equal = require('deep-equal');
var serviceAccount = require("../../../../serviceAccountKey.json");
require('dotenv').config({ path: `${process.env.HOME}/Projects/React/Garnett/.env` });

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
})

const meritsRef = admin.database().ref('/merits');

meritsRef.once('value', (merits) => {
  let updatedMerits = Object.keys(merits.val()).map(function(key) {
    return merits.val()[key];
  });
  updatedMerits = updatedMerits.filter((merit, index, self) =>
    index === self.findIndex((m) => (
      m.description === merit.description &&
      m.activeName === merit.activeName &&
      m.pledgeName === merit.pledgeName &&
      m.amount === merit.amount
    ))
  )

  meritsRef.set(updatedMerits);
})

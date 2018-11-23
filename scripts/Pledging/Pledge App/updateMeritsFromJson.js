const data = require('./garnett-data.json');
const admin = require("firebase-admin");
var serviceAccount = require("../../../serviceAccountKey.json");
require('dotenv').config({ path: `${process.env.HOME}/Projects/React/Garnett/.env` });

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
})

const meritsRef = admin.database().ref('/merits');

const users = Object.keys(data.users).map(function(key) {
  return data.users[key];
})

users.forEach((user) => {
  if (user.status === 'pledge' && user.Merits) {
    const merits = Object.keys(user.Merits).map(function(key) {
      return user.Merits[key];
    })

    merits.forEach((merit) => {
      const updatedMerit = {
        pledgeName: `${user.firstName} ${user.lastName}`,
        pledgePhoto: user.photoURL,
        activeName: merit.name,
        activePhoto: merit.photoURL,
        amount: merit.amount,
        description: merit.description,
        date: merit.date
      };
      meritsRef.push(updatedMerit);
    })
  } else if (user.Merits) {
    const merits = Object.keys(user.Merits).map(function(key) {
      return user.Merits[key];
    })

    merits.forEach((merit) => {
      const updatedMerit = {
        pledgeName: merit.name,
        pledgePhoto: merit.photoURL,
        activeName: `${user.firstName} ${user.lastName}`,
        activePhoto: user.photoURL,
        amount: merit.amount,
        description: merit.description,
        date: merit.date
      };
      meritsRef.push(updatedMerit);
    })
  }
})

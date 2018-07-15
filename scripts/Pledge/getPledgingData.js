const admin = require("firebase-admin");
var serviceAccount = require("../../serviceAccountKey.json");
var fs = require('fs');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://garnett-42475.firebaseio.com"
})

let usersRef = admin.database().ref('/users/');
let chalkboardsRef = admin.database().ref('/chalkboards');
let complaintsRef = admin.database().ref('/approvedComplaints');

usersRef.once('value', (snapshot) => {
  // User map to check status for chalkboard attendees
  let users = new Map();
  let totalMerits = new Map();
  let mostMeritInstances = new Map();
  let mostDemeritInstances = new Map();
  let mostMeritAmount = new Map();
  let mostDemeritAmount = new Map();
  let mostOverallMeritAmount = new Map();

  snapshot.forEach((user) => {
    users.set(user.key, user.val().status);

    if (user.val().status === 'pledge') {
      let merits = Object.keys(user.val().Merits).map(function(key) {
        return user.val().Merits[key];
      });

      merits.forEach((merit) => {
        let totalCounter = totalMerits.get(merit.name) || 0;
        let meritInstanceCounter = mostMeritInstances.get(merit.name) || 0;
        let demeritInstanceCounter = mostDemeritInstances.get(merit.name) || 0;
        let meritAmountCounter = mostMeritAmount.get(merit.name) || 0;
        let demeritAmountCounter = mostDemeritAmount.get(merit.name) || 0;
        let overallMeritAmountCounter = mostOverallMeritAmount.get(merit.name) || 0;

        if (merit.amount > 0) {
          mostMeritInstances.set(merit.name, meritInstanceCounter += 1);
          mostMeritAmount.set(merit.name, meritAmountCounter += merit.amount);
        }
        else {
          mostDemeritInstances.set(merit.name, demeritInstanceCounter += 1);
          mostDemeritAmount.set(merit.name, demeritAmountCounter += merit.amount);
        }

        totalMerits.set(merit.name, totalCounter += 1);
        mostOverallMeritAmount.set(merit.name, overallMeritAmountCounter += merit.amount);
      });
    }
  });

  totalMerits = new Map([...totalMerits.entries()].sort((a,b) => b[1] - a[1]).slice(2, 12));
  mostMeritInstances = new Map([...mostMeritInstances.entries()].sort((a,b) => b[1] - a[1]).slice(1, 11));
  mostDemeritInstances = new Map([...mostDemeritInstances.entries()].sort((a,b) => b[1] - a[1]).slice(1, 11));
  mostMeritAmount = new Map([...mostMeritAmount.entries()].sort((a,b) => b[1] - a[1]).slice(2, 11));
  mostDemeritAmount = new Map([...mostDemeritAmount.entries()].sort((a,b) => a[1] - b[1]).slice(1, 11));
  mostOverallMeritAmount = new Map([...mostOverallMeritAmount.entries()].sort((a,b) => b[1] - a[1]).slice(1, 11));

  console.log('Most Instances: ', totalMerits);
  console.log('Most Merit Instances: ', mostMeritInstances);
  console.log('Most Demerit Instances: ', mostDemeritInstances);
  console.log('Most Merit Amount: ', mostMeritAmount);
  console.log('Most Demerit Amount: ', mostDemeritAmount);
  console.log('Most Overall Amount: ', mostOverallMeritAmount);

  chalkboardsRef.once('value', (snapshot) => {
    let mostChalkboardsCreated = new Map();
    let mostChalkboardsAttendedOverall = new Map();
    let mostChalkboardsAttendedActive = new Map();
    let mostChalkboardsAttendedPledge = new Map();

    snapshot.forEach((chalkboard) => {
      let mostCreatedCounter = mostChalkboardsCreated.get(chalkboard.val().activeName) || 0;
      let attendees = Object.keys(chalkboard.val().attendees).map(function(key) {
        return chalkboard.val().attendees[key];
      });

      mostChalkboardsCreated.set(chalkboard.val().activeName, mostCreatedCounter += 1);

      attendees.forEach((attendee) => {
        let overallCounter = mostChalkboardsAttendedOverall.get(attendee.name) || 0;
        let activeCounter = mostChalkboardsAttendedActive.get(attendee.name) || 0;
        let pledgeCounter = mostChalkboardsAttendedPledge.get(attendee.name) || 0;
      
        mostChalkboardsAttendedOverall.set(attendee.name, overallCounter += 1);

        if (users.get(attendee.name.replace(/ /g,'')) === 'pledge') {
          mostChalkboardsAttendedPledge.set(attendee.name, pledgeCounter += 1);
        }
        else {
          mostChalkboardsAttendedActive.set(attendee.name, activeCounter += 1);
        }
      });
    });

    mostChalkboardsCreated = new Map([...mostChalkboardsCreated.entries()].sort((a,b) => b[1] - a[1]).slice(0, 10));
    mostChalkboardsAttendedOverall = new Map([...mostChalkboardsAttendedOverall.entries()].sort((a,b) => b[1] - a[1]).slice(0, 20));
    mostChalkboardsAttendedActive = new Map([...mostChalkboardsAttendedActive.entries()].sort((a,b) => b[1] - a[1]).slice(0, 10));
    mostChalkboardsAttendedPledge = new Map([...mostChalkboardsAttendedPledge.entries()].sort((a,b) => b[1] - a[1]).slice(0, 5));

    console.log('Most Chalkboards Created: ', mostChalkboardsCreated);
    console.log('Most Chalkboards Attended (Actives + Pledges): ', mostChalkboardsAttendedOverall);
    console.log('Most Chalkboards Attended (Actives): ', mostChalkboardsAttendedActive);
    console.log('Most Chalkboards Attended (Pledges): ', mostChalkboardsAttendedPledge);
    
    let jsonData = {totalMerits: JSON.stringify([...totalMerits]),
                    mostMeritInstances: JSON.stringify([...mostMeritInstances]),
                    mostDemeritInstances: JSON.stringify([...mostDemeritInstances]),
                    mostMeritAmount: JSON.stringify([...mostMeritAmount]),
                    mostDemeritAmount: JSON.stringify([...mostDemeritAmount]),
                    mostOverallMeritAmount: JSON.stringify([...mostOverallMeritAmount]),
                    mostChalkboardsCreated: JSON.stringify([...mostChalkboardsCreated]),
                    mostChalkboardsAttendedOverall: JSON.stringify([...mostChalkboardsAttendedOverall]),
                    mostChalkboardsAttendedActive: JSON.stringify([...mostChalkboardsAttendedActive]),
                    mostChalkboardsAttendedPledge: JSON.stringify([...mostChalkboardsAttendedPledge])};

    fs.writeFile("pledgeData.json", JSON.stringify(jsonData), function(err) {
      if (err) {
        console.log(err);
      }
    });
  });
});

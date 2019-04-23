const admin = require('firebase-admin');

exports.get_pledging_data = function(req, res) {
  const meritsRef = admin.database().ref('/merits');
  // Map to map user photo
  const photoMap = new Map();
  // Maps to map user to value
  let activeMostMeritsCreated = new Map();
  let activeMostOverallMeritsGiven = new Map();
  let activeMostMeritsGiven = new Map();
  let activeMostDemeritsGiven = new Map();
  let pledgeMostOverallMeritsGiven = new Map();
  let pledgeMostMeritsGiven = new Map();
  let pledgeMostDemeritsGiven = new Map();
  // Counter to keep track of all the amounts
  let activeMostMeritsCreatedCounter;
  let activeMostOverallMeritsGivenCounter;
  let activeMostMeritsGivenCounter;
  let activeMostDemeritsGivenCounter;
  let pledgeMostOverallMeritsGivenCounter;
  let pledgeMostMeritsGivenCounter;
  let pledgeMostDemeritsGivenCounter;

  meritsRef.once('value', (merits) => {
    merits.forEach((merit) => {
      if (merit.val()) {
        const {
          amount,
          createdBy,
          activeName,
          pledgeName,
          activePhoto,
          pledgePhoto
        } = merit.val();
        const isPIPM = (
          activeName === 'Rachael Wong' ||
          activeName === 'Rishi Dhanaraj'
        );

        if (!photoMap.get(activeName)) {
          photoMap.set(activeName, activePhoto)
        }

        if (!photoMap.get(pledgeName)) {
          photoMap.set(pledgeName, pledgePhoto)
        }

        if (!isPIPM) {
          activeMostOverallMeritsGivenCounter = activeMostOverallMeritsGiven.get(activeName) || { instances: 0, amount: 0 };
          activeMostMeritsGivenCounter = activeMostMeritsGiven.get(activeName) || { instances: 0, amount: 0 };
          activeMostDemeritsGivenCounter = activeMostDemeritsGiven.get(activeName) || { instances: 0, amount: 0 };
          activeMostMeritsCreatedCounter = activeMostMeritsCreated.get(activeName) || { instances: 0, amount: 0 };
          pledgeMostOverallMeritsGivenCounter = pledgeMostOverallMeritsGiven.get(pledgeName) || { instances: 0, amount: 0 };
          pledgeMostMeritsGivenCounter = pledgeMostMeritsGiven.get(pledgeName) || { instances: 0, amount: 0 };
          pledgeMostDemeritsGivenCounter = pledgeMostDemeritsGiven.get(pledgeName) || { instances: 0, amount: 0 };

          if (createdBy === activeName.replace(/ /g, '')) {
            const updatedActiveMeritCreated = {
              instances: activeMostMeritsCreatedCounter.instances + 1,
              amount: activeMostMeritsCreatedCounter.amount + amount
            };
            activeMostMeritsCreated.set(activeName, updatedActiveMeritCreated);
          }

          if (amount > 0) {
            const updatedActiveMeritsGiven = {
              instances: activeMostMeritsGivenCounter.instances + 1,
              amount: activeMostMeritsGivenCounter.amount + amount
            };
            const updatedPledgeMeritsGiven = {
              instances: pledgeMostMeritsGivenCounter.instances + 1,
              amount: pledgeMostMeritsGivenCounter.amount + amount
            };
            activeMostMeritsGiven.set(activeName, updatedActiveMeritsGiven);
            pledgeMostMeritsGiven.set(pledgeName, updatedPledgeMeritsGiven);
          } else {
            const updatedActiveDemeritsGiven = {
              instances: activeMostDemeritsGivenCounter.instances + 1,
              amount: activeMostDemeritsGivenCounter.amount + amount
            };
            const updatedPledgeDemeritsGiven = {
              instances: pledgeMostDemeritsGivenCounter.instances + 1,
              amount: pledgeMostDemeritsGivenCounter.amount + amount
            };
            activeMostDemeritsGiven.set(activeName, updatedActiveDemeritsGiven);
            pledgeMostDemeritsGiven.set(pledgeName, updatedPledgeDemeritsGiven);
          }

          const updatedActiveOverallMeritsGiven = {
            instances: activeMostOverallMeritsGivenCounter.instances + 1,
            amount: activeMostOverallMeritsGivenCounter.amount + amount
          };
          const updatedPledgeOverallMeritsGiven = {
            instances: pledgeMostOverallMeritsGivenCounter.instances + 1,
            amount: pledgeMostOverallMeritsGivenCounter.amount + amount
          };
          activeMostOverallMeritsGiven.set(activeName, updatedActiveOverallMeritsGiven);
          pledgeMostOverallMeritsGiven.set(pledgeName, updatedPledgeOverallMeritsGiven);
        }
      }
    });

    activeMostMeritsCreated = [...activeMostMeritsCreated.entries()].sort((a,b) => b[1].instances - a[1].instances).slice(0, 10);
    activeMostOverallMeritsGiven = [...activeMostOverallMeritsGiven.entries()].sort((a,b) => b[1].amount - a[1].amount).slice(0, 10);
    activeMostMeritsGiven = [...activeMostMeritsGiven.entries()].sort((a,b) => b[1].amount - a[1].amount).slice(0, 10);
    activeMostDemeritsGiven = [...activeMostDemeritsGiven.entries()].sort((a,b) => a[1].amount - b[1].amount).slice(0, 10);
    pledgeMostOverallMeritsGiven = [...pledgeMostOverallMeritsGiven.entries()].sort((a,b) => b[1].amount - a[1].amount).slice(0, 10);
    pledgeMostMeritsGiven = [...pledgeMostMeritsGiven.entries()].sort((a,b) => b[1].amount - a[1].amount).slice(0, 10);
    pledgeMostDemeritsGiven = [...pledgeMostDemeritsGiven.entries()].sort((a,b) => a[1].amount - b[1].amount).slice(0, 10);

    const activeData = [
      ['Most Merits and Demerits Given', activeMostOverallMeritsGiven],
      ['Most Merits Given', activeMostMeritsGiven],
      ['Most Demerits Given', activeMostDemeritsGiven],
      ['Most Merit Instances Created on Garnett', activeMostMeritsCreated]
    ];

    const pledgeData = [
      ['Most Merits and Demerits Received', pledgeMostOverallMeritsGiven],
      ['Most Merits Received', pledgeMostMeritsGiven],
      ['Most Demerits Received', pledgeMostDemeritsGiven]
    ];

    res.json({ activeData, pledgeData, photoMap: [...photoMap] });
  });
}

// Get my data for data app
exports.get_my_data = function(req, res) {
  const { fullName } = req.query;
  const usersRef = admin.database().ref('/users');
  const meritsRef = admin.database().ref('/merits');
  const chalkboardsRef = admin.database().ref('/chalkboards');
  let overallMeritInstances = 0;
  let meritInstances = 0;
  let demeritInstances = 0;
  let meritsCreatedInstances = 0;
  let meritsCreatedAmount = 0;
  let overallMeritAmount = 0;
  let meritAmount = 0;
  let demeritAmount = 0;

  meritsRef.orderByChild('activeName').equalTo(fullName).once('value', (merits) => {
    merits.forEach((merit) => {
      const { amount, createdBy } = merit.val();

      if (createdBy === fullName.replace(/ /g, '')) {
        meritsCreatedInstances++;
        meritsCreatedAmount += amount;
      }
      if (amount > 0) {
        meritInstances += 1;
        meritAmount += amount;
      }
      else {
        demeritInstances += 1;
        demeritAmount += amount;
      }

      overallMeritInstances++;
      overallMeritAmount += amount;
    });

    // chalkboardsRef.once('value', (chalkboards) => {
    //   let chalkboardsCreated = 0;
    //   let chalkboardsAttended = 0;

    //   if (chalkboards.val()) {
    //     chalkboards.forEach((chalkboard) => {
    //       if (chalkboard.val().activeName === fullName) {
    //         chalkboardsCreated += 1;
    //       }
    //       else {
    //         let attendees = Object.keys(chalkboard.val().attendees).map(function(key) {
    //           return chalkboard.val().attendees[key];
    //         });

    //         attendees.forEach((attendee) => {
    //           if (attendee.name === fullName) {
    //             chalkboardsAttended += 1;
    //           }
    //         });
    //       }
    //     });
    //   }

      res.json([
        ['Merits and Demerits Given', [overallMeritInstances, overallMeritAmount]],
        ['Merits Given', [meritInstances, meritAmount]],
        ['Demerits Given', [demeritInstances, demeritAmount]],
        ['Merits created on Garnett', [meritsCreatedInstances, meritsCreatedAmount]],
        // ['Chalkboards Created', chalkboardsCreated],
        // ['Chalkboards Attended', chalkboardsAttended]
      ]);
    // });
  });
};

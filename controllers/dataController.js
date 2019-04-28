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
            activeMostMeritsGiven.set(activeName, updatedActiveMeritsGiven);
          } else {
            const updatedActiveDemeritsGiven = {
              instances: activeMostDemeritsGivenCounter.instances + 1,
              amount: activeMostDemeritsGivenCounter.amount + amount
            };
            activeMostDemeritsGiven.set(activeName, updatedActiveDemeritsGiven);
          }

          const updatedActiveOverallMeritsGiven = {
            instances: activeMostOverallMeritsGivenCounter.instances + 1,
            amount: activeMostOverallMeritsGivenCounter.amount + amount
          };
          activeMostOverallMeritsGiven.set(activeName, updatedActiveOverallMeritsGiven);
        }

        pledgeMostOverallMeritsGivenCounter = pledgeMostOverallMeritsGiven.get(pledgeName) || { instances: 0, amount: 0 };
        pledgeMostMeritsGivenCounter = pledgeMostMeritsGiven.get(pledgeName) || { instances: 0, amount: 0 };
        pledgeMostDemeritsGivenCounter = pledgeMostDemeritsGiven.get(pledgeName) || { instances: 0, amount: 0 };

        if (amount > 0) {
          const updatedPledgeMeritsGiven = {
            instances: pledgeMostMeritsGivenCounter.instances + 1,
            amount: pledgeMostMeritsGivenCounter.amount + amount
          };
          pledgeMostMeritsGiven.set(pledgeName, updatedPledgeMeritsGiven);
        } else {
          const updatedPledgeDemeritsGiven = {
            instances: pledgeMostDemeritsGivenCounter.instances + 1,
            amount: pledgeMostDemeritsGivenCounter.amount + amount
          };
          pledgeMostDemeritsGiven.set(pledgeName, updatedPledgeDemeritsGiven);
        }

        const updatedPledgeOverallMeritsGiven = {
          instances: pledgeMostOverallMeritsGivenCounter.instances + 1,
          amount: pledgeMostOverallMeritsGivenCounter.amount + amount
        };
        pledgeMostOverallMeritsGiven.set(pledgeName, updatedPledgeOverallMeritsGiven);
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
  const overallMeritGiven = { instances: 0, amount: 0 };
  const meritsGiven = { instances: 0, amount: 0 };
  const demeritsGiven = { instances: 0, amount: 0 };
  const meritsCreated = { instances: 0, amount: 0 };

  meritsRef.orderByChild('activeName').equalTo(fullName).once('value', (merits) => {
    merits.forEach((merit) => {
      const { amount, createdBy } = merit.val();

      if (createdBy === fullName.replace(/ /g, '')) {
        meritsCreated.instances++;
        meritsCreated.amount += amount;
      }
      if (amount > 0) {
        meritsGiven.instances += 1;
        meritsGiven.amount += amount;
      }
      else {
        demeritsGiven.instances += 1;
        demeritsGiven.amount += amount;
      }

      overallMeritGiven.instances++;
      overallMeritGiven.amount += amount;
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
        ['Merits and Demerits Given', overallMeritGiven],
        ['Merits Given', meritsGiven],
        ['Demerits Given', demeritsGiven],
        ['Merits created on Garnett', meritsCreated],
        // ['Chalkboards Created', chalkboardsCreated],
        // ['Chalkboards Attended', chalkboardsAttended]
      ]);
    // });
  });
};

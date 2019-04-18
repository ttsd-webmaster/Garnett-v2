const admin = require('firebase-admin');

exports.get_pledging_data = function(req, res) {
  const meritsRef = admin.database().ref('/merits');
  // Map to map user photo
  const photoMap = new Map();
  // Maps to map user to value
  let activeMostOverallMeritsGiven = new Map();
  let activeMostMeritsGiven = new Map();
  let activeMostDemeritsGiven = new Map();
  let pledgeMostOverallMeritsGiven = new Map();
  let pledgeMostMeritsGiven = new Map();
  let pledgeMostDemeritsGiven = new Map();
  // Counter to keep track of all the amounts
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
          activeMostOverallMeritsGivenCounter = activeMostOverallMeritsGiven.get(activeName) || [0, 0];
          activeMostMeritsGivenCounter = activeMostMeritsGiven.get(activeName) || [0, 0];
          activeMostDemeritsGivenCounter = activeMostDemeritsGiven.get(activeName) || [0, 0];
          pledgeMostOverallMeritsGivenCounter = pledgeMostOverallMeritsGiven.get(pledgeName) || [0, 0];
          pledgeMostMeritsGivenCounter = pledgeMostMeritsGiven.get(pledgeName) || [0, 0];
          pledgeMostDemeritsGivenCounter = pledgeMostDemeritsGiven.get(pledgeName) || [0, 0];

          console.log(activeMostMeritsGivenCounter);

          if (amount > 0) {
            const updatedActiveMeritInstances = activeMostMeritsGivenCounter[0] + 1;
            const updatedActiveMeritAmounts = activeMostMeritsGivenCounter[1] + amount;
            const updatedPledgeMeritInstances = pledgeMostMeritsGivenCounter[0] + 1;
            const updatedPledgeMeritAmounts = pledgeMostMeritsGivenCounter[1] + amount;
            activeMostMeritsGiven.set(activeName, [updatedActiveMeritInstances, updatedActiveMeritAmounts]);
            pledgeMostMeritsGiven.set(pledgeName, [updatedPledgeMeritInstances, updatedPledgeMeritAmounts]);
          } else {
            const updatedActiveDemeritInstances = activeMostDemeritsGivenCounter[0] + 1;
            const updatedActiveDemeritAmounts = activeMostDemeritsGivenCounter[1] + amount;
            const updatedPledgeDemeritInstances = pledgeMostDemeritsGivenCounter[0] + 1;
            const updatedPledgeDemeritAmounts = pledgeMostDemeritsGivenCounter[1] + amount;
            activeMostDemeritsGiven.set(activeName, [updatedActiveDemeritInstances, updatedActiveDemeritAmounts]);
            pledgeMostDemeritsGiven.set(pledgeName, [updatedPledgeDemeritInstances, updatedPledgeDemeritAmounts]);
          }

          const updatedActiveOverallMeritInstances = activeMostOverallMeritsGivenCounter[0] + 1;
          const updatedActiveOverallMeritAmounts = activeMostOverallMeritsGivenCounter[1] + amount;
          const updatedPledgeOverallMeritInstances = pledgeMostOverallMeritsGivenCounter[0] + 1;
          const updatedPledgeOverallMeritAmounts = pledgeMostOverallMeritsGivenCounter[1] + amount;
          activeMostOverallMeritsGiven.set(activeName, [updatedActiveOverallMeritInstances, updatedActiveOverallMeritAmounts]);
          pledgeMostOverallMeritsGiven.set(pledgeName, [updatedPledgeOverallMeritInstances, updatedPledgeOverallMeritAmounts]);
        }
      }
    });

    activeMostOverallMeritsGiven = [...activeMostOverallMeritsGiven.entries()].sort((a,b) => b[1][1] - a[1][1]).slice(0, 10);
    activeMostMeritsGiven = [...activeMostMeritsGiven.entries()].sort((a,b) => b[1][1] - a[1][1]).slice(0, 10);
    activeMostDemeritsGiven = [...activeMostDemeritsGiven.entries()].sort((a,b) => a[1][1] - b[1][1]).slice(0, 10);
    pledgeMostOverallMeritsGiven = [...pledgeMostOverallMeritsGiven.entries()].sort((a,b) => b[1][1] - a[1][1]).slice(0, 10);
    pledgeMostMeritsGiven = [...pledgeMostMeritsGiven.entries()].sort((a,b) => b[1][1] - a[1][1]).slice(0, 10);
    pledgeMostDemeritsGiven = [...pledgeMostDemeritsGiven.entries()].sort((a,b) => a[1][1] - b[1][1]).slice(0, 10);

    const activeData = [
      ['Most Merits and Demerits Given', activeMostOverallMeritsGiven],
      ['Most Merits Given', activeMostMeritsGiven],
      ['Most Demerits Given', activeMostDemeritsGiven]
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

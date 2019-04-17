const admin = require('firebase-admin');

exports.get_pledging_data = function(req, res) {
  const meritsRef = admin.database().ref('/merits');
  // Map to map user photo
  const photoMap = new Map();
  // Maps to map user to value
  let totalActiveMeritInstances = new Map();
  let mostActiveMeritInstances = new Map();
  let mostActiveDemeritInstances = new Map();
  let totalPledgeMeritInstances = new Map();
  let mostPledgeMeritInstances = new Map();
  let mostPledgeDemeritInstances = new Map();
  let totalActiveMeritAmount = new Map();
  let mostActiveMeritAmount = new Map();
  let mostActiveDemeritAmount = new Map();
  let totalPledgeMeritAmount = new Map();
  let mostPledgeMeritAmount = new Map();
  let mostPledgeDemeritAmount = new Map();
  // Counter to keep track of all the amounts
  let totalActiveInstanceCounter;
  let meritActiveInstanceCounter;
  let demeritActiveInstanceCounter;
  let totalPledgeInstanceCounter;
  let meritPledgeInstanceCounter;
  let demeritPledgeInstanceCounter;
  let totalActiveMeritAmountCounter;
  let meritActiveAmountCounter;
  let demeritActiveAmountCounter;
  let totalPledgeMeritAmountCounter;
  let meritPledgeAmountCounter;
  let demeritPledgeAmountCounter;

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
          totalActiveInstanceCounter = totalActiveMeritInstances.get(activeName) || 0;
          meritActiveInstanceCounter = mostActiveMeritInstances.get(activeName) || 0;
          demeritActiveInstanceCounter = mostActiveDemeritInstances.get(activeName) || 0;
          totalActiveMeritAmountCounter = totalActiveMeritAmount.get(activeName) || 0;
          meritActiveAmountCounter = mostActiveMeritAmount.get(activeName) || 0;
          demeritActiveAmountCounter = mostActiveDemeritAmount.get(activeName) || 0;
          totalPledgeInstanceCounter = totalPledgeMeritInstances.get(pledgeName) || 0;
          meritPledgeInstanceCounter = mostPledgeMeritInstances.get(pledgeName) || 0;
          demeritPledgeInstanceCounter = mostPledgeDemeritInstances.get(pledgeName) || 0;

          if (amount > 0) {
            mostActiveMeritInstances.set(activeName, meritActiveInstanceCounter += 1);
            mostPledgeMeritInstances.set(pledgeName, meritPledgeInstanceCounter += 1);
            mostActiveMeritAmount.set(activeName, meritActiveAmountCounter += amount);
            mostPledgeMeritAmount.set(pledgeName, meritPledgeAmountCounter += amount);
          } else {
            mostActiveDemeritInstances.set(activeName, demeritActiveInstanceCounter += 1);
            mostPledgeDemeritInstances.set(pledgeName, demeritPledgeInstanceCounter += 1);
            mostActiveDemeritAmount.set(activeName, demeritActiveAmountCounter += amount);
            mostPledgeDemeritAmount.set(pledgeName, demeritPledgeAmountCounter += amount);
          }

          totalActiveMeritInstances.set(activeName, totalActiveInstanceCounter += 1);
          totalPledgeMeritInstances.set(pledgeName, totalPledgeInstanceCounter += 1);
          totalActiveMeritAmount.set(activeName, totalActiveMeritAmountCounter += amount);
          totalPledgeMeritAmount.set(pledgeName, totalPledgeMeritAmountCounter += amount);
        }
      }
    });

    totalActiveMeritInstances = [...totalActiveMeritInstances.entries()].sort((a,b) => b[1] - a[1]).slice(0, 10);
    mostActiveMeritInstances = [...mostActiveMeritInstances.entries()].sort((a,b) => b[1] - a[1]).slice(0, 10);
    mostActiveDemeritInstances = [...mostActiveDemeritInstances.entries()].sort((a,b) => b[1] - a[1]).slice(0, 10);
    totalPledgeMeritInstances = [...totalPledgeMeritInstances.entries()].sort((a,b) => b[1] - a[1]).slice(0, 10);
    mostPledgeMeritInstances = [...mostPledgeMeritInstances.entries()].sort((a,b) => b[1] - a[1]).slice(0, 10);
    mostPledgeDemeritInstances = [...mostPledgeDemeritInstances.entries()].sort((a,b) => b[1] - a[1]).slice(0, 10);
    totalActiveMeritAmount = [...totalActiveMeritAmount.entries()].sort((a,b) => b[1] - a[1]).slice(0, 10);
    mostActiveMeritAmount = [...mostActiveMeritAmount.entries()].sort((a,b) => b[1] - a[1]).slice(0, 10);
    mostActiveDemeritAmount = [...mostActiveDemeritAmount.entries()].sort((a,b) => a[1] - b[1]).slice(0, 10);
    totalPledgeMeritAmount = [...totalPledgeMeritAmount.entries()].sort((a,b) => b[1] - a[1]).slice(0, 10);
    mostPledgeMeritAmount = [...mostPledgeMeritAmount.entries()].sort((a,b) => b[1] - a[1]).slice(0, 10);
    mostPledgeDemeritAmount = [...mostPledgeDemeritAmount.entries()].sort((a,b) => a[1] - b[1]).slice(0, 10);

    const activeData = [
      ['Total Merit Instances', totalActiveMeritInstances],
      ['Most Merit Instances', mostActiveMeritInstances],
      ['Most Demerit Instances', mostActiveDemeritInstances],
      ['Total Merit Amount', totalActiveMeritAmount],
      ['Most Merit Amount', mostActiveMeritAmount],
      ['Most Demerit Amount', mostActiveDemeritAmount]
    ];

    const pledgeData = [
      ['Total Merit Instances', totalPledgeMeritInstances],
      ['Most Merit Instances', mostPledgeMeritInstances],
      ['Most Demerit Instances', mostPledgeDemeritInstances],
      ['Total Merit Amount', totalPledgeMeritAmount],
      ['Most Merit Amount', mostPledgeMeritAmount],
      ['Most Demerit Amount', mostPledgeDemeritAmount]
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
  let totalMeritInstances = 0;
  let meritInstances = 0;
  let demeritInstances = 0;
  let meritsCreated = 0;
  let totalMeritAmount = 0;
  let meritAmount = 0;
  let demeritAmount = 0;

  meritsRef.orderByChild('activeName').equalTo(fullName).once('value', (merits) => {
    merits.forEach((merit) => {
      if (merit.val().createdBy === fullName.replace(/ /g, '')) {
        meritsCreated++;
      }
      if (merit.val().amount > 0) {
        meritInstances += 1;
        meritAmount += merit.val().amount;
      }
      else {
        demeritInstances += 1;
        demeritAmount += merit.val().amount;
      }

      totalMeritInstances++;
      totalMeritAmount += merit.val().amount;
    });

    chalkboardsRef.once('value', (chalkboards) => {
      let chalkboardsCreated = 0;
      let chalkboardsAttended = 0;

      if (chalkboards.val()) {
        chalkboards.forEach((chalkboard) => {
          if (chalkboard.val().activeName === fullName) {
            chalkboardsCreated += 1;
          }
          else {
            let attendees = Object.keys(chalkboard.val().attendees).map(function(key) {
              return chalkboard.val().attendees[key];
            });

            attendees.forEach((attendee) => {
              if (attendee.name === fullName) {
                chalkboardsAttended += 1;
              }
            });
          }
        });
      }

      res.json([
        ['Total Merit Instances', totalMeritInstances],
        ['Merit Instances', meritInstances],
        ['Demerit Instances', demeritInstances],
        ['Merits created on Garnett', meritsCreated],
        ['Total Merit Amount', totalMeritAmount],
        ['Merit Amount', meritAmount],
        ['Demerit Amount', demeritAmount],
        ['Chalkboards Created', chalkboardsCreated],
        ['Chalkboards Attended', chalkboardsAttended],
      ]);
    });
  });
};

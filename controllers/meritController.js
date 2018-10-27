const admin = require("firebase-admin");
const equal = require('deep-equal');

// Get merits remaining for pledge
exports.get_merits_remaining = function(req, res) {
  const { displayName, pledgeName } = req.query;
  const pledgeRef = admin.database().ref('/users/' + displayName + '/Pledges/' + pledgeName);

  pledgeRef.once('value', (active) => {
    res.json(active.val().merits);
  });
};

// Gets all the pledges for meriting as active
exports.get_pledges_as_active = function(req, res) {
  const { displayName } = req.query;
  const pledgesRef = admin.database().ref('/users/' + displayName + '/Pledges');

  pledgesRef.once('value', (snapshot) => {
    let pledges = [];

    if (snapshot.val()) {
      pledges = Object.keys(snapshot.val()).map(function(key) {
        return {
          'value': key,
          'label': key.replace(/([a-z])([A-Z])/, '$1 $2'),
          'meritsRemaining': snapshot.val()[key].merits
        };
      });
    }

    res.json(pledges);
  });
};

// Gets all the actives for meriting as pledge
exports.get_actives_as_pledge = function(req, res) {
  const { displayName } = req.query;
  const usersRef = admin.database().ref('/users');

  usersRef.once('value', (snapshot) => {
    let actives = [];

    snapshot.forEach((active) => {
      if (active.val().status !== 'alumni' && active.val().status !== 'pledge') {
        actives.push({
          'value': active.key,
          'label': `${active.val().firstName} ${active.val().lastName}`,
          'meritsRemaining': active.val().Pledges[displayName].merits
        });
      }
    });

    res.json(actives);
  });
};

// Gets all the alumni for meriting as pledge
exports.get_alumni_as_pledge = function(req, res) {
  const { displayName } = req.query;
  const usersRef = admin.database().ref('/users');

  usersRef.once('value', (snapshot) => {
    let alumni = [];

    snapshot.forEach((alumnus) => {
      if (alumnus.val().status === 'alumni') {
        alumni.push({
          'value': alumnus.key,
          'label': `${alumnus.val().firstName} ${alumnus.val().lastName}`,
          'meritsRemaining': alumnus.val().Pledges[displayName].merits
        });
      }
    });

    res.json(alumni);
  });
};

// Gets all the chalkboards for merit
exports.get_chalkboards_merit = function(req, res) {
  const { fullName } = req.query;
  const chalkboardsRef = admin.database().ref('/chalkboards');

  chalkboardsRef.once('value', (snapshot) => {
    let myChalkboards = [];

    if (snapshot.val()) {
      const chalkboards = Object.keys(snapshot.val()).map(function(key) {
        return snapshot.val()[key];
      });

      chalkboards.forEach((chalkboard) => {
        if (chalkboard.activeName === fullName) {
          myChalkboards.push({
            title: chalkboard.title,
            amount: chalkboard.amount
          });
        }
        else {
          if (chalkboard.attendees) {
            const attendees = Object.keys(chalkboard.attendees).map(function(key) {
              return chalkboard.attendees[key];
            });

            attendees.forEach((attendee) => {
              if (attendee.name === fullName) {
                myChalkboards.push({
                  title: chalkboard.title,
                  amount: chalkboard.amount
                });
              }
            });
          }
        }
      });
    }

    res.json(myChalkboards);
  });
};

// Get Pbros data for pledges
exports.get_pbros_as_pledge = function(req, res) {
  let pbros = [];
  const { displayName } = req.query;
  const usersRef = admin.database().ref('/users');

  usersRef.once('value', (users) => {
    users.forEach((user) => {
      if (user.val().status === 'pledge' && user.key !== displayName) {
        pbros.push(user.val());
      }
    });

    res.json(pbros);
  });
};

// Put merit data as active
exports.merit_as_active = function(req, res) {
  let counter = 0;
  const {
    displayName,
    selectedPledges,
    isChalkboard,
    isPCGreet,
    status
  } = req.body;
  let { merit } = req.body;

  selectedPledges.forEach((child) => {
    const activeRef = admin.database().ref('/users/' + displayName);
    const activePledgeRef = activeRef.child('/Pledges/' + child.value);
    const pledgeRef = admin.database().ref('/users/' + child.value);

    activePledgeRef.once('value', (active) => {
      if (status !== 'pipm' && !isChalkboard && !isPCGreet) {
        const remainingMerits = active.val().merits - merit.amount;

        if (merit.amount > 0 && 
            remainingMerits < 0 && 
            !res.headersSent) {
          res.sendStatus(400).send(child.label);
        }
        else {
          activePledgeRef.update({
            merits: remainingMerits
          });
        }
      }

      pledgeRef.once('value', (pledge) => {
        counter++;

        pledgeRef.update({
          totalMerits: pledge.val().totalMerits + merit.amount
        });

        pledge.ref.child('Merits').push(merit);

        merit.photoURL = pledge.val().photoURL;
        activeRef.child('Merits').push(merit);

        if (!res.headersSent && counter === selectedPledges.length) {
          res.sendStatus(200);
        }
      });
    });
  })
};

// Put merit data as pledge
exports.merit_as_pledge = function(req, res) {
  let counter = 0;
  const {
    displayName,
    selectedActives,
    merit,
    isChalkboard,
    isPCGreet
  } = req.body;

  selectedActives.forEach((child) => {
    const activeRef = admin.database().ref('/users/' + child.value);
    const pledgeRef = admin.database().ref('/users/' + displayName);

    activeRef.once('value', (active) => {
      let meritInfo = {
        name: `${active.val().firstName} ${active.val().lastName}`,
        description: merit.description,
        amount: merit.amount,
        photoURL: active.val().photoURL,
        date: merit.date
      }

      if (active.val().status !== 'pipm' && !isChalkboard && !isPCGreet) {
        const remainingMerits = active.val().Pledges[displayName].merits - merit.amount;

        if (merit.amount > 0 && 
            remainingMerits < 0 && 
            !res.headersSent) {
          res.sendStatus(400).send(child.label);
        }
        else {
          const activePledgeRef = active.ref.child('/Pledges/' + displayName);

          activePledgeRef.update({
            merits: remainingMerits
          });
        }
      }

      pledgeRef.once('value', (pledge) => {
        counter++;

        pledge.ref.child('Merits').push(meritInfo);

        meritInfo.photoURL = pledge.val().photoURL;
        active.ref.child('Merits').push(meritInfo);

        if (!res.headersSent && counter === selectedActives.length) {
          pledgeRef.update({
            totalMerits: pledge.val().totalMerits + (merit.amount * selectedActives.length)
          });
          
          res.sendStatus(200);
        }
      });
    });
  });
};

// Deletes merit as pledge
exports.delete_merit_as_pledge = function(req, res) {
  const pledgeName = req.body.displayName;
  const activeName = req.body.merit.name.replace(/ /g,'');
  const pledgeRef = admin.database().ref('/users/' + pledgeName);
  const activeRef = admin.database().ref('/users/' + activeName + '/Pledges/' + pledgeName);

  pledgeRef.once('value', (pledge) => {
    pledgeRef.update({
      totalMerits: pledge.val().totalMerits - req.body.merit.amount
    });

    pledgeRef.child('Merits').once('value', (merits) => {
      merits.forEach((merit) => {
        if (equal(req.body.merit, merit.val())) {
          merit.ref.remove(() => {
            activeRef.once('value', (active) => {
              if (req.body.merit.description.lastIndexOf('Chalkboard:', 0) !== 0) {
                activeRef.update({
                  merits: active.val().merits + req.body.merit.amount
                });
              }

              res.sendStatus(200);
            });
          });
        }
      });
    });
  });
};

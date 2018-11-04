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

  selectedPledges.forEach((pledge) => {
    const activeRef = admin.database().ref('/users/' + displayName);
    const pledgeRef = admin.database().ref('/users/' + pledge.value);

    activeRef.once('value', (active) => {
      if (status !== 'pipm' && !isChalkboard && !isPCGreet) {
        const remainingMerits = active.val().Pledges[pledge.value].merits - merit.amount;

        if (merit.amount > 0 &&
            remainingMerits < 0 &&
            !res.headersSent) {
          res.sendStatus(400).send(pledge.label);
        }
        else {
          const activePledgeRef = active.ref.child('/Pledges/' + pledge.value);

          activePledgeRef.update({
            merits: remainingMerits
          });

          activeRef.update({
            totalMerits: active.val().totalMerits + merit.amount
          })
        }
      }

      pledgeRef.once('value', (pledge) => {
        counter++;

        pledgeRef.update({
          totalMerits: pledge.val().totalMerits + merit.amount
        });

        merit.pledgeName = `${pledge.val().firstName} ${pledge.val().lastName}`;
        merit.pledgePhoto = pledge.val().photoURL;

        const meritsRef = admin.database().ref('/merits');
        const key = meritsRef.push(merit).getKey();
        pledge.ref.child('Merits').push(key);
        activeRef.child('Merits').push(key);

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
    isChalkboard,
    isPCGreet
  } = req.body;
  let { merit } = req.body;

  selectedActives.forEach((child) => {
    const activeRef = admin.database().ref('/users/' + child.value);
    const pledgeRef = admin.database().ref('/users/' + displayName);

    activeRef.once('value', (active) => {
      merit.activeName = `${active.val().firstName} ${active.val().lastName}`;
      merit.activePhoto = active.val().photoURL;

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

          activeRef.update({
            totalMerits: active.val().totalMerits + merit.amount
          })
        }
      }

      pledgeRef.once('value', (pledge) => {
        counter++;

        const meritsRef = admin.database().ref('/merits');
        const key = meritsRef.push(merit).getKey();
        pledge.ref.child('Merits').push(key);
        active.ref.child('Merits').push(key);

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

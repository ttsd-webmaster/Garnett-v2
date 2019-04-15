const admin = require('firebase-admin');
const equal = require('deep-equal');
const useragent = require('useragent');

// Get remaining merits for pledge
exports.get_remaining_merits = function(req, res) {
  const { displayName, pledgeName } = req.query;
  const meritsRef = admin.database().ref(`/users/${displayName}/Pledges/${pledgeName }/merits`);

  meritsRef.once('value', (merits) => {
    res.json(merits.val());
  });
};

// Gets all the pledges for meriting as active
exports.get_pledges_as_active = function(req, res) {
  const { displayName } = req.query;
  const pledgesRef = admin.database().ref(`/users/${displayName}/Pledges`);

  pledgesRef.once('value', (snapshot) => {
    let pledges;

    if (snapshot.val()) {
      pledges = Object.keys(snapshot.val()).map(function(key) {
        return {
          value: key,
          label: key.replace(/([a-z])([A-Z])/, '$1 $2'),
          remainingMerits: snapshot.val()[key].merits
        };
      });
    }

    res.json(pledges);
  });
};

// Gets all the pledges for meriting as active (MOBILE)
exports.get_pledges_as_active_mobile = function(req, res) {
  const { displayName } = req.query;
  const usersRef = admin.database().ref('/users');
  const userPledgesRef = admin.database().ref(`/users/${displayName}/Pledges`);

  userPledgesRef.once('value', (pledges) => {
    if (pledges.val()) {
      const result = [];
      const promises = [];
      const remainingMerits = new Map();
      pledges.forEach((pledge) => {
        remainingMerits.set(pledge.key, pledge.val().merits);
        promises.push(usersRef.child(pledge.key).once('value'))
      });

      Promise.all(promises).then((results) => {
        results.forEach((user) => {
          if (user.val()) {
            const currentPledge = {
              firstName: user.val().firstName,
              lastName: user.val().lastName,
              year: user.val().year,
              major: user.val().major,
              photoURL: user.val().photoURL,
              remainingMerits: remainingMerits.get(user.key)
            };
            result.push(currentPledge);
          }
        })
        res.json(result)
      })
    }
  });
};

// Get Pbros data for pledges
exports.get_pbros_as_pledge = function(req, res) {
  const { displayName } = req.query;
  const usersRef = admin.database().ref('/users');
  const meritsRef = admin.database().ref('/merits');

  usersRef.orderByChild('status').equalTo('pledge').once('value', (pledges) => {
    if (!pledges.val()) {
      return res.status(400).send('No pledges found.');
    }
    pledges = Object.keys(pledges.val()).map(function(key) {
      if (pledges.val()[key] !== displayName) {
        return pledges.val()[key];
      }
    });

    meritsRef.once('value', (merits) => {
      // Set all the pledge's total merits
      pledges.forEach((pledge) => {
        let totalMerits = 0;
        // Retrieves the pledge's total merits by searching for the key in
        // the Merits table
        if (merits.val() && pledge.Merits) {
          Object.keys(pledge.Merits).forEach(function(key) {
            if (merits.val()[pledge.Merits[key]]) {
              totalMerits += merits.val()[pledge.Merits[key]].amount;
            }
          });
        }
        pledge.totalMerits = totalMerits;
      });

      res.json(pledges);
    });
  });
};

// Gets all the actives for meriting as pledge
exports.get_actives_as_pledge = function(req, res) {
  const { displayName, showAlumni } = req.query;
  const usersRef = admin.database().ref('/users');

  usersRef.once('value', (users) => {
    const result = [];

    users.forEach((user) => {
      if (user.val().status !== 'pledge') {
        const currentActive = {
          value: user.key,
          label: `${user.val().firstName} ${user.val().lastName}`,
          remainingMerits: user.val().Pledges[displayName].merits
        };

        if (showAlumni === 'true') {
          if (user.val().status === 'alumni') {
            result.push(currentActive);
          }
        } else if (user.val().status !== 'alumni') {
          result.push(currentActive);
        }
      }
    });

    res.json(result);
  });
};

// Gets all the actives for meriting as pledge (MOBILE)
exports.get_actives_as_pledge_mobile = function(req, res) {
  const { displayName, showAlumni } = req.query;
  const usersRef = admin.database().ref('/users');

  usersRef.once('value', (users) => {
    const result = [];

    users.forEach((user) => {
      if (user.val().status !== 'pledge') {
        const currentActive = {
          firstName: user.val().firstName,
          lastName: user.val().lastName,
          year: user.val().year,
          major: user.val().major,
          photoURL: user.val().photoURL,
          remainingMerits: user.val().Pledges[displayName].merits
        };

        if (showAlumni === 'true') {
          if (user.val().status === 'alumni') {
            result.push(currentActive);
          }
        } else if (user.val().status !== 'alumni') {
          result.push(currentActive);
        }
      }
    });

    res.json(result);
  });
};

// Gets all the chalkboards for merit
exports.get_chalkboards_merit = function(req, res) {
  const { fullName } = req.query;
  const chalkboardsRef = admin.database().ref('/chalkboards');

  chalkboardsRef.once('value', (chalkboards) => {
    const myChalkboards = [];

    if (chalkboards.val()) {
      chalkboards.forEach((chalkboard) => {
        const { title, amount, activeName, attendees } = chalkboard.val();
        const currentChalkboard = { title, amount };

        if (activeName === fullName) {
          myChalkboards.push(currentChalkboard);
        } else if (attendees) {
          const attendeesArray = Object.keys(attendees).map(function(key) {
            return attendees[key];
          });

          attendeesArray.forEach((attendee) => {
            if (attendee.name === fullName) {
              myChalkboards.push(currentChalkboard);
            }
          });
        }
      });
    }

    res.json(myChalkboards);
  });
};

// Create merit
exports.create_merit = function(req, res) {
  const { user, selectedUsers } = req.body;
  const platform = useragent.parse(req.headers['user-agent']).toString();
  const meritsRef = admin.database().ref('/merits');
  const activesThatMerited = [];
  const meritsToAdd = [];

  selectedUsers.forEach((selectedUser) => {
    const merit = Object.assign({}, req.body.merit);
    const selectedDisplayName = selectedUser.firstName + selectedUser.lastName;
    let active;
    let pledge;

    // Set the merit's platform for tracking
    merit.platform = platform;

    // Set the pledge and the active based on who is creating the merits
    if (user.status === 'pledge') {
      active = selectedUser;
      pledge = user;
      active.displayName = selectedDisplayName;
    } else {
      active = user;
      pledge = selectedUser;
      pledge.displayName = selectedDisplayName;
    }

    const nonPCStandardizedMerit = (
      merit.type === 'standardized' &&
      merit.description !== 'PC Merits'
    );
    const shouldCountTowardsMeritCap = (
      user.status !== 'pipm' &&
      (merit.type === 'personal' || nonPCStandardizedMerit)
    );

    // Push active to array if not pi or pm
    if (shouldCountTowardsMeritCap) {
      if (merit.amount > selectedUser.remainingMerits) {
        const userName = `${selectedUser.firstName} ${selectedUser.lastName}`;
        return res.status(400).send(userName);
      } else {
        const activePledgeRef = admin.database().ref(`/users/${active.displayName}/Pledges/${pledge.displayName}`);
        const updatedMerits = selectedUser.remainingMerits - merit.amount;
        activesThatMerited.push([activePledgeRef, updatedMerits]);
      }
    }

    // Finally, set the merit's remaining info based on the user's status
    if (user.status === 'pledge') {
      merit.activeName = `${active.firstName} ${active.lastName}`;
      merit.activePhoto = active.photoURL;
    } else {
      merit.pledgeName = `${pledge.firstName} ${pledge.lastName}`;
      merit.pledgePhoto = pledge.photoURL;
    }

    // Add merit to array of merits to add to DB
    meritsToAdd.push(merit);
  });

  // If all users have enough merits to give, add the merits to the DB
  if (!res.headersSent) {
    meritsToAdd.forEach((merit) => {
      meritsRef.push(merit);
    });

    activesThatMerited.forEach((activeThatMerited) => {
      const activePledgeRef = activeThatMerited[0];
      const merits = activeThatMerited[1];
      activePledgeRef.update({ merits });
    });

    res.sendStatus(200);
  } else {
    res.status(400).send('Error');
  }
};

// Deletes merit
exports.delete_merit = function(req, res) {
  const { displayName, meritToDelete } = req.body;
  const activeName = meritToDelete.activeName.replace(/ /g, '');
  const pledgeName = meritToDelete.pledgeName.replace(/ /g, '');
  const meritsRef = admin.database().ref('/merits');
  const activePledgeMeritsRef = admin.database().ref(`/users/${displayName}/Pledges/${pledgeName}`);

  if (displayName !== activeName) {
    return res.sendStatus(400);
  }

  meritsRef.once('value', (merits) => {
    merits.forEach((merit) => {
      // Find the merit in the merits list
      if (equal(merit.val(), meritToDelete)) {
        // Remove the merit from all merits list
        merit.ref.remove(() => {
          activePledgeMeritsRef.child('merits').once('value', (meritCount) => {
            const updatedMeritCount = meritCount.val() + meritToDelete.amount;
            // Update the active's remaining merits for the pledge
            activePledgeMeritsRef.update({ merits: updatedMeritCount });
            res.sendStatus(200);
          });
        })
      }
    })
  })
};

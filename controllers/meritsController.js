const admin = require('firebase-admin');
const equal = require('deep-equal');
const useragent = require('useragent');

// Get next 50 merits for all merits list
exports.get_all_merits = function(req, res) {
  let { lastKey } = req.query;
  const meritsRef = admin.database().ref('/merits');
  let fetchedMerits = [];
  let updatedLastKey;

  // Subsequent fetches
  if (lastKey) {
    lastKey = JSON.parse(lastKey);
    meritsRef
    .orderByChild('date')
    .endAt(lastKey.value, lastKey.key)
    .limitToLast(50)
    .once('value', (merits) => {
      if (merits.val()) {
        merits.forEach((merit, i) => {
          if (!updatedLastKey) {
            updatedLastKey = {
              value: merit.val().date,
              key: merit.key
            };
          }
          fetchedMerits.push(merit.val());
        });
      }
      fetchedMerits = fetchedMerits.reverse().slice(1);
      res.json({ fetchedMerits, lastKey: updatedLastKey });
    });
  } else {
    // Initial fetch
    meritsRef
    .orderByChild('date')
    .limitToLast(50)
    .once('value', (merits) => {
      if (merits.val()) {
        merits.forEach((merit, i) => {
          if (!updatedLastKey) {
            updatedLastKey = {
              value: merit.val().date,
              key: merit.key
            };
          }
          fetchedMerits.push(merit.val());
        });
      }
      fetchedMerits = fetchedMerits.reverse();
      res.json({ fetchedMerits, lastKey: updatedLastKey });
    });
  }
};

// Get next 50 merits for all merits list reversed
exports.get_all_merits_reverse = function(req, res) {
  let { lastKey } = req.query;
  const meritsRef = admin.database().ref('/merits');
  let fetchedMerits = [];
  let updatedLastKey;

  // Subsequent fetches
  if (lastKey) {
    lastKey = JSON.parse(lastKey);
    meritsRef
    .orderByChild('date')
    .startAt(lastKey.value, lastKey.key)
    .limitToFirst(50)
    .once('value', (merits) => {
      if (merits.val()) {
        merits.forEach((merit, i) => {
          updatedLastKey = {
            value: merit.val().date,
            key: merit.key
          };
          fetchedMerits.push(merit.val());
        });
      }
      fetchedMerits = fetchedMerits.slice(1);
      res.json({ fetchedMerits, lastKey: updatedLastKey });
    });
  } else {
    // Initial fetch
    meritsRef
    .orderByChild('date')
    .limitToFirst(50)
    .once('value', (merits) => {
      if (merits.val()) {
        merits.forEach((merit, i) => {
          updatedLastKey = {
            value: merit.val().date,
            key: merit.key
          };
          fetchedMerits.push(merit.val());
        });
      }
      res.json({ fetchedMerits, lastKey: updatedLastKey });
    });
  }
}

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
            const { firstName, lastName, Pledges } = user.val();
            const currentPledge = user.val();
            currentPledge.displayName = firstName + lastName;
            currentPledge.remainingMerits = remainingMerits.get(user.key);
            result.push(currentPledge);
          }
        })
        res.json(result)
      });
    }
  });
};

// Gets all the actives for meriting as pledge
exports.get_actives_as_pledge = function(req, res) {
  const { displayName, showAlumni } = req.query;
  const usersRef = admin.database().ref('/users');

  usersRef.once('value', (users) => {
    const result = [];

    users.forEach((user) => {
      const { firstName, lastName, status, Pledges } = user.val();
      if (status !== 'pledge') {
        const currentActive = user.val();
        currentActive.displayName = firstName + lastName;
        currentActive.remainingMerits = Pledges[displayName].merits;

        if (showAlumni === 'true') {
          if (status === 'alumni') {
            result.push(currentActive);
          }
        } else if (status !== 'alumni') {
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
  let notEnoughMeritsUser;

  selectedUsers.forEach((selectedUser) => {
    const merit = Object.assign({}, req.body.merit);
    let active;
    let pledge;

    // Set the merit's platform for tracking
    merit.platform = platform;

    // Set the pledge and the active based on who is creating the merits
    if (user.status === 'pledge') {
      active = selectedUser;
      pledge = user;
    } else {
      active = user;
      pledge = selectedUser;
    }

    const nonPCStandardizedMerit = (
      merit.type === 'standardized' &&
      merit.description !== 'PC Merits'
    );
    const shouldCountTowardsMeritCap = (
      active.status !== 'pipm' &&
      (
        merit.type === 'personal' ||
        merit.type === 'interview' ||
        nonPCStandardizedMerit
      )
    );

    // Push active to array if not pi or pm
    if (shouldCountTowardsMeritCap) {
      if (merit.amount > selectedUser.remainingMerits) {
        const userName = `${selectedUser.firstName} ${selectedUser.lastName}`;
        notEnoughMeritsUser = userName;
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
  if (notEnoughMeritsUser) {
    res.status(400).send(notEnoughMeritsUser);
  } else {
    // Add the merits to the DB
    meritsToAdd.forEach((merit) => {
      meritsRef.push(merit);
    });
    // Update the actives' remaining merits
    activesThatMerited.forEach((activeThatMerited) => {
      const activePledgeRef = activeThatMerited[0];
      const merits = activeThatMerited[1];
      activePledgeRef.update({ merits });
    });
    res.sendStatus(200);
  }
};

// Deletes merit
exports.delete_merit = function(req, res) {
  const { displayName, status, meritToDelete } = req.body;
  const meritsRef = admin.database().ref('/merits');

  // Pledges can only delete merits they created
  if (status === 'pledge' && (displayName !== meritToDelete.createdBy)) {
    return res.sendStatus(400);
  }

  meritsRef.once('value', (merits) => {
    merits.forEach((merit) => {
      // Find the merit in the merits list
      if (equal(merit.val(), meritToDelete)) {
        // Remove the merit from all merits list
        merit.ref.remove(() => {
          const pledgeName = meritToDelete.pledgeName.replace(/ /g, '');
          const activePledgeMeritsRef = admin.database().ref(`/users/${displayName}/Pledges/${pledgeName}`);
          // Update the active's remaining merits for the pledge
          activePledgeMeritsRef.child('merits').once('value', (meritCount) => {
            const updatedMeritCount = meritCount.val() + meritToDelete.amount;
            activePledgeMeritsRef.update({ merits: updatedMeritCount });
            res.sendStatus(200);
          });
        })
      }
    })
  })
};

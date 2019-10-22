const admin = require('firebase-admin');
const equal = require('deep-equal');
const useragent = require('useragent');

function baseMerits(status) {
  switch (status) {
    case 'alumni':
      return 200;
    case 'pipm':
      return 'Unlimited';
    default:
      return 100;
  }
}

function shouldCountTowardsMeritCap(merit) {
  const nonPCStandardizedMerit =
    merit.type === 'standardized' &&
    merit.description !== 'PC Merits';

  const shouldCountTowardsMeritCap =
    merit.type === 'personal' ||
    merit.type === 'interview' ||
    nonPCStandardizedMerit;

  return shouldCountTowardsMeritCap;
}

// Get next 50 merits for all merits list
exports.get_all_merits = function(req, res) {
  let { lastKey } = req.query;
  const meritsRef = admin.database().ref('/merits');
  let fetchedMerits = [];
  let updatedLastKey;
  let hasMore = false;

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
      hasMore = fetchedMerits.length > 0;
      res.json({ fetchedMerits, lastKey: updatedLastKey, hasMore });
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
      hasMore = fetchedMerits.length > 0;
      res.json({ fetchedMerits, lastKey: updatedLastKey, hasMore });
    });
  }
};

// Get next 50 merits for all merits list reversed
exports.get_all_merits_reverse = function(req, res) {
  let { lastKey } = req.query;
  const meritsRef = admin.database().ref('/merits');
  let fetchedMerits = [];
  let updatedLastKey;
  let hasMore = false;

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
      hasMore = fetchedMerits.length > 0;
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
      hasMore = fetchedMerits.length > 0;
      res.json({ fetchedMerits, lastKey: updatedLastKey });
    });
  }
}

// Query for the specified pledge's merits
exports.get_pledge_merits = function(req, res) {
  const { pledgeName } = req.query;
  const meritsRef = admin.database().ref('/merits');

  meritsRef.orderByChild('date').once('value', (merits) => {
    const pledgeMerits = [];
    if (merits.val()) {
      merits.forEach((merit) => {
        if (pledgeName === merit.val().pledgeName.replace(/ /g,'')) {
          pledgeMerits.push(merit.val());
        }
      });
    }
    res.json({ merits: pledgeMerits.reverse() });
  });
};

// Get remaining merits for pledge
exports.get_remaining_merits = function(req, res) {
  const { fullName, pledgeName, status } = req.query;
  const meritsRef = admin.database().ref('/merits');
  let remainingMerits = baseMerits(status);

  if (status === 'pipm') {
    return res.json(remainingMerits);
  }

  meritsRef.orderByChild('activeName').equalTo(fullName).once('value', (merits) => {
    if (merits.exists()) {
      merits.forEach((merit) => {
        if (pledgeName === merit.val().pledgeName &&
            shouldCountTowardsMeritCap(merit.val())) {
          remainingMerits -= merit.val().amount;
        }
      });
    }
    res.json(remainingMerits);
  });
};

// Gets all the pledges for meriting as active
exports.get_pledges_as_active = function(req, res) {
  const { fullName, status } = req.query;
  const usersRef = admin.database().ref('/users');
  const meritsRef = admin.database().ref('/merits');
  const result = [];
  const remainingMeritsMap = new Map();

  meritsRef.orderByChild('activeName').equalTo(fullName).once('value', (merits) => {
    if (merits.exists() && status !== 'pipm') {
      merits.forEach((merit) => {
        const { pledgeName, amount } = merit.val();
        let remainingMerits =
          remainingMeritsMap.get(pledgeName) || baseMerits(status);

        if (shouldCountTowardsMeritCap(merit.val())) {
          remainingMerits -= amount;
        }

        remainingMeritsMap.set(pledgeName, remainingMerits);
      });
    }

    usersRef.orderByChild('status').equalTo('pledge').once('value', (pledges) => {
      if (pledges.exists()) {
        pledges.forEach((pledge) => {
          const currentPledge = pledge.val();
          const pledgeName = `${pledge.val().firstName} ${pledge.val().lastName}`;
          currentPledge.displayName = pledge.key;
          currentPledge.remainingMerits = remainingMeritsMap.get(pledgeName) || baseMerits(status);
          result.push(currentPledge);
        });
        res.json(result);
      } else {
        res.json(result);
      }
    });
  });
};

// Gets all the actives for meriting as pledge
exports.get_actives_as_pledge = function(req, res) {
  const { fullName, showAlumni } = req.query;
  const usersRef = admin.database().ref('/users');
  const meritsRef = admin.database().ref('/merits');
  const result = [];
  const meritsToSubtract = new Map();

  meritsRef.orderByChild('pledgeName').equalTo(fullName).once('value', (merits) => {
    if (merits.exists()) {
      merits.forEach((merit) => {
        const { activeName, amount } = merit.val();
        let subtracted = meritsToSubtract.get(activeName) || 0;

        if (shouldCountTowardsMeritCap(merit.val())) {
          subtracted += amount;
        }

        meritsToSubtract.set(activeName, subtracted);
      });
    }

    usersRef.once('value', (users) => {
      users.forEach((active) => {
        const { status } = active.val();
        if (status !== 'pledge') {
          const currentActive = active.val();
          const activeName = `${active.val().firstName} ${active.val().lastName}`;
          const meritsUsed = meritsToSubtract.get(activeName);
          currentActive.displayName = active.key;
          currentActive.remainingMerits = baseMerits(status);

          if (status !== 'pipm' && meritsUsed) {
            currentActive.remainingMerits -= meritsUsed;
          }

          if (showAlumni === 'true') {
            if (status === 'alumni') {
              result.push(currentActive);
            }
          } else {
            if (status !== 'alumni') {
              result.push(currentActive);
            }
          }
        }
      });
      res.json(result);
    });
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
  const interviewsRef = admin.database().ref('/interviews');
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

    // Push active to array if not pi or pm
    if (shouldCountTowardsMeritCap(merit) && active.status !== 'pipm') {
      // Check if user does not have enough merits
      if (merit.amount > selectedUser.remainingMerits) {
        const userName = `${selectedUser.firstName} ${selectedUser.lastName}`;
        notEnoughMeritsUser = userName;
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
      if (merit.type === 'interview') {
        const { activeName, pledgeName } = merit;
        interviewsRef.push({ activeName, pledgeName });
      }
    });
    res.sendStatus(200);
  }
};

// Update merit date
exports.update_merit = function(req, res) {
  const { displayName, status, meritToEdit, date } = req.body;
  const meritsRef = admin.database().ref('/merits');

  // Pledges can only edit merits they created
  if (status === 'pledge' && (displayName !== meritToEdit.createdBy)) {
    return res.sendStatus(400);
  }

  meritsRef.once('value', (merits) => {
    merits.forEach((merit) => {
      // Find the merit in the merits list
      if (equal(merit.val(), meritToEdit)) {
        merit.ref.update({ date });
        res.sendStatus(200);
      }
    });
  });
}

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
      const activeName = merit.val().activeName.replace(/ /g,'');
      const pledgeName = merit.val().pledgeName.replace(/ /g,'');

      // Find the merit in the merits list
      if (equal(merit.val(), meritToDelete)) {
        // Remove the merit from all merits list
        merit.ref.remove(() => {
          res.sendStatus(200);
        });
      }
    });
  });
};

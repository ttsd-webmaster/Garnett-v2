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
        }
        else if (user.val().status !== 'alumni') {
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

  chalkboardsRef.once('value', (snapshot) => {
    const myChalkboards = [];

    if (snapshot.val()) {
      const chalkboards = Object.keys(snapshot.val()).map(function(key) {
        return snapshot.val()[key];
      });

      chalkboards.forEach((chalkboard) => {
        const { title, amount } = chalkboard;
        const currentChalkboard = { title, amount };

        if (chalkboard.activeName === fullName) {
          myChalkboards.push(currentChalkboard);
        } else if (chalkboard.attendees) {
          const attendees = Object.keys(chalkboard.attendees).map(function(key) {
            return chalkboard.attendees[key];
          });

          attendees.forEach((attendee) => {
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
  const {
    displayName,
    selectedUsers,
    merit,
    status
  } = req.body;
  const usersRef = admin.database().ref('/users');
  const platform = useragent.parse(req.headers['user-agent']).toString();
  const activesToUpdate = [];

  selectedUsers.forEach((user) => {
    const userDisplayName = user.firstName + user.lastName;
    let active;
    let pledge;
    if (status === 'pledge') {
      active = userDisplayName;
      pledge = displayName;
    } else {
      active = displayName;
      pledge = userDisplayName;
    }
    const activeRef = usersRef.child(active);
    const pledgeRef = usersRef.child(pledge);

    activeRef.once('value', (active) => {
      const nonPCStandardizedMerit = merit.type === 'standardized' && merit.description !== 'PC Merits';
      const shouldCountTowardsMeritCap = (
        status !== 'pipm' && (merit.type === 'personal' || nonPCStandardizedMerit)
      );

      if (shouldCountTowardsMeritCap) {
        if (merit.amount > user.remainingMerits && !res.headersSent) {
          const userName = `${user.firstName} ${user.lastName}`;
          return res.status(400).send(userName);
        } else {
          const pledgeName = pledge.firstName + pledge.lastName;
          const activePledgeRef = active.ref.child(`/Pledges/${pledgeName}`);
          activesToUpdate.push([activePledgeRef, user.remainingMerits]);
        }
      }

      pledgeRef.once('value', (pledge) => {
        if (status === 'pledge') {
          merit.activeName = `${active.val().firstName} ${active.val().lastName}`;
          merit.activePhoto = active.val().photoURL;
          merit.platform = platform;
        } else {
          merit.pledgeName = `${pledge.val().firstName} ${pledge.val().lastName}`;
          merit.pledgePhoto = pledge.val().photoURL;
          merit.platform = platform;
        }

        const meritsRef = admin.database().ref('/merits');
        meritsRef.push(merit);

        if (!res.headersSent && activesToUpdate.length === selectedUsers.length) {
          activesToUpdate.forEach((activeToUpdate) => {
            const activeRef = activeToUpdate[0];
            const remainingMerits = activeToUpdate[1];
            activeRef.update({ merits: remainingMerits });
          });
          res.sendStatus(200);
        } else {
          res.status(400).send('Error');
        }
      });
    });
  })
};

// Deletes merit
exports.delete_merit = function(req, res) {
  const pledgeName = req.body.merit.pledgeName.replace(/ /g,'');
  const activeName = req.body.merit.activeName.replace(/ /g,'');
  const meritsRef = admin.database().ref('/merits');
  const pledgeRef = admin.database().ref(`/users/${pledgeName}`);
  const activeRef = admin.database().ref(`/users/${activeName}`);

  meritsRef.once('value', (merits) => {
    merits.forEach((merit) => {
      // Find the merit in the merits list
      if (equal(merit.val(), req.body.merit)) {
        // Remove the merit from all merits list
        merit.ref.remove(() => {
          pledgeRef.once('value', (pledge) => {
            const pledgeMerits = Object.keys(pledge.val().Merits).map(function(key) {
              return [pledge.val().Merits[key], key];
            });

            // Search for the merit reference in the pledge's merits
            pledgeMerits.forEach((pledgeMerit) => {
              if (pledgeMerit[0] === merit.key) {
                // Remove the merit from the pledge's merits
                pledgeRef.child('Merits').child(pledgeMerit[1]).remove(() => {
                  activeRef.once('value', (active) => {
                    const activeMerits = Object.keys(active.val().Merits).map(function(key) {
                      return [active.val().Merits[key], key];
                    });

                    // Search for the merit reference in the active's merits
                    activeMerits.forEach((activeMerit) => {
                      if (activeMerit[0] === merit.key) {
                        // Remove the merit from the active's merits
                        activeRef.child('Merits').child(activeMerit[1]).remove(() => {
                          // Update the active's remaining merits for the pledge
                          activeRef.child('Pledges').child(pledgeName).update({
                            merits: active.val().Pledges[pledgeName].merits + req.body.merit.amount
                          });

                          res.sendStatus(200);
                        })
                      }
                    })
                  });
                })
              }
            })
          });
        })
      }
    })
  })
};

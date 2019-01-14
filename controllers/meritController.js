const admin = require('firebase-admin');
const equal = require('deep-equal');
const useragent = require('useragent');

// Get remaining merits for pledge
exports.get_remaining_merits = function(req, res) {
  const { displayName, pledgeName } = req.query;
  const meritsRef = admin.database().ref('/users/' + displayName + '/Pledges/' + pledgeName + '/merits');

  meritsRef.once('value', (merits) => {
    console.log()
    res.json(merits.val());
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
  const userPledgesRef = admin.database().ref('/users/' + displayName + '/Pledges');

  userPledgesRef.once('value', (pledges) => {
    if (pledges.val()) {
      let result = [];
      let promises = [];
      let remainingMerits = new Map();
      pledges.forEach((pledge) => {
        remainingMerits.set(pledge.key, pledge.val().merits);
        promises.push(usersRef.child(pledge.key).once('value'))
      });

      Promise.all(promises).then((results) => {
        results.forEach((user) => {
          let currentPledge = {
            firstName: user.val().firstName,
            lastName: user.val().lastName,
            year: user.val().year,
            major: user.val().major,
            photoURL: user.val().photoURL,
            remainingMerits: remainingMerits.get(user.key)
          };
          result.push(currentPledge);
        })
        res.json(result)
      })
    }
  });
};

// Gets all the actives for meriting as pledge
exports.get_actives_as_pledge = function(req, res) {
  const { displayName, showAlumni } = req.query;
  const usersRef = admin.database().ref('/users');

  usersRef.once('value', (users) => {
    let result = [];

    users.forEach((user) => {
      if (user.val().status !== 'pledge') {
        let currentActive = {
          value: user.key,
          label: `${user.val().firstName} ${user.val().lastName}`,
          remainingMerits: user.val().Pledges[displayName].merits
        };

        if (showAlumni) {
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
    let result = [];

    users.forEach((user) => {
      if (user.val().status !== 'pledge') {
        let currentActive = {
          firstName: user.val().firstName,
          lastName: user.val().lastName,
          year: user.val().year,
          major: user.val().major,
          photoURL: user.val().photoURL,
          remainingMerits: user.val().Pledges[displayName].merits
        };

        if (showAlumni) {
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
        let currentChalkboard = {
          title: chalkboard.title,
          amount: chalkboard.amount
        };

        if (chalkboard.activeName === fullName) {
          myChalkboards.push(currentChalkboard);
        }
        else if (chalkboard.attendees) {
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
  const {
    displayName,
    selectedPledges,
    isChalkboard,
    isPCGreet,
    status
  } = req.body;
  const platform = useragent.parse(req.headers['user-agent']).toString();
  let { merit } = req.body;
  let counter = 0;

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
        }
      }

      pledgeRef.once('value', (pledge) => {
        counter++;

        pledgeRef.update({
          totalMerits: pledge.val().totalMerits + merit.amount
        });

        merit.pledgeName = `${pledge.val().firstName} ${pledge.val().lastName}`;
        merit.pledgePhoto = pledge.val().photoURL;
        merit.platform = platform;

        const meritsRef = admin.database().ref('/merits');
        const key = meritsRef.push(merit).getKey();
        pledge.ref.child('Merits').push(key);
        activeRef.child('Merits').push(key);

        if (!res.headersSent && counter === selectedPledges.length) {
          activeRef.update({
            totalMerits: active.val().totalMerits + (merit.amount * selectedPledges.length)
          });

          res.sendStatus(200);
        }
      });
    });
  })
};

// Put merit data as pledge
exports.merit_as_pledge = function(req, res) {
  const {
    displayName,
    selectedActives,
    isChalkboard,
    isPCGreet
  } = req.body;
  const platform = useragent.parse(req.headers['user-agent']).toString();
  let { merit } = req.body;
  let counter = 0;

  selectedActives.forEach((child) => {
    const activeRef = admin.database().ref('/users/' + child.value);
    const pledgeRef = admin.database().ref('/users/' + displayName);

    activeRef.once('value', (active) => {
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

      activeRef.update({
        totalMerits: active.val().totalMerits + merit.amount
      });

      pledgeRef.once('value', (pledge) => {
        counter++;

        merit.activeName = `${active.val().firstName} ${active.val().lastName}`;
        merit.activePhoto = active.val().photoURL;
        merit.platform = platform;

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
  const pledgeName = req.body.merit.pledgeName.replace(/ /g,'');
  const activeName = req.body.merit.activeName.replace(/ /g,'');
  const meritsRef = admin.database().ref('/merits');
  const pledgeRef = admin.database().ref('/users/' + pledgeName);
  const activeRef = admin.database().ref('/users/' + activeName);

  meritsRef.once('value', (merits) => {
    merits.forEach((merit) => {
      // Find the merit in the merits list
      if (equal(merit.val(), req.body.merit)) {
        // Remove the merit from all merits list
        merit.ref.remove(() => {
          pledgeRef.once('value', (pledge) => {
            // Update the pledge's total merits
            pledgeRef.update({
              totalMerits: pledge.val().totalMerits - req.body.merit.amount
            });

            const pledgeMerits = Object.keys(pledge.val().Merits).map(function(key) {
              return [pledge.val().Merits[key], key];
            });

            // Search for the merit reference in the pledge's merits
            pledgeMerits.forEach((pledgeMerit) => {
              if (pledgeMerit[0] === merit.key) {
                // Remove the merit from the pledge's merits
                pledgeRef.child('Merits').child(pledgeMerit[1]).remove(() => {
                  activeRef.once('value', (active) => {
                    // Update the active's total merits if the merit is not from a chalkboard
                    if (req.body.merit.description.lastIndexOf('Chalkboard:', 0) !== 0) {
                      activeRef.update({
                        totalMerits: active.val().totalMerits - req.body.merit.amount
                      });
                    }

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

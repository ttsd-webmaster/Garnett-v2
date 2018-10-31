const admin = require("firebase-admin");
const firebase = require('@firebase/app').firebase;
require('@firebase/auth');
require('@firebase/storage');

// Retrieving Authentication Status Route
exports.get_auth_status = function(req, res) {
  // Send back user's info to the client
  const { displayName } = req.query;
  const userRef = admin.database().ref('/users/' + displayName);
  console.log(displayName)

  userRef.once('value', (user) => {
    res.json(user.val());
  });
};

// Query for active data
exports.get_actives = function(req, res) {
  const usersRef = admin.database().ref('/users');
  let activeArray = [];

  usersRef.once('value', (users) => {
    users.forEach((child) => {
      if (child.val().status !== 'pledge') {
        activeArray.push(child.val());
      }
    });

    activeArray.sort((a, b) => {
      return a.lastName > b.lastName ? 1 : -1;
    });

    console.log("Active array: ", activeArray);
    res.json(activeArray);
  });
};

// Query for merit data on Pledge App
exports.get_pledges = function(req, res) {
  const { displayName } = req.query;
  const userRef = admin.database().ref('/users/' + displayName);
  let meritArray = [];
  let complaintsArray = [];

  userRef.once('value', (user) => {
    const totalMerits = user.val().totalMerits;

    if (user.val().Merits) {
      meritArray = Object.keys(user.val().Merits).map(function(key) {
        return user.val().Merits[key];
      });
    }

    if (user.val().Complaints) {
      complaintsArray = Object.keys(user.val().Complaints).map(function(key) {
        return user.val().Complaints[key];
      });
    }

    console.log('Merit array: ', meritArray);
    console.log('Complaints array: ', complaintsArray);

    const data = {
      totalMerits: totalMerits,
      meritArray: meritArray.reverse(),
      complaintsArray: complaintsArray
    };

    res.json(data);
  });
};

// Query for the specified pledge's merits
exports.get_pledge_merits = function(req, res) {
  const { pledgeName } = req.query;
  const meritsRef = admin.database().ref('/users/' + pledgeName + '/Merits');
  let merits = [];

  meritsRef.once('value', (snapshot) => {
    if (snapshot.val()) {
      merits = Object.keys(snapshot.val()).map(function(key) {
        return snapshot.val()[key];
      }).sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
    }

    res.json(merits);
  });
};

// Query for the specified pledge's complaints
exports.get_pledge_complaints = function(req, res) {
  const { pledgeName } = req.query;
  const complaintsRef = admin.database().ref('/users/' + pledgeName + '/Complaints');
  let complaints = [];

  complaintsRef.once('value', (snapshot) => {
    if (snapshot.val()) {
      complaints = Object.keys(snapshot.val()).map(function(key) {
        return snapshot.val()[key];
      }).sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
    }

    res.json(complaints);
  });
};

// Signup Route
exports.signup = function(req, res) {
  let firstName = req.body.firstName.replace(/ /g,'');
  let lastName = req.body.lastName.replace(/ /g,'');
  firstName = firstName[0].toUpperCase() + firstName.substr(1);
  lastName = lastName[0].toUpperCase() + lastName.substr(1);
  const displayName = firstName + lastName;
  const usersRef = admin.database().ref('/users');
  const userRef = admin.database().ref('/users/' + displayName);

  userRef.once('value', (snapshot) => {
    if (snapshot.val() && req.body.year !== 'Alumni') {
      res.status(400).send('This active is already signed up.');
    }
    else if (
      (snapshot.val() && req.body.year === 'Alumni') || 
      (!snapshot.val() && req.body.year !== 'Alumni')
    ) {
      // Create user with email and password
      firebase.auth().createUserWithEmailAndPassword(req.body.email, req.body.password)
      .then((user) => {
        if (user && !user.emailVerified) {
          user.updateProfile({ displayName })
          .then(function() {
            let userInfo = {
              firstName: req.body.firstName.trim(),
              lastName: req.body.lastName.trim(),
              class: req.body.className,
              major: req.body.majorName,
              year: req.body.year,
              phone: req.body.phone,
              email: req.body.email.trim(),
              totalMerits: 0
            };
            // Alumni
            if (req.body.year === 'Alumni') {
              userInfo.status = 'alumni';
              userRef.update(userInfo);
            }
            else {
              const storage = firebase.storage().ref(`${displayName}.jpg`);
              // Pledge
              if (req.body.code === req.body.pledgeCode) {
                userInfo.status = 'pledge';
              }
              // Active
              else {
                userInfo.status = 'active';
              }
              // Sets user photo here
              // Checks first if the .jpg file is in firebase storage
              storage.getDownloadURL()
              .then((url) => {
                userInfo.photoURL = url;
                userRef.set(userInfo);
              })
              .catch((error) => {
                // Checks if the .JPG file is in firebase storage
                const storage = firebase.storage().ref(`${displayName}.JPG`);
                storage.getDownloadURL()
                .then((url) => {
                  userInfo.photoURL = url;
                  userRef.set(userInfo);
                })
                .catch((error) => {
                  const defaultPhoto = 'https://cdn1.iconfinder.com/data/icons/ninja-things-1/720/ninja-background-512.png';
                  userInfo.photoURL = defaultPhoto
                  userRef.set(userInfo)
                });
              });
            }
            // Set merits
            usersRef.once('value', (users) => {
              // Pledge
              if (req.body.code === req.body.pledgeCode) {
                users.forEach((child) => {
                  if (child.val().status === 'alumni') {
                    child.ref.child('/Pledges/' + displayName).set({
                      merits: 200
                    });
                  }
                  else if (child.val().status === 'pipm') {
                    child.ref.child('/Pledges/' + displayName).set({
                      merits: 'Unlimited'
                    });
                  }
                  else if (child.val().status !== 'pledge') {
                    child.ref.child('/Pledges/' + displayName).set({
                      merits: 100
                    });
                  }
                });
              }
              // Alumni
              else if (req.body.year === 'Alumni') {
                users.forEach((child) => {
                  if (child.val().status === 'pledge') {
                    const pledgeName = child.key;

                    userRef.child('/Pledges/' + pledgeName).set({
                      merits: 200
                    });
                  }
                });
              }
              // Active
              else {
                users.forEach((child) => {
                  if (child.val().status === 'pledge') {
                    const pledgeName = child.key;

                    userRef.child('/Pledges/' + pledgeName).set({
                      merits: 100
                    });
                  }
                });
              }
            });

            user.sendEmailVerification()
            .then(function() {
              res.status(200).send('Verification email has been sent.');
            });
          })
          .catch(function(error) {
            // Handle errors here.
            const errorCode = error.code;
            const errorMessage = error.message;

            console.log(errorCode, errorMessage);
            res.status(400).send('Something went wrong on the server.');
          });
        }
      })
      .catch(function(error) {
        // Handle errors here.
        const errorCode = error.code;
        const errorMessage = error.message;

        console.log(errorCode, errorMessage);
        res.status(400).send('Email has already been taken.');
      });
    }
    else {
      res.status(400).send('This active is already signed up.');
    }
  })
}

// Forgot Password Route
exports.forgot_password = function(req, res) {
  firebase.auth().sendPasswordResetEmail(req.body.email).then(function() {
    res.status(200).send('Email to reset password has been sent.');
  }).catch(function(error) {
    console.log(error);

    res.status(400).send('This email is not registered.');
  });
};

// Log Out Route
exports.logout = function(req, res) {
  firebase.auth().signOut()
  .then(function() {
    res.sendStatus(200);
  })
  .catch(function(error) {
    console.log(error);
    res.status(400).send(error);
  });
};

// Get photo for data app
exports.get_photos = function(req, res) {
  const { data: namesMap } = req.query;
  let photoMap = new Map();

  namesMap.forEach((set) => {
    const parsedSet = JSON.parse(set);
    [...new Map(parsedSet[1])].forEach((entry) => {
      photoMap.set(entry[0], 0);
    });
  });

  const max = photoMap.size;
  photoMap.clear();
  
  namesMap.forEach((set) => {
    const parsedSet = JSON.parse(set);
    [...new Map(parsedSet[1])].forEach((entry) => {
      if (photoMap.get(entry[0]) === undefined) {
        const name = entry[0].replace(/ /g,'');;
        const userRef = admin.database().ref('/users/' + name);

        userRef.once('value', (user) => {
          photoMap.set(entry[0], user.val().photoURL);

          if (photoMap.size === max) {
            res.json([...photoMap]);
          }
        });
      }
    });
  });
};

// Get my data for data app
exports.get_my_data = function(req, res) {
  const { fullName } = req.query;
  const usersRef = admin.database().ref('/users');
  const chalkboardsRef = admin.database().ref('/chalkboards');

  usersRef.once('value', (users) => {
    let totalMeritInstances = 0;
    let meritInstances = 0;
    let demeritInstances = 0;
    let totalMeritAmount = 0;
    let meritAmount = 0;
    let demeritAmount = 0;

    users.forEach((user) => {
      if (user.val().status === 'pledge') {
        if (user.val().Merits) {
          let merits = Object.keys(user.val().Merits).map(function(key) {
            return user.val().Merits[key];
          });

          merits.forEach((merit) => {
            if (merit.name === fullName) {
              if (merit.amount > 0) {
                meritInstances += 1;
                meritAmount += merit.amount;
              }
              else {
                demeritInstances += 1;
                demeritAmount += merit.amount;
              }

              totalMeritInstances += 1;
              totalMeritAmount += merit.amount;
            }
          });
        }
      }
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
        ['Total Merit Amount', totalMeritAmount],
        ['Merit Amount', meritAmount],
        ['Demerit Amount', demeritAmount],
        ['Chalkboards Created', chalkboardsCreated],
        ['Chalkboards Attended', chalkboardsAttended],
      ]);
    });
  });
};

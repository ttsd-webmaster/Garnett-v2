const admin = require('firebase-admin');
const firebase = require('@firebase/app').firebase;
const urlExists = require('url-exists');
require('@firebase/auth');

// Retrieving Authentication Status Route
exports.get_auth_status = function(req, res) {
  // Send back user's info to the client
  const { displayName } = req.query;
  const userRef = admin.database().ref(`/users/${displayName}`);
  console.log(displayName);

  userRef.once('value', (user) => {
    res.json(user.val());
  });
};

// Query for brothers data
exports.get_brothers = function(req, res) {
  const usersRef = admin.database().ref('/users');
  const brothersArray = [];

  usersRef.once('value', (users) => {
    users.forEach((user) => {
      if (user.val().status !== 'pledge') {
        brothersArray.push(user.val());
      }
    });

    brothersArray.sort((a, b) => {
      return a.lastName > b.lastName ? 1 : -1;
    });

    res.json(brothersArray);
  });
};

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

// Query for the specified pledge's complaints
exports.get_pledge_complaints = function(req, res) {
  const { pledgeName } = req.query;
  const complaintsRef = admin.database().ref(`/users/${pledgeName}/Complaints`);
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
  const {
    firstName,
    lastName,
    email,
    password,
    className,
    major,
    year,
    phone,
    code
  } = req.body;
  const activeCode = process.env.ACTIVE_AUTHORIZATION_CODE;
  const pledgeCode = process.env.PLEDGE_AUTHORIZATION_CODE;

  if (code !== activeCode && code !== pledgeCode) {
    return res.status(401).send('The authorization code is incorrect.');
  }

  const displayName = firstName + lastName;
  const usersRef = admin.database().ref('/users');
  const userRef = usersRef.child(displayName);

  userRef.once('value', (snapshot) => {
    if (snapshot.val() && year !== 'Alumni') {
      return res.status(400).send('This active is already signed up.');
    } else if (!snapshot.val() && year === 'Alumni') {
      return res.status(400).send('This alumni does not exist.');
    }
    // Create user with email and password
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((user) => {
      if (user && !user.emailVerified) {
        user.updateProfile({ displayName })
        .then(function() {
          const userInfo = {
            firstName,
            lastName,
            class: className,
            major,
            year,
            phone,
            email
          };
          // Alumni
          if (year === 'Alumni') {
            userInfo.status = 'alumni';
            userRef.update(userInfo);
          } else {
            const bucket = admin.storage().bucket();
            const file = bucket.file(`${displayName}.jpg`);
            // Set the status of the user based on the authorization code
            if (code === pledgeCode) {
              userInfo.status = 'pledge';
            } else {
              userInfo.status = 'active';
            }
            // Sets user photo here
            // Checks first if the .jpg file is in firebase storage
            file.getSignedUrl({ action: 'read', expires: '03-09-2491' })
            .then((jpgUrls) => {
              const jpgPhoto = jpgUrls[0];
              urlExists(jpgPhoto, function(err, exists) {
                if (exists) {
                  userInfo.photoURL = jpgPhoto;
                  userRef.set(userInfo);
                } else {
                  // Checks if the .JPG file is in firebase storage
                  const file = bucket.file(`${displayName}.JPG`);
                  file.getSignedUrl({ action: 'read', expires: '03-09-2491' })
                  .then((signedUrls) => {
                    const JPGPhoto = JPGUrls[0];
                    urlExists(JPGPhoto, function(err, exists) {
                      if (exists) {
                        userInfo.photoURL = JPGPhoto;
                        userRef.set(userInfo);
                      } else {
                        const defaultPhoto = 'https://cdn1.iconfinder.com/data/icons/ninja-things-1/720/ninja-background-512.png';
                        userInfo.photoURL = defaultPhoto;
                        userRef.set(userInfo);
                      }
                    });
                  })
                  .catch((err) => console.error(err));
                }
              });
            })
            .catch((err) => console.error(err));
          }

          // Set merits
          usersRef.once('value', (users) => {
            // Set merit counts based on the user's status
            if (code === pledgeCode) {
              users.forEach((child) => {
                switch (child.val().status) {
                  case 'alumni':
                    child.ref.child(`/Pledges/${displayName}`).set({
                      merits: 200
                    });
                    break;
                  case 'pipm':
                    child.ref.child(`/Pledges/${displayName}`).set({
                      merits: 'Unlimited'
                    });
                    break
                  case 'pledge':
                    // don't give pledges a merit count for pledges
                    break
                  default:
                    child.ref.child(`/Pledges/${displayName}`).set({
                      merits: 100
                    });
                }
              });
            } else if (year === 'Alumni') {
              users.forEach((child) => {
                if (child.val().status === 'pledge') {
                  const pledgeName = child.key;
                  userRef.child(`/Pledges/${pledgeName}`).set({
                    merits: 200
                  });
                }
              });
            } else {
              users.forEach((child) => {
                if (child.val().status === 'pledge') {
                  const pledgeName = child.key;
                  userRef.child(`/Pledges/${pledgeName}`).set({
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
        const name = entry[0].replace(/ /g,'');
        const userRef = admin.database().ref(`/users/${name}`);

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

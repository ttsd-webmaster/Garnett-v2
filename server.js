const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const path = require('path');
const compression = require('compression');
const app = express();
const equal = require('deep-equal');
const firebase = require('@firebase/app').firebase;
require('@firebase/auth');
require('@firebase/messaging');
const admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");
var port = process.env.PORT || 4000;
global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

require('dotenv').config();

// Firebase Config
firebase.initializeApp({
  apiKey: "AIzaSyAR48vz5fVRMkPE4R3jS-eI8JRnqEVlBNc",
  authDomain: "garnett-42475.firebaseapp.com",
  databaseURL: "https://garnett-42475.firebaseio.com",
  projectId: "garnett-42475",
  storageBucket: "garnett-42475.appspot.com",
  messagingSenderId: "741733387760"
})

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://garnett-42475.firebaseio.com",
  projectId: "garnett-42475"
})

// Redirect all HTTP traffic to HTTPS
function ensureSecure(req, res, next){
  if (req.headers["x-forwarded-proto"] === "https") {
    // OK, continue
    return next();
  };
  res.redirect('https://'+ req.hostname + req.url);
};

// Handle environments
if (process.env.NODE_ENV == 'production') {
  app.all('*', ensureSecure);
}

app.use(express.static(path.join(__dirname, './client/build')));
app.use(compression()); // Gzips file
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './client/build/index.html'));
});

// Retrieving Authentication Status Route
app.post('/api', function(req, res) {
  // Send back user's info to the client
  let fullName = req.body.user.displayName;
  let userRef = admin.database().ref('/users/' + fullName);
  console.log(fullName)

  userRef.once('value', (snapshot) => {
    let user = snapshot.val();
    res.json(user);
  });
});

// Get Firebase Data Route
app.post('/api/getfirebasedata', function(req, res) {
  const firebaseData = {
    apiKey: 'AIzaSyAR48vz5fVRMkPE4R3jS-eI8JRnqEVlBNc',
    authDomain: 'garnett-42475.firebaseapp.com',
    databaseURL: 'https://garnett-42475.firebaseio.com',
    storageBucket: 'garnett-42475.appspot.com',
    messagingSenderId: '741733387760'
  }

  res.json(firebaseData);
});

// Signup Route
app.post('/api/signup', function(req, res) {
  let usersRef = admin.database().ref('/users');
  let firstName = req.body.firstName.replace(/ /g,'');
  let lastName = req.body.lastName.replace(/ /g,'');
  firstName = firstName[0].toUpperCase() + firstName.substr(1);
  lastName = lastName[0].toUpperCase() + lastName.substr(1);
  let fullName = firstName + lastName;
  let checkRef = admin.database().ref('/users/' + fullName);

  checkRef.once('value', (snapshot) => {
    if (req.body.year === 'Alumni') {
      if (snapshot.val()) {
        // Create user with email and password
        firebase.auth().createUserWithEmailAndPassword(req.body.email, req.body.password)
        .then((user) => {
          if (user && !user.emailVerified) {
            user.updateProfile({
              displayName: fullName
            })
            .then(function() {
              let userRef = usersRef.child(user.displayName);

              userRef.update({
                firstName: req.body.firstName.trim(),
                lastName: req.body.lastName.trim(),
                class: req.body.className,
                major: req.body.majorName,
                year: req.body.year,
                phone: req.body.phone,
                email: req.body.email.trim(),
                status: 'alumni'
              });

              usersRef.once('value', (snapshot) => {
                snapshot.forEach((child) => {
                  if (child.val().status === 'pledge') {
                    let pledgeName = child.key;

                    userRef.child('/Pledges/' + pledgeName).set({
                      merits: 200
                    });
                  }
                });
              });

              user.sendEmailVerification()
              .then(function() {
                res.status(200).send('Verification email has been sent.');
              });
            })
            .catch(function(error) {
              // Handle errors here.
              let errorCode = error.code;
              let errorMessage = error.message;

              console.log(errorCode, errorMessage);
              res.status(400).send('Something went wrong on the server.');
            });
          }
        })
        .catch(function(error) {
          // Handle errors here.
          let errorCode = error.code;
          let errorMessage = error.message;

          console.log(errorCode, errorMessage);
          res.status(400).send('Email has already been taken.');
        });
      }
      else {
        res.status(400).send('Please check if the name is correct.');
      }
    }
    else {
      if (snapshot.val()) {
        res.status(400).send('This active is already signed up.');
      }
      else {
        // Create user with email and password
        firebase.auth().createUserWithEmailAndPassword(req.body.email, req.body.password)
        .then((user) => {
          if (user && !user.emailVerified) {
            user.updateProfile({
              displayName: fullName
            })
            .then(function() {
              let userRef = usersRef.child(user.displayName);

              userRef.set({
                firstName: req.body.firstName.trim(),
                lastName: req.body.lastName.trim(),
                class: req.body.className,
                major: req.body.majorName,
                year: req.body.year,
                phone: req.body.phone,
                email: req.body.email.trim(),
                photoURL: 'https://cdn1.iconfinder.com/data/icons/ninja-things-1/720/ninja-background-512.png',
              });

              if (req.body.code === req.body.pledgeCode) {
                userRef.update({
                  status: 'pledge',
                  totalMerits: 0
                });

                usersRef.once('value', (snapshot) => {
                  snapshot.forEach((child) => {
                    let pledgeName = user.displayName;
                    
                    if (child.val().status === 'alumni') {
                      child.ref.child('/Pledges/' + pledgeName).set({
                        merits: 200
                      });
                    }
                    else if (child.val().status === 'pipm') {
                      child.ref.child('/Pledges/' + pledgeName).set({
                        merits: 'Unlimited'
                      });
                    }
                    else if (child.val().status !== 'pledge') {
                      child.ref.child('/Pledges/' + pledgeName).set({
                        merits: 100
                      });
                    }
                  });
                });
              }
              else {
                userRef.update({
                  status: 'active'
                });

                usersRef.once('value', (snapshot) => {
                  snapshot.forEach((child) => {
                    if (child.val().status === 'pledge') {
                      let pledgeName = child.key;

                      userRef.child('/Pledges/' + pledgeName).set({
                        merits: 100
                      });
                    }
                  });
                });
              }

              user.sendEmailVerification()
              .then(function() {
                res.status(200).send('Verification email has been sent.');
              });
            })
            .catch(function(error) {
              // Handle errors here.
              let errorCode = error.code;
              let errorMessage = error.message;

              console.log(errorCode, errorMessage);
              res.status(400).send('Something went wrong on the server.');
            });
          }
        })
        .catch(function(error) {
          // Handle errors here.
          let errorCode = error.code;
          let errorMessage = error.message;

          console.log(errorCode, errorMessage);
          res.status(400).send('Email has already been taken.');
        });
      }
    }
  });
});

// Forgot Password Route
app.post('/api/forgotpassword', function(req, res) {
  firebase.auth().sendPasswordResetEmail(req.body.email).then(function() {
    res.status(200).send('Email to reset password has been sent.');
  }).catch(function(error) {
    console.log(error);

    res.status(400).send('This email is not registered.');
  });
});

// Log Out Route
app.post('/api/logout', function(req, res) {
  firebase.auth().signOut()
  .then(function() {
    res.sendStatus(200);
  })
  .catch(function(error) {
    console.log(error);
    res.status(400).send(error);
  });
});

// Sets the user photo
app.post('/api/setphoto', function(req, res) {
  let fullName = req.body.displayName;
  let userRef = admin.database().ref('/users/' + fullName);

  userRef.update({
    photoURL: req.body.url
  });

  // Sends back new user data with updated photo
  userRef.once('value', (snapshot) => {
    const user = snapshot.val();

    res.json(user);
  });
});

// Query for pledges data
app.post('/api/pledges', function(req, res) {
  let usersRef = admin.database().ref('/users');
  let pledgeArray = [];

  usersRef.once('value', (snapshot) => {
    snapshot.forEach((child) => {
      if (child.val().status === 'pledge') {
        pledgeArray.push(child.val());
      }
    });

    pledgeArray.sort((a, b) => {
      return a.lastName > b.lastName ? 1 : -1;
    });

    console.log("Pledge array: ", pledgeArray);
    res.json(pledgeArray);
  });
});

// Query for active data
app.post('/api/actives', function(req, res) {
  let usersRef = admin.database().ref('/users');
  let activeArray = [];

  usersRef.once('value', (snapshot) => {
    snapshot.forEach((child) => {
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
});

// Query for merit data on Pledge App
app.post('/api/pledgedata', function(req, res) {
  let fullName = req.body.displayName;
  let userRef = admin.database().ref('/users/' + fullName);
  let meritRef = userRef.child('/Merits');
  let complaintsRef = userRef.child('/Complaints');
  let totalMerits;
  let meritArray = [];
  let complaintsArray = [];

  userRef.once('value', (snapshot) => {
    totalMerits = snapshot.val().totalMerits;

    meritRef.once('value', (snapshot) => {
      if (snapshot.val()) {
        meritArray = Object.keys(snapshot.val()).map(function(key) {
          return snapshot.val()[key];
        });
      }

      complaintsRef.once('value', (snapshot) => {
        if (snapshot.val()) {
          complaintsArray = Object.keys(snapshot.val()).map(function(key) {
            return snapshot.val()[key];
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
    });
  });
});

// Query for the specified pledge's merits
app.post('/api/pledgemerits', function(req, res) {
  let pledgeName = req.body.pledgeName;
  let meritsRef = admin.database().ref('/users/' + pledgeName + '/Merits');
  let merits = [];

  meritsRef.once('value', (snapshot) => {
    if (snapshot.val()) {
      merits = Object.keys(snapshot.val()).map(function(key) {
        return snapshot.val()[key];
      });
    }

    res.json(merits.reverse());
  });
});

// Query for the specified pledge's complaints
app.post('/api/pledgecomplaints', function(req, res) {
  let pledgeName = req.body.pledgeName;
  let complaintsRef = admin.database().ref('/users/' + pledgeName + '/Complaints');
  let complaints = [];

  complaintsRef.once('value', (snapshot) => {
    if (snapshot.val()) {
      complaints = Object.keys(snapshot.val()).map(function(key) {
        return snapshot.val()[key];
      }).sort((a, b) => {
        return a.date < b.date ? 1 : -1;
      });
    }

    res.json(complaints);
  });
});

// Post merit data as active
app.post('/api/merit', function(req, res) {
  let counter = 0;
  let pledges = req.body.pledges;

  pledges.forEach((pledge) => {
    let fullName = req.body.displayName;
    let userRef = admin.database().ref('/users/' + fullName + '/Pledges/' + pledge.value);
    let pledgeRef = admin.database().ref('/users/' + pledge.value);
    let meritRef = pledgeRef.child('/Merits');

    userRef.once('value', (pledge) => {
      if (req.body.status !== 'pipm' && !req.body.isChalkboard) {
        if (req.body.amount > 0 && 
            pledge.val().merits - req.body.amount < 0 && 
            !res.headersSent) {
          res.sendStatus(400).send(pledge.label);
        }
        else {
          userRef.update({
            merits: pledge.val().merits - req.body.amount
          });
        }
      }

      pledgeRef.once('value', (snapshot) => {
        counter++;

        pledgeRef.update({
          totalMerits: snapshot.val().totalMerits + req.body.amount
        });

        meritRef.push({
          name: req.body.activeName,
          description: req.body.description,
          amount: req.body.amount,
          photoURL: req.body.photoURL,
          date: req.body.date
        });

        if (!res.headersSent && counter === pledges.length) {
          res.sendStatus(200);
        }
      });
    });
  })
});

// Post merit data as pledge
app.post('/api/meritAsPledge', function(req, res) {
  let counter = 0;
  let actives = req.body.actives;
  let fullName = req.body.displayName;
  let userRef = admin.database().ref('/users/' + fullName);
  let meritRef = userRef.child('/Merits');

  actives.forEach((child) => {
    let activeRef = admin.database().ref('/users/' + child.value);

    activeRef.once('value', (active) => {
      let activePledgeRef = active.ref.child('/Pledges/' + fullName);

      activePledgeRef.once('value', (pledge) => {
        if (active.val().status !== 'pipm' && !req.body.isChalkboard) {
          if (req.body.amount > 0 && 
              pledge.val().merits - req.body.amount < 0 && 
              !res.headersSent) {
            res.sendStatus(400).send(child.label);
          }
          else {
            activePledgeRef.update({
              merits: pledge.val().merits - req.body.amount
            });
          }
        }

        userRef.once('value', (snapshot) => {
          counter++;

          meritRef.push({
            name: `${active.val().firstName} ${active.val().lastName}`,
            description: req.body.description,
            amount: req.body.amount,
            photoURL: active.val().photoURL,
            date: req.body.date
          });

          if (!res.headersSent && counter === actives.length) {
            userRef.update({
              totalMerits: snapshot.val().totalMerits + (req.body.amount * actives.length)
            });
            
            res.sendStatus(200);
          }
        });
      });
    });
  })
});

// Removes merit as pledge
app.post('/api/removeMeritAsPledge', function(req, res) {
  let pledgeName = req.body.displayName;
  let activeName = req.body.merit.name.replace(/ /g,'');
  let pledgeRef = admin.database().ref('/users/' + pledgeName);
  let activeRef = admin.database().ref('/users/' + activeName + '/Pledges/' + pledgeName);

  pledgeRef.once('value', (snapshot) => {
    pledgeRef.update({
      totalMerits: snapshot.val().totalMerits - req.body.merit.amount
    });

    pledgeRef.child('Merits').once('value', (merits) => {
      merits.forEach((merit) => {
        if (equal(req.body.merit, merit.val())) {
          merit.ref.remove(() => {
            activeRef.once('value', (pledgeMerits) => {
              if (req.body.merit.description.lastIndexOf('Chalkboard:', 0) !== 0) {
                activeRef.update({
                  merits: pledgeMerits.val().merits + req.body.merit.amount
                });
              }

              res.sendStatus(200);
            });
          });
        }
      })
    });
  });
});

// Get merits remaining for pledge
app.post('/api/meritsRemaining', function(req, res) {
  let displayName = req.body.displayName;
  let pledgeName = req.body.pledgeName;
  let pledgeRef = admin.database().ref('/users/' + displayName + '/Pledges/' + pledgeName);

  pledgeRef.once('value', (snapshot) => {
    res.json(snapshot.val().merits);
  });
});

// Gets all the pledges for meriting as active
app.post('/api/pledgesForMerit', function(req, res) {
  let displayName = req.body.displayName;
  let pledgesRef = admin.database().ref('/users/' + displayName + '/Pledges');

  pledgesRef.once('value', (snapshot) => {
    let pledgeArray = [];

    if (snapshot.val()) {
      pledgeArray = Object.keys(snapshot.val()).map(function(key) {
        return {'value': key,
                'label': key.replace(/([a-z])([A-Z])/, '$1 $2'),
                'meritsRemaining': snapshot.val()[key].merits
               };
      });
    }

    res.json(pledgeArray);
  });
});

// Gets all the actives for meriting as pledge
app.post('/api/activesForMerit', function(req, res) {
  let counter = 0;
  let activeCount = 44;
  let displayName = req.body.displayName;
  let usersRef = admin.database().ref('/users');

  usersRef.once('value', (snapshot) => {
    let activeArray = [];

    snapshot.forEach((active) => {
      if (active.val().status !== 'alumni' &&
          active.val().status !== 'pledge' &&
          active.val().status !== 'pipm') {
        let activeRef = admin.database().ref('/users/' + active.key + '/Pledges/' + displayName);

        activeRef.once('value', (user) => {
          counter++;

          activeArray.push({
            'value': active.key,
            'label': active.key.replace(/([a-z])([A-Z])/, '$1 $2'),
            'meritsRemaining': user.val().merits
          });

          if (!res.headersSent && counter === activeCount) {
            res.json(activeArray);
          }
        });
      }
    });
  });
});

// Gets all the chalkboards for merit
app.post('/api/chalkboardsForMerit', function(req, res) {
  let fullName = req.body.fullName;
  let chalkboardsRef = admin.database().ref('/chalkboards');

  chalkboardsRef.once('value', (snapshot) => {
    let myChalkboards = [];
    let chalkboards = Object.keys(snapshot.val()).map(function(key) {
      return snapshot.val()[key];
    });

    chalkboards.forEach((chalkboard) => {
      if (chalkboard.activeName === fullName) {
        myChalkboards.push(chalkboard);
      }
      else {
        if (chalkboard.attendees) {
          let attendees = Object.keys(chalkboard.attendees).map(function(key) {
            return chalkboard.attendees[key];
          });

          attendees.forEach((attendee) => {
            if (attendee.name === fullName) {
              myChalkboards.push(chalkboard);
            }
          });
        }
      }
    });
    
    res.json(myChalkboards);
  });
});

// Creates a chalkboard
app.post('/api/createchalkboard', function(req, res) {
  let chalkboardInfo = {
    displayName: req.body.displayName,
    activeName: req.body.activeName,
    photoURL: req.body.photoURL,
    title: req.body.title,
    description: req.body.description,
    date: req.body.date,
    time: req.body.time,
    location: req.body.location,
    timeCommitment: req.body.timeCommitment,
    amount: req.body.amount
  };
  let fullName = req.body.displayName;
  let chalkboardsRef = admin.database().ref('/chalkboards');
  let counter = 0;

  // Adds chalkboards to general chalkboards and user's chalkboards
  chalkboardsRef.once('value', (snapshot) => {
    if (snapshot.val()) {
      snapshot.forEach((chalkboard) => {
        counter++;

        if (req.body.title === chalkboard.val().title) {
          res.sendStatus(400);
        }
        else {
          if (!res.headersSent && counter === snapshot.numChildren()) {
            chalkboardsRef.push(chalkboardInfo);

            res.sendStatus(200);
          }
        }
      });
    }
    else {
      chalkboardsRef.push(chalkboardInfo);

      res.sendStatus(200);
    }
  });
});

// Edits chalkboard for desktop
app.post('/api/editchalkboard', function(req, res) {
  let fullName = req.body.displayName;
  let chalkboardsRef = admin.database().ref('/chalkboards');

  chalkboardsRef.once('value', (snapshot) => {
    snapshot.forEach((chalkboard) => {
      // Looks for the chalkboard in the chalkboards ref
      if (req.body.chalkboard.title === chalkboard.val().title) {
        // Updates the chalkboard
        chalkboard.ref.update({
          description: req.body.description,
          date: req.body.date,
          time: req.body.time,
          location: req.body.location,
          timeCommitment: req.body.timeCommitment,
          amount: req.body.amount
        });

        res.sendStatus(200);
      }
    });
  });
});

// Edits chalkboard for mobile devices
app.post('/api/editchalkboardmobile', function(req, res) {
  let editedField = req.body.field.toLowerCase();
  let fullName = req.body.displayName;
  let chalkboardsRef = admin.database().ref('/chalkboards');

  chalkboardsRef.once('value', (snapshot) => {
    snapshot.forEach((chalkboard) => {
      // Looks for the chalkboard in the chalkboards ref
      if (req.body.chalkboard.title === chalkboard.val().title) {
        // Updates the chalkboard
        chalkboard.ref.update({
          [editedField]: req.body.value
        });

        res.sendStatus(200);
      }
    });
  });
});

// Joins chalkboard as an attendee
app.post('/api/joinchalkboard', function(req, res) {
  let chalkboardsRef = admin.database().ref('/chalkboards');

  chalkboardsRef.once('value', (snapshot) => {
    snapshot.forEach((chalkboard) => {
      // Looks for the chalkboard in the chalkboards ref
      if (req.body.chalkboard.title === chalkboard.val().title) {
        // Adds the user to the Attendees ref
        chalkboard.ref.child('attendees').push({
          name: req.body.name,
          photoURL: req.body.photoURL
        });
        
        res.sendStatus(200);
      }
    });
  });
});

// Removes chalkboard from both user's list and general list
app.post('/api/removechalkboard', function(req, res) {
  let fullName = req.body.displayName;
  let chalkboardsRef = admin.database().ref('/chalkboards');

  chalkboardsRef.once('value', (snapshot) => {
    snapshot.forEach((chalkboard) => {
      // Removes chalkboard in the chalkboards ref
      if (req.body.chalkboard.title === chalkboard.val().title) {
        chalkboard.ref.remove(() => {
          res.sendStatus(200);
        });
      }
    });
  });
});

// Leaves chalkboard as an attendee
app.post('/api/leavechalkboard', function(req, res) {
  let name = req.body.name;
  let chalkboardsRef = admin.database().ref('/chalkboards');

  chalkboardsRef.once('value', (snapshot) => {
    snapshot.forEach((chalkboard) => {
      // Looks for the chalkboard in the chalkboards ref
      if (req.body.chalkboard.title === chalkboard.val().title) {
        chalkboard.ref.child('attendees').once('value', (snapshot) => {
          snapshot.forEach((attendee) => {
            // Checks if the user is an attendee
            if (equal(name, attendee.val().name)) {
              // Removes user from the Attendees list
              attendee.ref.remove(() => {
                res.sendStatus(200);
              });
            }
          });
        });
      }
    });
  });
});

// Gets the chalkboard information
app.post('/api/getchalkboardinfo', function(req, res) {
  let chalkboardsRef = admin.database().ref('/chalkboards');

  // Searches for the chalkboard by checking title
  chalkboardsRef.once('value', (snapshot) => {
    snapshot.forEach((chalkboard) => {
      if (req.body.title === chalkboard.val().title) {
        res.json({
          chalkboard: chalkboard.val()
        });
      }
    });
  });
});

// Retrieves all the attendees of the chalkboard
app.post('/api/getattendees', function(req, res) {
  let attendeesArray = [];
  let chalkboardsRef = admin.database().ref('/chalkboards');

  chalkboardsRef.once('value', (snapshot) => {
    snapshot.forEach((chalkboard) => {
      // Looks for the chalkboard in the chalkboards ref
      if (req.body.chalkboard.title === chalkboard.val().title) {
        chalkboard.ref.child('attendees').once('value', (snapshot) => {
          // Finds the attendees if there are any
          if (snapshot.val()) {
            attendeesArray = Object.keys(snapshot.val()).map(function(key) {
              return snapshot.val()[key];
            });
          }

          res.json(attendeesArray);
        });
      }
    });
  });
});

// Post complaint data
app.post('/api/complain', function(req, res) {
  // Check if active is PI/PM or not
  if (req.body.status === 'active') {
    let complaintsRef = admin.database().ref('/pendingComplaints');

    // Add complaints to active's pending complaints list and the pending complaints list
    complaintsRef.push(req.body.complaint);
  }
  else {
    let pledgeName = req.body.complaint.pledgeDisplayName;
    let complaintsRef = admin.database().ref('/approvedComplaints');
    let pledgeComplaintsRef = admin.database().ref('/users/' + pledgeName + '/Complaints');

    // Add complaints to the approved complaints list and the specified pledge's complaints list
    complaintsRef.push(req.body.complaint);

    pledgeComplaintsRef.push(req.body.complaint);
  }

  res.sendStatus(200);
});

// Removes complaint for active
app.post('/api/removecomplaint', function(req, res) {
  let pendingComplaintsRef = admin.database().ref('/pendingComplaints');

  pendingComplaintsRef.once('value', (snapshot) => {
    snapshot.forEach((complaint) => {
      // Removes complaint from the pending complaints list
      if (equal(req.body.complaint, complaint.val())) {
        complaint.ref.remove(() => {
          res.sendStatus(200);
        });
      }
    });
  });
});

// Approves complaint for PI/PM
app.post('/api/approvecomplaint', function(req, res) {
  let pledgeName = req.body.complaint.pledgeDisplayName;
  let pledgeComplaintsRef = admin.database().ref('/users/' + pledgeName + '/Complaints');
  let approvedComplaintsRef = admin.database().ref('/approvedComplaints');
  let pendingComplaintsRef = admin.database().ref('/pendingComplaints');

  pendingComplaintsRef.once('value', (snapshot) => {
    snapshot.forEach((complaint) => {
      // Removes complaint from the pending complaints list
      if (equal(req.body.complaint, complaint.val())) {
        complaint.ref.remove(() => {
          // Adds complaint to the approved complaints list
          approvedComplaintsRef.push(req.body.complaint);
          // Adds complaint to the pledge's complaints list
          pledgeComplaintsRef.push(req.body.complaint);

          res.sendStatus(200);
        });
      }
    });
  });
});

// Gets all the pledges for complaints
app.post('/api/pledgesForComplaints', function(req, res) {
  let usersRef = admin.database().ref('/users');

  // Loop through all users for pledges
  usersRef.once('value', (snapshot) => {
    let pledgeArray = [];

    if (snapshot.val()) {
      snapshot.forEach((child) => {
        if (child.val().status === 'pledge') {
          pledgeArray.push(child.val());
        }
      });

      // Save the value, label, and photoURL for each pledge
      pledgeArray = pledgeArray.map(function(pledge) {
        return {'value': pledge.firstName + pledge.lastName, 
                'label': `${pledge.firstName} ${pledge.lastName}`,
                'photoURL': pledge.photoURL
               };
      });
    }

    res.json(pledgeArray);
  });
});

// Save message token from server
app.post('/api/savemessagetoken', function(req, res) {
  let fullName = req.body.displayName;
  let userRef = admin.database().ref('/users/' + fullName);

  userRef.update({
    registrationToken: req.body.token
  });

  res.sendStatus(200);
});

// Send active merit notification to pledges
app.post('/api/sendActiveMeritNotification', function(req, res) {
  let pledges = req.body.pledges;
  let merits = '';
  let counter = 0;

  if (req.body.amount > 0) {
    merits = 'merits';
  }
  else {
    merits = 'demerits';
  }

  pledges.forEach((pledge) => {
    let pledgeRef = admin.database().ref('/users/' + pledge.value);

    pledgeRef.once('value', (snapshot) => {
      let registrationToken = snapshot.val().registrationToken;
      let amount = Math.abs(req.body.amount);
      counter++;

      let message = {
        webpush: {
          notification: {
            title: 'Garnett',
            body: `You have received ${amount} ${merits} from ${pledge.label}`,
            click_action: 'https://garnett-app.herokuapp.com/pledge-app',
            icon: 'https://farm5.staticflickr.com/4555/24846365458_2fa6bb5179.jpg',
            vibrate: [500,110,500,110,450,110,200,110,170,40,450,110,200,110,170,40,500]
          }
        },
        token: registrationToken
      };

      if (registrationToken) {
        admin.messaging().send(message)
        .then(function(response) {
          console.log("Successfully sent message:", response);

          if (!res.headersSent && counter === pledges.length) {
            res.sendStatus(200);
          }
        })
        .catch(function(error) {
          console.log("Error sending message:", error);

          if (!res.headersSent && counter === pledges.length) {
            res.sendStatus(400);
          }
        });
      }
      else {
        if (!res.headersSent && counter === pledges.length) {
          res.sendStatus(200);
        }
      }
    })
  });
});

// Send pledge merit notification to actives
app.post('/api/sendPledgeMeritNotification', function(req, res) {
  let actives = req.body.actives;
  let merits = '';
  let counter = 0;

  if (req.body.amount > 0) {
    merits = 'merits';
  }
  else {
    merits = 'demerits';
  }

  actives.forEach((active) => {
    let activeRef = admin.database().ref('/users/' + active.value);

    activeRef.once('value', (snapshot) => {
      let registrationToken = snapshot.val().registrationToken;
      let amount = Math.abs(req.body.amount);
      counter++;

      let message = {
        webpush: {
          notification: {
            title: 'Garnett',
            body: `You have given ${amount} ${merits} to ${req.body.pledgeName}`,
            click_action: 'https://garnett-app.herokuapp.com/pledge-app',
            icon: 'https://farm5.staticflickr.com/4555/24846365458_2fa6bb5179.jpg',
            vibrate: [500,110,500,110,450,110,200,110,170,40,450,110,200,110,170,40,500]
          }
        },
        token: registrationToken
      };

      if (registrationToken) {
        admin.messaging().send(message)
        .then(function(response) {
          console.log("Successfully sent message:", response);

          if (!res.headersSent && counter === actives.length) {
            res.sendStatus(200);
          }
        })
        .catch(function(error) {
          console.log("Error sending message:", error);

          if (!res.headersSent && counter === actives.length) {
            res.sendStatus(400);
          }
        });
      }
      else {
        if (!res.headersSent && counter === actives.length) {
          res.sendStatus(200);
        }
      }
    })
  });
});

// Send created chalkboard notification to pledges
app.post('/api/sendCreatedChalkboardNotification', function(req, res) {
  let usersRef = admin.database().ref('/users');
  let counter = 0;

  usersRef.once('value', (snapshot) => {
    snapshot.forEach((user) => {
      if (user.val().status !== 'alumni') {
        let pledgeRef = admin.database().ref('/users/' + user.key);

        pledgeRef.once('value', (snapshot) => {
          let registrationToken = snapshot.val().registrationToken;
          counter++;

          let message = {
            webpush: {
              notification: {
                title: 'Garnett',
                body: `New Chalkboard: ${req.body.chalkboardTitle}`,
                click_action: 'https://garnett-app.herokuapp.com/pledge-app',
                icon: 'https://farm5.staticflickr.com/4555/24846365458_2fa6bb5179.jpg',
                vibrate: [500,110,500,110,450,110,200,110,170,40,450,110,200,110,170,40,500]
              }
            },
            token: registrationToken
          };

          if (registrationToken) {
            admin.messaging().send(message)
            .then(function(response) {
              console.log("Successfully sent message:", response);
              if (!res.headersSent) {
                res.sendStatus(200);
              }
            })
            .catch(function(error) {
              console.log("Error sending message:", error);
              if (!res.headersSent) {
                res.sendStatus(400);
              }
            });
          }
          else {
            if (!res.headersSent) {
              res.sendStatus(200);
            }
          }
        });
      }
    });
  });
});

// Send joined chalkboard notification to active
app.post('/api/sendJoinedChalkboardNotification', function(req, res) {
  let chalkboard = req.body.chalkboard;
  let activeName = chalkboard.displayName;
  let name = req.body.name;
  let chalkboardsRef = admin.database().ref('/chalkboards');
  let activeRef = admin.database().ref('/users/' + activeName);

  activeRef.once('value', (snapshot) => {
    let registrationToken = snapshot.val().registrationToken;
    let message = {
      webpush: {
        notification: {
          title: 'Garnett',
          body: `${name} has joined your chalkboard, ${chalkboard.title}`,
          click_action: 'https://garnett-app.herokuapp.com/pledge-app',
          icon: 'https://farm5.staticflickr.com/4555/24846365458_2fa6bb5179.jpg',
          vibrate: [500,110,500,110,450,110,200,110,170,40,450,110,200,110,170,40,500]
        }
      },
      token: registrationToken
    };

    if (registrationToken) {
      admin.messaging().send(message)
      .then(function(response) {
        console.log("Successfully sent message:", response);
        if (!res.headersSent) {
          res.sendStatus(200);
        }
      })
      .catch(function(error) {
        console.log("Error sending message:", error);
        if (!res.headersSent) {
          res.sendStatus(400);
        }
      });
    }
    else {
      if (!res.headersSent) {
        res.sendStatus(200);
      }
    }
  });

  chalkboardsRef.once('value', (chalkboards) => {
    chalkboards.forEach((child) => {
      if (equal(chalkboard, child.val())) {
        child.ref.child('attendees').once('value', (attendees) => {
          attendees.forEach((attendee) => {
            let attendeeName = attendee.val().name.replace(/ /g,'');
            let attendeeRef = admin.database().ref('/users/' + attendeeName);

            attendeeRef.once('value', (snapshot) => {
              let registrationToken = snapshot.val().registrationToken;
              let message = {
                webpush: {
                  notification: {
                    title: 'Garnett',
                    body: `${name} has joined the chalkboard, ${chalkboard.title}`,
                    click_action: 'https://garnett-app.herokuapp.com/pledge-app',
                    icon: 'https://farm5.staticflickr.com/4555/24846365458_2fa6bb5179.jpg',
                    vibrate: [500,110,500,110,450,110,200,110,170,40,450,110,200,110,170,40,500]
                  }
                },
                token: registrationToken
              };

              if (registrationToken) {
                admin.messaging().send(message)
                .then(function(response) {
                  console.log("Successfully sent message:", response);
                  if (!res.headersSent) {
                    res.sendStatus(200);
                  }
                })
                .catch(function(error) {
                  console.log("Error sending message:", error);
                  if (!res.headersSent) {
                    res.sendStatus(400);
                  }
                });
              }
              else {
                if (!res.headersSent) {
                  res.sendStatus(200);
                }
              }
            });
          });
        });
      }
    });
  });
});

// Send left chalkboard notification to active
app.post('/api/sendLeftChalkboardNotification', function(req, res) {
  let chalkboard = req.body.chalkboard;
  let activeName = chalkboard.displayName;
  let name = req.body.name;
  let chalkboardsRef = admin.database().ref('/chalkboards');
  let activeRef = admin.database().ref('/users/' + activeName);

  activeRef.once('value', (snapshot) => {
    let registrationToken = snapshot.val().registrationToken;
    let message = {
      webpush: {
        notification: {
          title: 'Garnett',
          body: `${name} has left your chalkboard, ${chalkboard.title}`,
          click_action: 'https://garnett-app.herokuapp.com/pledge-app',
          icon: 'https://farm5.staticflickr.com/4555/24846365458_2fa6bb5179.jpg',
          vibrate: [500,110,500,110,450,110,200,110,170,40,450,110,200,110,170,40,500]
        }
      },
      token: registrationToken
    };

    if (registrationToken) {
      admin.messaging().send(message)
      .then(function(response) {
        console.log("Successfully sent message:", response);
        if (!res.headersSent) {
          res.sendStatus(200);
        }
      })
      .catch(function(error) {
        console.log("Error sending message:", error);
        if (!res.headersSent) {
          res.sendStatus(400);
        }
      });
    }
    else {
      if (!res.headersSent) {
        res.sendStatus(200);
      }
    }
  });

  chalkboardsRef.once('value', (chalkboards) => {
    chalkboards.forEach((child) => {
      if (equal(chalkboard, child.val())) {
        child.ref.child('attendees').once('value', (attendees) => {
          attendees.forEach((attendee) => {
            let attendeeName = attendee.val().name.replace(/ /g,'');
            let attendeeRef = admin.database().ref('/users/' + attendeeName);

            attendeeRef.once('value', (snapshot) => {
              let registrationToken = snapshot.val().registrationToken;
              let message = {
                webpush: {
                  notification: {
                    title: 'Garnett',
                    body: `${name} has left the chalkboard, ${chalkboard.title}`,
                    click_action: 'https://garnett-app.herokuapp.com/pledge-app',
                    icon: 'https://farm5.staticflickr.com/4555/24846365458_2fa6bb5179.jpg',
                    vibrate: [500,110,500,110,450,110,200,110,170,40,450,110,200,110,170,40,500]
                  }
                },
                token: registrationToken
              };

              if (registrationToken) {
                admin.messaging().send(message)
                .then(function(response) {
                  console.log("Successfully sent message:", response);
                  if (!res.headersSent) {
                    res.sendStatus(200);
                  }
                })
                .catch(function(error) {
                  console.log("Error sending message:", error);
                  if (!res.headersSent) {
                    res.sendStatus(400);
                  }
                });
              }
              else {
                if (!res.headersSent) {
                  res.sendStatus(200);
                }
              }
            });
          });
        });
      }
    });
  });
});

// Send complaint notification to pledge
app.post('/api/sendComplaintNotification', function(req, res) {
  let complaint = req.body.complaint;
  let pledgeRef = admin.database().ref('/users/' + complaint.pledgeDisplayName);

  pledgeRef.once('value', (snapshot) => {
    let registrationToken = snapshot.val().registrationToken;
    let message = {
      webpush: {
        notification: {
          title: 'Garnett',
          body: `You have received a complaint from ${complaint.activeName}`,
          click_action: 'https://garnett-app.herokuapp.com/pledge-app',
          icon: 'https://farm5.staticflickr.com/4555/24846365458_2fa6bb5179.jpg',
          vibrate: [500,110,500,110,450,110,200,110,170,40,450,110,200,110,170,40,500]
        }
      },
      token: registrationToken
    };

    if (registrationToken) {
      admin.messaging().send(message)
      .then(function(response) {
        console.log("Successfully sent message:", response);
        res.sendStatus(200);
      })
      .catch(function(error) {
        console.log("Error sending message:", error);
        res.sendStatus(400);
      });
    }
    else {
      res.sendStatus(200);
    }
  });
});

// Update interaction for rushee
app.post('/api/updateinteraction', function(req, res) {
  let totalInteractions = req.body.totalInteractions;
  let rusheeName = req.body.rusheeName;
  let displayName = req.body.displayName;
  let rusheeRef = admin.database().ref('/rushees/' + rusheeName);
  let activeRef = rusheeRef.child('Actives/' + displayName);

  if (!req.body.interacted == true) {
    totalInteractions++;
  }
  else {
    totalInteractions--;
  }

  rusheeRef.update({
    totalInteractions: totalInteractions
  });

  activeRef.update({
    interacted: !req.body.interacted
  });

  res.sendStatus(200);
});

// Start vote for rushee
app.post('/api/startvote', function(req, res) {
  let delibsRef = admin.database().ref('/delibsVoting');

  delibsRef.update({
    open: true,
    rushee: req.body.rusheeName
  });

  res.sendStatus(200);
});

// End vote for rushee
app.post('/api/endvote', function(req, res) {
  let delibsRef = admin.database().ref('/delibsVoting');

  delibsRef.update({
    open: false,
    rushee: false
  });

  res.sendStatus(200);
});

// Voting for rushee
app.post('/api/vote', function(req, res) {
  let rusheeName = req.body.rushee.replace(/ /g,'');
  let rusheeRef = admin.database().ref('/rushees/' + rusheeName);
  let fullName = req.body.displayName;
  let activeRef = admin.database().ref('/rushees/' + rusheeName + '/Actives/' + fullName);
  let vote;

  activeRef.once('value', (active) => {
    if (active.val().vote === 'yes') {
      if (req.body.vote === 'yes') {
        vote = 0;
      }
      else {
        vote = -1;
      }
    }
    else {
      if (req.body.vote === 'yes') {
        vote = 1;
      }
      else {
        vote = 0;
      } 
    }

    rusheeRef.once('value', (rushee) => {
      let votes = rushee.val().votes + vote;

      if (active.val().voted === false) {
        rusheeRef.update({
          totalVotes: rushee.val().totalVotes + 1
        });
      }

      rusheeRef.update({
        votes: votes
      });
      activeRef.update({
        vote: req.body.vote,
        voted: true
      });

      res.sendStatus(200);
    });
  });
});

app.listen(port, function () {
  console.log('Example app listening on port 4000!')
});

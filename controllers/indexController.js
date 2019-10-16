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

// Query for pledges data
exports.get_pledges = function(req, res) {
  const { displayName } = req.query;
  const usersRef = admin.database().ref('/users');
  const meritsRef = admin.database().ref('/merits');
  const pledgesMap = new Map();

  usersRef.orderByChild('status').equalTo('pledge').once('value', (pledges) => {
    if (!pledges.val()) {
      return res.status(400).send('No pledges found.');
    }
    const pledgesArray = Object.keys(pledges.val()).map(function(key) {
      if (key !== displayName) {
        pledgesMap.set(key, { merits: 0, interviews: 0 });
        return pledges.val()[key];
      }
    });

    meritsRef.once('value', (merits) => {
      // Map the pledge's total merits
      if (merits.val()) {
        merits.forEach((merit) => {
          const pledgeName = merit.val().pledgeName.replace(/ /g, '');
          const pledge = pledgesMap.get(pledgeName);
          pledge.merits += merit.val().amount;
          if (merit.val().type === 'interview') {
            pledge.interviews += 1;
          }
          pledgesMap.set(pledgeName, pledge);
        });
      }
      // Set all the pledge's total merits
      pledgesArray.forEach((pledge) => {
        const pledgeName = (pledge.firstName + pledge.lastName).replace(/ /g, '');
        const mappedPledge = pledgesMap.get(pledgeName);
        pledge.displayName = pledgeName;
        pledge.totalMerits = mappedPledge.merits;
        pledge.completedInterviews = mappedPledge.interviews;
      });

      res.json(pledgesArray);
    });
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

// Query for the user's interviews progress
exports.get_interviews_progress = function(req, res) {
  const { displayName, status } = req.query;
  const usersRef = admin.database().ref('/users');
  const meritsRef = admin.database().ref('/merits');
  const completedNames = [];
  const completed = [];
  const incomplete = [];

  meritsRef.orderByChild('type').equalTo('interview').once('value', (merits) => {
    merits.forEach((merit) => {
      const activeName = merit.val().activeName.replace(/ /g, '');
      const pledgeName = merit.val().pledgeName.replace(/ /g, '');
      let userCheck;
      let interviewCheck;

      if (status === 'pledge') {
        userCheck = pledgeName;
        interviewCheck = activeName;
      } else {
        userCheck = activeName;
        interviewCheck = pledgeName;
      }

      if (displayName === userCheck && !completedNames.includes(interviewCheck)) {
        completedNames.push(interviewCheck);
      }
    });

    usersRef.once('value', (users) => {
      users.forEach((user) => {
        if (status === 'pledge') {
          if (user.val().status !== 'alumni' && user.val().status !== 'pledge') {
            if (completedNames.includes(user.key)) {
              completed.push(user.val());
            } else {
              incomplete.push(user.val());
            }
          }
        } else {
          if (user.val().status === 'pledge') {
            if (completedNames.includes(user.key)) {
              completed.push(user.val());
            } else {
              incomplete.push(user.val());
            }
          }
        }
      });

      res.json({ completed, incomplete });
    });
  });
};

// Query for the pledge's completed interviews
exports.get_pledge_completed_interviews = function(req, res) {
  const { pledgeName } = req.query;
  const meritsRef = admin.database().ref('/merits');
  let interviews = [];

  meritsRef.orderByChild('type').equalTo('interview').once('value', (merits) => {
    merits.forEach((merit) => {
      const pledgeCheck = merit.val().pledgeName.replace(/ /g, '');
      if (pledgeName === pledgeCheck) {
        interviews.push(merit.val());
      }
    });

    interviews = interviews.sort((a, b) => b.date - a.date);

    res.json(interviews);
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
    if (code === activeCode) {
      if (snapshot.val() && year !== 'Alumni') {
        return res.status(400).send('This active is already signed up.');
      } else if (!snapshot.val() && year === 'Alumni') {
        return res.status(400).send('This alumni does not exist.');
      }
    } else if (code === pledgeCode) {
      if (!snapshot.val()) {
        return res.status(400).send('This pledge does not exist. Try a different name.');
      }
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

          userRef.update(userInfo);

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

const admin = require('firebase-admin');
const firebase = require('@firebase/app').firebase;
const urlExists = require('url-exists');
require('@firebase/auth');

// Query for the user's interviews progress
exports.get_interviews_progress = function(req, res) {
  const { fullName, status } = req.query;
  const usersRef = admin.database().ref('/users');
  const interviewsRef = admin.database().ref('/interviews');
  const meritsRef = admin.database().ref('/merits');
  const completedNames = [];
  const completed = [];
  const incomplete = [];
  const userRole = status === 'pledge' ? 'pledgeName' : 'activeName';
  const queryRole = status === 'pledge' ? 'activeName' : 'pledgeName';

  interviewsRef.orderByChild(userRole).equalTo(fullName).once('value', (interviews) => {
    interviews.forEach((interview) => {
      const completedName = interview.val()[queryRole].replace(/ /g, '');
      completedNames.push(completedName);
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
  const usersRef = admin.database().ref('/users');
  const interviewsRef = admin.database().ref('/interviews');
  const result = [];
  let activeNames = [];

  interviewsRef.orderByChild('pledgeName').equalTo(pledgeName).once('value', (interviews) => {
    if (interviews.exists()) {
      activeNames = Object.keys(interviews.val()).map(function(key) {
        return interviews.val()[key].activeName.replace(/ /g, '');;
      });

      usersRef.once('value', (users) => {
        users.forEach((user) => {
          if (user.val().status !== 'pledge') {
            if (activeNames.includes(user.key)) {
              result.push(user.val());
            }
          }
        });

        res.json(result);
      });
    } else {
      res.json(result);
    }
  });
};

exports.complete_interview = function(req, res) {
  const { activeName, pledgeName } = req.body;
  const interviewsRef = admin.database().ref('/interviews');
  let alreadyExists = false;

  interviewsRef.orderByChild('activeName').equalTo(activeName).once('value', (interviews) => {
    interviews.forEach((interview) => {
      if (interview.val().pledgeName === pledgeName) {
        alreadyExists = true;
      }
    });

    if (alreadyExists) {
      res.sendStatus(400);
    } else {
      interviewsRef.push({ activeName, pledgeName });
      res.sendStatus(200);
    }
  });
};

exports.delete_interview = function(req, res) {
  const { activeName, pledgeName } = req.body;
  const interviewsRef = admin.database().ref('/interviews');
  const meritsRef = admin.database().ref('/merits');

  interviewsRef.orderByChild('activeName').equalTo(activeName).once('value', (interviews) => {
    if (interviews.exists()) {
      interviews.forEach((interview) => {
        if (interview.val().pledgeName === pledgeName) {
          interview.ref.remove(() => {
            meritsRef.orderByChild('type').equalTo('interview').once('value', (merits) => {
              if (merits.exists()) {
                merits.forEach((merit) => {
                  if (merit.val().activeName === activeName && merit.val().pledgeName === pledgeName) {
                    merit.ref.remove();
                  }
                });
              }

              res.sendStatus(200);
            });
          });
        }
      });
    }
  });
};

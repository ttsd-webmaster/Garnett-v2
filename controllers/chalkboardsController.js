const admin = require("firebase-admin");
const equal = require('deep-equal');

// Gets the chalkboard information
exports.get_chalkboard = function(req, res) {
  const { title } = req.query;
  const chalkboardsRef = admin.database().ref('/chalkboards');

  // Searches for the chalkboard by checking title
  chalkboardsRef.once('value', (chalkboards) => {
    chalkboards.forEach((chalkboard) => {
      if (title === chalkboard.val().title) {
        res.json({
          chalkboard: chalkboard.val()
        });
      }
    });
  });
};

// Retrieves all the attendees of the chalkboard
exports.get_chalkboard_attendees = function(req, res) {
  const { title } = req.query
  const chalkboardsRef = admin.database().ref('/chalkboards');

  chalkboardsRef.once('value', (chalkboards) => {
    chalkboards.forEach((chalkboard) => {
      // Looks for the chalkboard in the chalkboards ref
      if (title === chalkboard.val().title) {
        chalkboard.ref.child('attendees').once('value', (attendees) => {
          let attendeesArray = [];

          // Finds the attendees if there are any
          if (attendees.val()) {
            attendeesArray = Object.keys(attendees.val()).map(function(key) {
              return attendees.val()[key];
            });
          }

          res.json(attendeesArray);
        });
      }
    });
  });
};

// Creates a chalkboard
exports.create_chalkboard = function(req, res) {
  const { chalkboard } = req.body;
  const chalkboardsRef = admin.database().ref('/chalkboards');
  let counter = 0;

  // Adds chalkboards to general chalkboards and user's chalkboards
  chalkboardsRef.once('value', (chalkboards) => {
    if (chalkboards.val()) {
      chalkboards.forEach((chalkboard) => {
        counter++;

        if (chalkboard.title === chalkboard.val().title) {
          res.sendStatus(400);
        }
        else {
          if (!res.headersSent && counter === chalkboards.numChildren()) {
            chalkboardsRef.push(chalkboard);

            res.sendStatus(200);
          }
        }
      });
    }
    else {
      chalkboardsRef.push(chalkboard);

      res.sendStatus(200);
    }
  });
};

// Edits chalkboard for desktop
exports.update_chalkboard = function(req, res) {
  const { chalkboard } = req.body;
  const chalkboardsRef = admin.database().ref('/chalkboards');

  chalkboardsRef.once('value', (chalkboards) => {
    chalkboards.forEach((chalkboard) => {
      // Looks for the chalkboard in the chalkboards ref
      if (chalkboard.title === chalkboard.val().title) {
        // Updates the chalkboard
        chalkboard.ref.update(chalkboard);

        res.sendStatus(200);
      }
    });
  });
};

// Edits chalkboard for mobile devices
exports.update_chalkboard_mobile = function(req, res) {
  const { title, field, value } = req.body;
  const editedField = field.toLowerCase();
  const chalkboardsRef = admin.database().ref('/chalkboards');

  chalkboardsRef.once('value', (chalkboards) => {
    chalkboards.forEach((chalkboard) => {
      // Looks for the chalkboard in the chalkboards ref
      if (title === chalkboard.val().title) {
        // Updates the chalkboard
        chalkboard.ref.update({
          [editedField]: value
        });

        res.sendStatus(200);
      }
    });
  });
};

// Joins chalkboard as an attendee
exports.join_chalkboard = function(req, res) {
  const { name, photoURL, title } = req.body;
  const chalkboardsRef = admin.database().ref('/chalkboards');

  chalkboardsRef.once('value', (chalkboards) => {
    chalkboards.forEach((chalkboard) => {
      // Looks for the chalkboard in the chalkboards ref
      if (title === chalkboard.val().title) {
        // Adds the user to the Attendees ref
        chalkboard.ref.child('attendees').push({
          name,
          photoURL
        });
        
        res.sendStatus(200);
      }
    });
  });
};

// Removes chalkboard from both user's list and general list
exports.delete_chalkboard = function(req, res) {
  const { title } = req.body;
  const chalkboardsRef = admin.database().ref('/chalkboards');

  chalkboardsRef.once('value', (chalkboards) => {
    chalkboards.forEach((chalkboard) => {
      // Removes chalkboard in the chalkboards ref
      if (title === chalkboard.val().title) {
        chalkboard.ref.remove(() => {
          res.sendStatus(200);
        });
      }
    });
  });
};

// Leaves chalkboard as an attendee
exports.leave_chalkboard = function(req, res) {
  const { name, title } = req.body;
  const chalkboardsRef = admin.database().ref('/chalkboards');

  chalkboardsRef.once('value', (chalkboards) => {
    chalkboards.forEach((chalkboard) => {
      // Looks for the chalkboard in the chalkboards ref
      if (title === chalkboard.val().title) {
        chalkboard.ref.child('attendees').once('value', (attendees) => {
          attendees.forEach((attendee) => {
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
};

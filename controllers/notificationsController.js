const admin = require("firebase-admin");
require('@firebase/messaging');
const equal = require('deep-equal');

const DARTH_VADER_RINGTONE = [500, 110, 500, 110, 450, 110, 200, 110, 170, 40, 450, 110, 200, 110, 170, 40, 500];

// Save message token from server
exports.save_messaging_token = function(req, res) {
  const { displayName, token } = req.body;
  const userRef = admin.database().ref(`/users/${displayName}`);

  userRef.update({ registrationToken: token });
  res.sendStatus(200);
};

// Send created merit notification to users
exports.created_merit = function(req, res) {
  const { user, selectedUsers, merit } = req.body;
  const userName = `${user.firstName} ${user.lastName}`;
  const action = merit.amount >= 0 ? 'merits' : 'demerits';
  let counter = 0;
  let body;

  // Check who is creating the merit
  if (user.status === 'pledge') {
    body = `${merit.pledgeName} has logged ${merit.amount} ${action} from you.`;
  } else {
    body = `You have received ${merit.amount} ${action} from ${merit.activeName}.`;
  }

  selectedUsers.forEach((selectedUser) => {
    const selectedUserRef = admin.database().ref(`/users/${selectedUser.displayName}`);
    counter++;

    selectedUserRef.once('value', (snapshot) => {
      const { registrationToken } = snapshot.val();
      const message = {
        webpush: {
          notification: {
            title: 'Garnett',
            body,
            click_action: 'https://garnett-app.herokuapp.com/pledge-app',
            icon: user.photoURL,
            vibrate: DARTH_VADER_RINGTONE
          }
        },
        token: registrationToken
      };

      if (registrationToken) {
        admin.messaging().send(message)
        .then(function(response) {
          if (!res.headersSent && counter === selectedUsers.length) {
            console.log("Successfully sent message:", response);
            res.sendStatus(200);
          }
        })
        .catch(function(error) {
          if (!res.headersSent && counter === selectedUsers.length) {
            console.error("Error sending message:", error);
            res.sendStatus(400);
          }
        });
      } else {
        if (!res.headersSent && counter === selectedUsers.length) {
          res.sendStatus(200);
        }
      }
    })
  });
};

// Send deleted merit notification to users
exports.deleted_merit = function(req, res) {
  const { amount, activeName, pledgeName, activePhoto } = req.body.merit;
  const action = amount >= 0 ? 'merits' : 'demerits';
  const trimmedPledgeName = pledgeName.replace(/\s/g, '');
  const pledgeRef = admin.database().ref(`/users/${trimmedPledgeName}`);

  pledgeRef.once('value', (pledge) => {
    const { registrationToken } = pledge.val();
    const message = {
      webpush: {
        notification: {
          title: 'Garnett',
          body: `${activeName} has deleted ${amount} ${action}`,
          click_action: 'https://garnett-app.herokuapp.com/pledge-app',
          icon: activePhoto,
          vibrate: DARTH_VADER_RINGTONE
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
        console.error("Error sending message:", error);
        res.sendStatus(400);
      });
    } else {
      res.sendStatus(200);
    }
  })
};

// Send created chalkboard notification to pledges
exports.created_chalkboard = function(req, res) {
  const usersRef = admin.database().ref('/users');
  let counter = 0;

  usersRef.once('value', (users) => {
    users.forEach((user) => {
      counter++;
      if (user.val().status !== 'alumni') {
        const { registrationToken } = user.val();
        const message = {
          webpush: {
            notification: {
              title: 'Garnett',
              body: `New Chalkboard: ${req.body.chalkboardTitle}.`,
              click_action: 'https://garnett-app.herokuapp.com/pledge-app',
              icon: 'https://farm5.staticflickr.com/4555/24846365458_2fa6bb5179.jpg',
              vibrate: DARTH_VADER_RINGTONE
            }
          },
          token: registrationToken
        };

        if (registrationToken) {
          admin.messaging().send(message)
          .then(function(response) {
            if (!res.headersSent) {
              console.log("Successfully sent message:", response);
              res.sendStatus(200);
            }
          })
          .catch(function(error) {
            if (!res.headersSent) {
              console.error("Error sending message:", error);
              res.sendStatus(400);
            }
          });
        } else {
          if (!res.headersSent) {
            res.sendStatus(200);
          }
        }
      }
    });
  });
};

// Send edited chalkboard notification to attendees
exports.updated_chalkboard = function(req, res) {
  const { chalkboard } = req.body;
  const chalkboardsRef = admin.database().ref('/chalkboards');

  chalkboardsRef.once('value', (chalkboards) => {
    chalkboards.forEach((child) => {
      if (equal(chalkboard, child.val())) {
        child.ref.child('attendees').once('value', (attendees) => {
          attendees.forEach((attendee) => {
            const attendeeName = attendee.val().name.replace(/ /g,'');
            const attendeeRef = admin.database().ref(`/users/${attendeeName}`);

            attendeeRef.once('value', (snapshot) => {
              const { registrationToken } = snapshot.val();
              const message = {
                webpush: {
                  notification: {
                    title: 'Garnett',
                    body: `${chalkboard.activeName} has edited the chalkboard, ${chalkboard.title}.`,
                    click_action: 'https://garnett-app.herokuapp.com/pledge-app',
                    icon: 'https://farm5.staticflickr.com/4555/24846365458_2fa6bb5179.jpg',
                    vibrate: DARTH_VADER_RINGTONE
                  }
                },
                token: registrationToken
              };

              if (registrationToken) {
                admin.messaging().send(message)
                .then(function(response) {
                  if (!res.headersSent) {
                    console.log("Successfully sent message:", response);
                    res.sendStatus(200);
                  }
                })
                .catch(function(error) {
                  if (!res.headersSent) {
                    console.error("Error sending message:", error);
                    res.sendStatus(400);
                  }
                });
              } else {
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
};

function sendAttendeesNotification(chalkboard, message, res) {
  const chalkboardsRef = admin.database().ref('/chalkboards');

  chalkboardsRef.once('value', (chalkboards) => {
    chalkboards.forEach((child) => {
      if (equal(chalkboard, child.val())) {
        child.ref.child('attendees').once('value', (attendees) => {
          attendees.forEach((attendee) => {
            const attendeeName = attendee.val().name.replace(/ /g,'');
            const attendeeRef = admin.database().ref(`/users/${attendeeName}`);

            attendeeRef.once('value', (snapshot) => {
              const { registrationToken } = snapshot.val();

              if (registrationToken) {
                admin.messaging().send(message)
                .then(function(response) {
                  if (!res.headersSent) {
                    console.log("Successfully sent message:", response);
                    res.sendStatus(200);
                  }
                })
                .catch(function(error) {
                  if (!res.headersSent) {
                    console.error("Error sending message:", error);
                    res.sendStatus(400);
                  }
                });
              } else {
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
}

// Send joined chalkboard notification to active
exports.joined_chalkboard = function(req, res) {
  const { chalkboard, name } = req.body;
  const activeName = chalkboard.displayName;
  const activeRef = admin.database().ref(`/users/${activeName}`);

  activeRef.once('value', (active) => {
    const { registrationToken } = active.val();
    const message = {
      webpush: {
        notification: {
          title: 'Garnett',
          body: `${name} has joined the chalkboard, ${chalkboard.title}.`,
          click_action: 'https://garnett-app.herokuapp.com/pledge-app',
          icon: 'https://farm5.staticflickr.com/4555/24846365458_2fa6bb5179.jpg',
          vibrate: DARTH_VADER_RINGTONE
        }
      },
      token: registrationToken
    };

    if (registrationToken) {
      admin.messaging().send(message)
      .then(function(response) {
        if (!res.headersSent) {
          console.log("Successfully sent message:", response);
          res.sendStatus(200);
          sendAttendeesNotification(chalkboard, message, res);
        }
      })
      .catch(function(error) {
        if (!res.headersSent) {
          console.error("Error sending message:", error);
          res.sendStatus(400);
        }
      });
    } else {
      if (!res.headersSent) {
        res.sendStatus(200);
        sendAttendeesNotification(chalkboard, message, res);
      }
    }
  });
};

// Send left chalkboard notification to active
exports.left_chalkboard = function(req, res) {
  const { chalkboard, name } = req.body;
  const activeName = chalkboard.displayName;
  const activeRef = admin.database().ref(`/users/${activeName}`);

  activeRef.once('value', (active) => {
    const { registrationToken } = active.val();
    const message = {
      webpush: {
        notification: {
          title: 'Garnett',
          body: `${name} has left the chalkboard, ${chalkboard.title}.`,
          click_action: 'https://garnett-app.herokuapp.com/pledge-app',
          icon: 'https://farm5.staticflickr.com/4555/24846365458_2fa6bb5179.jpg',
          vibrate: DARTH_VADER_RINGTONE
        }
      },
      token: registrationToken
    };

    if (registrationToken) {
      admin.messaging().send(message)
      .then(function(response) {
        if (!res.headersSent) {
          console.log("Successfully sent message:", response);
          res.sendStatus(200);
          sendAttendeesNotification(chalkboard, message, res);
        }
      })
      .catch(function(error) {
        if (!res.headersSent) {
          console.error("Error sending message:", error);
          res.sendStatus(400);
        }
      });
    } else {
      if (!res.headersSent) {
        res.sendStatus(200);
        sendAttendeesNotification(chalkboard, message, res);
      }
    }
  });
};

// Send complaint notification to pipm
exports.pending_complaint = function(req, res) {
  const { complaint } = req.body;
  const usersRef = admin.database().ref('/users');

  usersRef.once('value', (users) => {
    users.forEach((user) => {
      if (user.val().status === 'pipm') {
        const { registrationToken } = user.val();
        const message = {
          webpush: {
            notification: {
              title: 'Garnett',
              body: `A complaint has been submitted for ${complaint.pledgeName}.`,
              click_action: 'https://garnett-app.herokuapp.com/pledge-app',
              icon: 'https://farm5.staticflickr.com/4555/24846365458_2fa6bb5179.jpg',
              vibrate: DARTH_VADER_RINGTONE
            }
          },
          token: registrationToken
        };

        if (registrationToken) {
          admin.messaging().send(message)
          .then(function(response) {
            if (!res.headersSent) {
              console.log("Successfully sent message:", response);
              res.sendStatus(200);
            }
          })
          .catch(function(error) {
            if (!res.headersSent) {
              console.error("Error sending message:", error);
              res.sendStatus(400);
            }
          });
        } else {
          if (!res.headersSent) {
            res.sendStatus(200);
          }
        }
      }
    });
  });
};

// Send complaint notification to pledge
exports.approved_complaint = function(req, res) {
  const { complaint } = req.body;
  const pledgeRef = admin.database().ref(`/users/${complaint.pledgeDisplayName}`);

  pledgeRef.once('value', (pledge) => {
    const { registrationToken } = pledge.val();
    const message = {
      webpush: {
        notification: {
          title: 'Garnett',
          body: 'You have received a complaint.',
          click_action: 'https://garnett-app.herokuapp.com/pledge-app',
          icon: 'https://farm5.staticflickr.com/4555/24846365458_2fa6bb5179.jpg',
          vibrate: DARTH_VADER_RINGTONE
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
        console.error("Error sending message:", error);
        res.sendStatus(400);
      });
    } else {
      res.sendStatus(200);
    }
  });
};

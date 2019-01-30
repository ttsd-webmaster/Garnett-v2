const admin = require("firebase-admin");
require('@firebase/messaging');
const equal = require('deep-equal');

// Save message token from server
exports.save_messaging_token = function(req, res) {
  const { displayName, token } = req.body;
  const userRef = admin.database().ref('/users/' + displayName);

  userRef.update({
    registrationToken: token
  });

  res.sendStatus(200);
};

// Send active merit notification to pledges
exports.merited_as_active = function(req, res) {
  const { activeName, pledges, amount } = req.body;
  let counter = 0;
  let merits = 'merits';

  if (amount <= 0) {
    merits = 'demerits';
  }

  pledges.forEach((pledge) => {
    const pledgeRef = admin.database().ref('/users/' + pledge.value);

    pledgeRef.once('value', (snapshot) => {
      const registrationToken = snapshot.val().registrationToken;
      const meritAmount = Math.abs(amount);
      counter++;

      const message = {
        webpush: {
          notification: {
            title: 'Garnett',
            body: `You have received ${meritAmount} ${merits} from ${activeName}.`,
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
          if (!res.headersSent && counter === pledges.length) {
            console.log("Successfully sent message:", response);
            res.sendStatus(200);
          }
        })
        .catch(function(error) {
          if (!res.headersSent && counter === pledges.length) {
            console.log("Error sending message:", error);
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
};

// Send pledge merit notification to actives
exports.merited_as_pledge = function(req, res) {
  const { pledgeName, actives, amount } = req.body;
  let counter = 0;
  let merits = 'merits';

  if (amount <= 0) {
    merits = 'demerits';
  }

  actives.forEach((active) => {
    const activeRef = admin.database().ref('/users/' + active.value);

    activeRef.once('value', (snapshot) => {
      const registrationToken = snapshot.val().registrationToken;
      const meritAmount = Math.abs(amount);
      counter++;

      const message = {
        webpush: {
          notification: {
            title: 'Garnett',
            body: `You have given ${meritAmount} ${merits} to ${pledgeName}.`,
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
          if (!res.headersSent && counter === actives.length) {
            console.log("Successfully sent message:", response);
            res.sendStatus(200);
          }
        })
        .catch(function(error) {
          if (!res.headersSent && counter === actives.length) {
            console.log("Error sending message:", error);
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
};

// Send created chalkboard notification to pledges
exports.created_chalkboard = function(req, res) {
  const usersRef = admin.database().ref('/users');
  let counter = 0;

  usersRef.once('value', (users) => {
    users.forEach((user) => {
      if (user.val().status !== 'alumni') {
        const registrationToken = user.val().registrationToken;
        counter++;

        const message = {
          webpush: {
            notification: {
              title: 'Garnett',
              body: `New Chalkboard: ${req.body.chalkboardTitle}.`,
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
            if (!res.headersSent) {
              console.log("Successfully sent message:", response);
              res.sendStatus(200);
            }
          })
          .catch(function(error) {
            if (!res.headersSent) {
              console.log("Error sending message:", error);
              res.sendStatus(400);
            }
          });
        }
        else {
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
            const attendeeRef = admin.database().ref('/users/' + attendeeName);

            attendeeRef.once('value', (snapshot) => {
              const registrationToken = snapshot.val().registrationToken;
              const message = {
                webpush: {
                  notification: {
                    title: 'Garnett',
                    body: `${chalkboard.activeName} has edited the chalkboard, ${chalkboard.title}.`,
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
                  if (!res.headersSent) {
                    console.log("Successfully sent message:", response);
                    res.sendStatus(200);
                  }
                })
                .catch(function(error) {
                  if (!res.headersSent) {
                    console.log("Error sending message:", error);
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
};

function sendAttendeesNotification(chalkboard, message, res) {
  const chalkboardsRef = admin.database().ref('/chalkboards');

  chalkboardsRef.once('value', (chalkboards) => {
    chalkboards.forEach((child) => {
      if (equal(chalkboard, child.val())) {
        child.ref.child('attendees').once('value', (attendees) => {
          attendees.forEach((attendee) => {
            const attendeeName = attendee.val().name.replace(/ /g,'');
            const attendeeRef = admin.database().ref('/users/' + attendeeName);

            attendeeRef.once('value', (snapshot) => {
              const registrationToken = snapshot.val().registrationToken;

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
                    console.log("Error sending message:", error);
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
}

// Send joined chalkboard notification to active
exports.joined_chalkboard = function(req, res) {
  const { chalkboard, name } = req.body;
  const activeName = chalkboard.displayName;
  const activeRef = admin.database().ref('/users/' + activeName);

  activeRef.once('value', (active) => {
    const registrationToken = active.val().registrationToken;
    const message = {
      webpush: {
        notification: {
          title: 'Garnett',
          body: `${name} has joined the chalkboard, ${chalkboard.title}.`,
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
        if (!res.headersSent) {
          console.log("Successfully sent message:", response);
          res.sendStatus(200);
          sendAttendeesNotification(chalkboard, message, res);
        }
      })
      .catch(function(error) {
        if (!res.headersSent) {
          console.log("Error sending message:", error);
          res.sendStatus(400);
        }
      });
    }
    else {
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
  const activeRef = admin.database().ref('/users/' + activeName);

  activeRef.once('value', (active) => {
    const registrationToken = active.val().registrationToken;
    const message = {
      webpush: {
        notification: {
          title: 'Garnett',
          body: `${name} has left the chalkboard, ${chalkboard.title}.`,
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
        if (!res.headersSent) {
          console.log("Successfully sent message:", response);
          res.sendStatus(200);
          sendAttendeesNotification(chalkboard, message, res);
        }
      })
      .catch(function(error) {
        if (!res.headersSent) {
          console.log("Error sending message:", error);
          res.sendStatus(400);
        }
      });
    }
    else {
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
        const registrationToken = user.val().registrationToken;
        const message = {
          webpush: {
            notification: {
              title: 'Garnett',
              body: `A complaint has been submitted for ${complaint.pledgeName}.`,
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
            if (!res.headersSent) {
              console.log("Successfully sent message:", response);
              res.sendStatus(200);
            }
          })
          .catch(function(error) {
            if (!res.headersSent) {
              console.log("Error sending message:", error);
              res.sendStatus(400);
            }
          });
        }
        else {
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
  const pledgeRef = admin.database().ref('/users/' + complaint.pledgeDisplayName);

  pledgeRef.once('value', (pledge) => {
    const registrationToken = pledge.val().registrationToken;
    const message = {
      webpush: {
        notification: {
          title: 'Garnett',
          body: 'You have received a complaint.',
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
};

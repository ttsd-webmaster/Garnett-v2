const admin = require("firebase-admin");

// Update interaction for rushee
exports.update_interaction = function(req, res) {
  let { totalInteractions } = req.body;
  const { rusheeName, displayName, interacted } = req.body;
  const rusheeRef = admin.database().ref('/rushees/' + rusheeName);
  const activeRef = rusheeRef.child('Actives/' + displayName);

  if (!interacted == true) {
    totalInteractions++;
  }
  else {
    totalInteractions--;
  }

  rusheeRef.update({ totalInteractions });

  activeRef.update({
    interacted: !interacted
  });

  res.sendStatus(200);
};

// Start vote for rushee
exports.start_vote = function(req, res) {
  const delibsRef = admin.database().ref('/delibsVoting');

  delibsRef.update({
    open: true,
    rushee: rusheeName
  });

  res.sendStatus(200);
};

// End vote for rushee
exports.end_vote = function(req, res) {
  const delibsRef = admin.database().ref('/delibsVoting');

  delibsRef.update({
    open: false,
    rushee: false
  });

  res.sendStatus(200);
};

// Voting for rushee
exports.vote_for_rushee = function(req, res) {
  const rusheeName = req.body.rushee.replace(/ /g,'');
  const fullName = req.body.displayName;
  const rusheeRef = admin.database().ref('/rushees/' + rusheeName);
  const activeRef = admin.database().ref('/rushees/' + rusheeName + '/Actives/' + fullName);
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
      const votes = rushee.val().votes + vote;

      if (active.val().voted === false) {
        rusheeRef.update({
          totalVotes: rushee.val().totalVotes + 1
        });
        activeRef.update({
          voted: true
        });
      }

      rusheeRef.update({
        votes: votes
      });
      activeRef.update({
        vote: req.body.vote
      });

      res.sendStatus(200);
    });
  });
};

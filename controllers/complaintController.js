const admin = require("firebase-admin");

// Gets all the pledges for complaints
exports.get_pledges_as_active = function(req, res) {
  const usersRef = admin.database().ref('/users');

  // Loop through all users for pledges
  usersRef.once('value', (users) => {
    let pledgeArray = [];

    if (users.val()) {
      users.forEach((child) => {
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
};

// Put complaint data
exports.create_complaint = function(req, res) {
  const { status, complaint } = req.body;
  // Check if active is PI/PM or not
  if (status !== 'pipm') {
    let complaintsRef = admin.database().ref('/pendingComplaints');

    // Add complaints to active's pending complaints list and the pending complaints list
    complaintsRef.push(complaint);
  }
  else {
    const { pledgeDisplayName } = complaint;
    let complaintsRef = admin.database().ref('/approvedComplaints');
    let pledgeComplaintsRef = admin.database().ref('/users/' + pledgeDisplayName + '/Complaints');

    // Add complaints to the approved complaints list and the specified pledge's complaints list
    complaintsRef.push(complaint);

    pledgeComplaintsRef.push(complaint);
  }

  res.sendStatus(200);
};

// Removes complaint for active
exports.delete_complaint = function(req, res) {
  const pendingComplaintsRef = admin.database().ref('/pendingComplaints');

  pendingComplaintsRef.once('value', (complaints) => {
    complaints.forEach((complaint) => {
      // Removes complaint from the pending complaints list
      if (equal(req.body.complaint, complaint.val())) {
        complaint.ref.remove(() => {
          res.sendStatus(200);
        });
      }
    });
  });
};

// Approves complaint for PI/PM
exports.approve_complaint = function(req, res) {
  const { complaint } = req.body;
  const pledgeName = complaint.pledgeDisplayName;
  let pledgeComplaintsRef = admin.database().ref('/users/' + pledgeName + '/Complaints');
  let approvedComplaintsRef = admin.database().ref('/approvedComplaints');
  const pendingComplaintsRef = admin.database().ref('/pendingComplaints');

  pendingComplaintsRef.once('value', (complaints) => {
    complaints.forEach((complaint) => {
      // Removes complaint from the pending complaints list
      if (equal(complaint, complaint.val())) {
        complaint.ref.remove(() => {
          // Adds complaint to the approved complaints list
          approvedComplaintsRef.push(complaint);
          // Adds complaint to the pledge's complaints list
          pledgeComplaintsRef.push(complaint);

          res.sendStatus(200);
        });
      }
    });
  });
};

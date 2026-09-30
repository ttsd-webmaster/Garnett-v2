const admin = require('firebase-admin');
const useragent = require('useragent');

// Hardcoded point admins. Only these two can award, correct, or take back
// points. Keyed by displayName, which is `firstName + lastName` with spaces
// removed, the same convention used everywhere else for user keys.
// Emanuel is listed under both his own key and his pledge instructor key, since
// the PI handoff moves his account between them.
const POINTS_ADMINS = ['EmanuelNader', 'PledgeInstructorNader', 'SophiaKim'];

// Statuses that take part in the active point system
const POINTS_STATUSES = ['active', 'pipm'];

exports.POINTS_ADMINS = POINTS_ADMINS;

function isPointsAdmin(displayName) {
  return POINTS_ADMINS.includes(displayName);
}

exports.isPointsAdmin = isPointsAdmin;

function getUser(displayName) {
  if (!displayName) {
    return Promise.resolve(null);
  }
  return admin.database().ref(`/users/${displayName}`).once('value')
    .then((user) => user.val());
}

// Pledges must never see any of this, so the viewer's status is always read
// back from the database instead of trusted from the request.
function requireActiveViewer(req, res) {
  const { displayName } = req.query;

  return getUser(displayName).then((user) => {
    if (!user || user.status === 'pledge') {
      res.sendStatus(403);
      return null;
    }
    return user;
  });
}

// Guards every write. Checks the allowlist and confirms the user still exists.
function requirePointsAdmin(displayName, res) {
  if (!isPointsAdmin(displayName)) {
    res.sendStatus(403);
    return Promise.resolve(null);
  }

  return getUser(displayName).then((user) => {
    if (!user) {
      res.sendStatus(403);
      return null;
    }
    return user;
  });
}

function fullName(user) {
  return `${user.firstName} ${user.lastName}`;
}

// Sums a snapshot of /activePoints into a name -> { total, instances } map
function totalsByActive(points) {
  const totals = new Map();

  if (points.exists()) {
    points.forEach((point) => {
      const { activeName, amount } = point.val();
      const current = totals.get(activeName) || { total: 0, instances: 0 };
      totals.set(activeName, {
        total: current.total + amount,
        instances: current.instances + 1
      });
    });
  }

  return totals;
}

// Get the requesting active's own total and breakdown
exports.get_my_points = function(req, res) {
  const pointsRef = admin.database().ref('/activePoints');

  requireActiveViewer(req, res).then((user) => {
    if (!user) {
      return;
    }

    const name = fullName(user);

    pointsRef.orderByChild('activeName').equalTo(name).once('value', (points) => {
      const myPoints = [];
      let total = 0;

      if (points.exists()) {
        points.forEach((point) => {
          total += point.val().amount;
          myPoints.push(Object.assign({ key: point.key }, point.val()));
        });
      }

      res.json({ total, points: myPoints.reverse() });
    });
  });
};

// Get the active leaderboard, ranked by total points
exports.get_leaderboard = function(req, res) {
  const usersRef = admin.database().ref('/users');
  const pointsRef = admin.database().ref('/activePoints');

  requireActiveViewer(req, res).then((viewer) => {
    if (!viewer) {
      return;
    }

    pointsRef.once('value', (points) => {
      const totals = totalsByActive(points);

      usersRef.once('value', (users) => {
        const leaderboard = [];

        users.forEach((user) => {
          const { status, photoURL } = user.val();

          if (!POINTS_STATUSES.includes(status)) {
            return;
          }

          const name = fullName(user.val());
          const totalsForActive = totals.get(name) || { total: 0, instances: 0 };

          leaderboard.push({
            name,
            photoURL,
            total: totalsForActive.total,
            instances: totalsForActive.instances
          });
        });

        // Rank by total, then alphabetically so ties are stable
        leaderboard.sort((a, b) => {
          if (a.total !== b.total) {
            return b.total - a.total;
          }
          return a.name.localeCompare(b.name);
        });

        res.json({ leaderboard });
      });
    });
  });
};

// Gets all the actives an admin can award points to
exports.get_actives_for_points = function(req, res) {
  const { displayName } = req.query;
  const usersRef = admin.database().ref('/users');
  const pointsRef = admin.database().ref('/activePoints');

  requirePointsAdmin(displayName, res).then((user) => {
    if (!user) {
      return;
    }

    pointsRef.once('value', (points) => {
      const totals = totalsByActive(points);

      usersRef.once('value', (users) => {
        const result = [];

        users.forEach((active) => {
          const { status } = active.val();

          if (!POINTS_STATUSES.includes(status)) {
            return;
          }

          const currentActive = active.val();
          const name = fullName(active.val());
          const totalsForActive = totals.get(name) || { total: 0, instances: 0 };

          currentActive.displayName = active.key;
          currentActive.totalPoints = totalsForActive.total;

          result.push(currentActive);
        });

        result.sort((a, b) => a.firstName.localeCompare(b.firstName));

        res.json(result);
      });
    });
  });
};

// Gets the detailed breakdown for a single active. Admins only.
exports.get_active_points = function(req, res) {
  const { displayName, activeName } = req.query;
  const pointsRef = admin.database().ref('/activePoints');

  requirePointsAdmin(displayName, res).then((user) => {
    if (!user) {
      return;
    }

    if (!activeName) {
      return res.status(400).send('No active specified.');
    }

    pointsRef.orderByChild('activeName').equalTo(activeName).once('value', (points) => {
      const activePoints = [];
      let total = 0;

      if (points.exists()) {
        points.forEach((point) => {
          total += point.val().amount;
          activePoints.push(Object.assign({ key: point.key }, point.val()));
        });
      }

      res.json({ total, points: activePoints.reverse() });
    });
  });
};

// Gets every point award across all actives, newest first. Admins only.
exports.get_all_points = function(req, res) {
  const { displayName } = req.query;
  const pointsRef = admin.database().ref('/activePoints');

  requirePointsAdmin(displayName, res).then((user) => {
    if (!user) {
      return;
    }

    pointsRef.once('value', (points) => {
      const allPoints = [];

      if (points.exists()) {
        points.forEach((point) => {
          allPoints.push(Object.assign({ key: point.key }, point.val()));
        });
      }

      allPoints.sort((a, b) => new Date(b.date) - new Date(a.date));

      res.json({ points: allPoints });
    });
  });
};

// Award points to one or more actives. Admins only.
exports.create_points = function(req, res) {
  const { user, selectedUsers, point } = req.body;
  const platform = useragent.parse(req.headers['user-agent']).toString();
  const pointsRef = admin.database().ref('/activePoints');

  requirePointsAdmin(user && user.displayName, res).then((awarder) => {
    if (!awarder) {
      return;
    }

    if (!point || !point.title || !point.title.trim()) {
      return res.status(400).send('A title is required.');
    }

    const amount = Number(point.amount);

    if (!Number.isFinite(amount) || amount === 0) {
      return res.status(400).send('An amount is required.');
    }

    if (!selectedUsers || !selectedUsers.length) {
      return res.status(400).send('No actives selected.');
    }

    // Firebase rejects undefined values, so photos fall back to an empty string
    const writes = selectedUsers.map((selectedUser) => (
      pointsRef.push({
        activeName: `${selectedUser.firstName} ${selectedUser.lastName}`,
        activePhoto: selectedUser.photoURL || '',
        amount,
        title: point.title.trim(),
        date: point.date || new Date().toISOString(),
        awardedBy: user.displayName,
        awardedByName: fullName(awarder),
        awardedByPhoto: awarder.photoURL || '',
        platform
      })
    ));

    Promise.all(writes)
      .then(() => res.sendStatus(200))
      .catch((error) => {
        console.error(error);
        res.status(500).send('Could not award points.');
      });
  });
};

// Correct a point award's amount or title. Admins only.
exports.update_points = function(req, res) {
  const { displayName, key, amount, title } = req.body;
  const pointsRef = admin.database().ref('/activePoints');

  requirePointsAdmin(displayName, res).then((user) => {
    if (!user) {
      return;
    }

    const updatedAmount = Number(amount);

    if (!Number.isFinite(updatedAmount) || updatedAmount === 0) {
      return res.status(400).send('An amount is required.');
    }

    if (!title || !title.trim()) {
      return res.status(400).send('A title is required.');
    }

    if (!key) {
      return res.status(400).send('Points not found.');
    }

    const pointRef = pointsRef.child(key);

    pointRef.once('value', (point) => {
      if (!point.exists()) {
        return res.status(400).send('Points not found.');
      }

      pointRef.update({ amount: updatedAmount, title: title.trim() })
        .then(() => res.sendStatus(200))
        .catch((error) => {
          console.error(error);
          res.status(500).send('Could not correct those points.');
        });
    });
  });
};

// Take back a point award. Admins only.
exports.delete_points = function(req, res) {
  const { displayName, key } = req.body;
  const pointsRef = admin.database().ref('/activePoints');

  requirePointsAdmin(displayName, res).then((user) => {
    if (!user) {
      return;
    }

    if (!key) {
      return res.status(400).send('Points not found.');
    }

    const pointRef = pointsRef.child(key);

    pointRef.once('value', (point) => {
      if (!point.exists()) {
        return res.status(400).send('Points not found.');
      }

      pointRef.remove()
        .then(() => res.sendStatus(200))
        .catch((error) => {
          console.error(error);
          res.status(500).send('Could not take back those points.');
        });
    });
  });
};

var express = require('express');
var router = express.Router();

// Require controller modules.
var controller = require('../controllers/activePointsController');

/// ACTIVE POINT ROUTES ///
// GET requests
router.get('/me', controller.get_my_points);
router.get('/leaderboard', controller.get_leaderboard);
router.get('/actives', controller.get_actives_for_points);
router.get('/active', controller.get_active_points);
router.get('/all', controller.get_all_points);

// PUT requests
router.put('/', controller.create_points);
router.put('/update', controller.update_points);

// DELETE requests
router.delete('/', controller.delete_points);

module.exports = router;

var express = require('express');
var router = express.Router();

// Require controller modules.
var controller = require('../controllers/chalkboardsController');

/// MERIT ROUTES ///
// GET requests
router.get('/', controller.get_chalkboard);
router.get('/attendees', controller.get_chalkboard_attendees);

// PUT requests
router.put('/create', controller.create_chalkboard);
router.put('/update', controller.update_chalkboard);
router.put('/mobile/update', controller.update_chalkboard_mobile);
router.put('/join', controller.join_chalkboard);
router.put('/delete', controller.delete_chalkboard);
router.put('/leave', controller.leave_chalkboard);

module.exports = router;

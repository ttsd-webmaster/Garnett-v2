var express = require('express');
var router = express.Router();

// Require controller modules.
var controller = require('../controllers/delibsController');

/// MERIT ROUTES ///
// PUT requests
router.put('/interaction/update', controller.update_interaction);
router.put('/vote/start', controller.start_vote);
router.put('/vote/end', controller.end_vote);
router.put('/vote/create', controller.vote_for_rushee);

module.exports = router;

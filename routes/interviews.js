var express = require('express');
var router = express.Router();

// Require controller modules.
var controller = require('../controllers/interviewsController');

/// INTERVIEW ROUTES ///
// GET requests
router.get('/', controller.get_interviews_progress);
router.get('/pledge', controller.get_pledge_completed_interviews);

module.exports = router;

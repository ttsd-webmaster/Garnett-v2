var express = require('express');
var router = express.Router();

// Require controller modules.
var controller = require('../controllers/interviewsController');

/// INTERVIEW ROUTES ///
// GET requests
router.get('/', controller.get_interviews_progress);
router.get('/pledge', controller.get_pledge_completed_interviews);

// PUT requests
router.put('/', controller.complete_interview);

// DELETE requests
router.delete('/', controller.delete_interview);

module.exports = router;

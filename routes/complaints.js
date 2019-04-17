var express = require('express');
var router = express.Router();

// Require controller modules.
var controller = require('../controllers/complaintsController');

/// MERIT ROUTES ///
// GET requests
router.get('/pledges', controller.get_pledges_as_active);

// PUT requests
router.put('/', controller.create_complaint);
router.put('/approve', controller.approve_complaint);

// DELETE requests
router.delete('/', controller.delete_complaint);

module.exports = router;

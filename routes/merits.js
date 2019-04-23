var express = require('express');
var router = express.Router();

// Require controller modules.
var controller = require('../controllers/meritsController');

/// MERIT ROUTES ///
// GET requests
router.get('/all', controller.get_all_merits);
router.get('/active/remainingMerits', controller.get_remaining_merits);
router.get('/active/pledges', controller.get_pledges_as_active);
router.get('/pledge/actives', controller.get_actives_as_pledge);
router.get('/chalkboards', controller.get_chalkboards_merit);

// PUT requests
router.put('/', controller.create_merit);

// DELETE requests
router.delete('/', controller.delete_merit);

module.exports = router;

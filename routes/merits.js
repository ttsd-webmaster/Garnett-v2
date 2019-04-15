var express = require('express');
var router = express.Router();

// Require controller modules.
var controller = require('../controllers/meritsController');

/// MERIT ROUTES ///
// GET requests
router.get('/active/remainingMerits', controller.get_remaining_merits);
router.get('/active/pledges', controller.get_pledges_as_active);
router.get('/active/pledges/mobile', controller.get_pledges_as_active_mobile);
router.get('/pledge/actives', controller.get_actives_as_pledge);
router.get('/pledge/actives/mobile', controller.get_actives_as_pledge_mobile);
router.get('/chalkboards', controller.get_chalkboards_merit);

// PUT requests
router.put('/create', controller.create_merit);
router.put('/delete', controller.delete_merit);

module.exports = router;

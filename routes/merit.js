var express = require('express');
var router = express.Router();

// Require controller modules.
var controller = require('../controllers/meritController');

/// MERIT ROUTES ///
// GET requests
router.get('/active/remaining', controller.get_merits_remaining);
router.get('/active/pledges', controller.get_pledges_as_active);
router.get('/active/pledges/mobile', controller.get_pledges_as_active_mobile);
router.get('/pledge/actives', controller.get_actives_as_pledge);
router.get('/pledge/actives/mobile', controller.get_actives_as_pledge_mobile);
router.get('/chalkboards', controller.get_chalkboards_merit);
router.get('/pledge/pbros', controller.get_pbros_as_pledge);

// PUT requests
router.put('/active/create', controller.merit_as_active);
router.put('/pledge/create', controller.merit_as_pledge);
router.put('/pledge/delete', controller.delete_merit_as_pledge);

module.exports = router;

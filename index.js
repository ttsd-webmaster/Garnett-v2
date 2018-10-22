var express = require('express');
var router = express.Router();

// Require controller modules.
var controller = require('../controllers/indexController');

/// MERIT ROUTES ///
// GET requests
router.get('/api/auth', controller.get_auth_status);
router.get('/api/firebase', controller.get_firebase_data);
router.get('/api/actives', controller.get_actives);
router.get('/api/pledges', controller.get_pledges);
router.get('/api/pledge/merits', controller.get_pledge_merits);
router.get('/api/pledge/complaints', controller.get_pledge_complaints);

// PUT requests
router.put('/api/signup', controller.signup);
router.put('/api/forgotpassword', controller.forgot_password);
router.put('/api/logout', controller.logout);
router.put('/api/photo/update', controller.update_photo);

module.exports = router;

var express = require('express');
var router = express.Router();

// Require controller modules.
var controller = require('../controllers/indexController');

/// MERIT ROUTES ///
// GET requests
router.get('/auth', controller.get_auth_status);
router.get('/actives', controller.get_actives);
router.get('/pledges', controller.get_pledges);
router.get('/pledge/merits', controller.get_pledge_merits);
router.get('/pledge/complaints', controller.get_pledge_complaints);
router.get('/photos', controller.get_photos);
router.get('/mydata', controller.get_my_data);

// PUT requests
router.put('/signup', controller.signup);
router.put('/forgotpassword', controller.forgot_password);
router.put('/logout', controller.logout);

module.exports = router;

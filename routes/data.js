var express = require('express');
var router = express.Router();

// Require controller modules.
var controller = require('../controllers/dataController');

/// DATA ROUTES ///
// GET requests
router.get('/pledging', controller.get_pledging_data);
router.get('/mydata', controller.get_my_data);

module.exports = router;

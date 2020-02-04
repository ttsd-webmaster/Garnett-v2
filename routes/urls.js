var express = require('express');
var router = express.Router();

// Require controller modules.
var controller = require('../controllers/urlsController');

/// URL ROUTES ///
// PUT requests
router.put('/', controller.create_url);
router.put('/update', controller.update_url);

module.exports = router;

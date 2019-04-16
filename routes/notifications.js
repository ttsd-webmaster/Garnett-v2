var express = require('express');
var router = express.Router();

// Require controller modules.
var controller = require('../controllers/notificationsController');

/// MERIT ROUTES ///
// PUT requests
router.put('/saveMessageToken', controller.save_messaging_token);
router.put('/merit/created', controller.created_merit);
router.put('/merit/deleted', controller.deleted_merit);
router.put('//chalkboard/created', controller.created_chalkboard);
router.put('/chalkboard/updated', controller.updated_chalkboard);
router.put('/chalkboard/joined', controller.joined_chalkboard);
router.put('/chalkboard/left', controller.left_chalkboard);
router.put('/complaint/pending', controller.pending_complaint);
router.put('/complaint/approved', controller.approved_complaint);

module.exports = router;

const express = require('express');
const router = new express.Router();

const controller = require('@controllers/views');

router.route('/').get(controller.index);
router.route('/model').get(controller.model);

module.exports = router;

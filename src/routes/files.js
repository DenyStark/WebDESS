const express = require('express');
const router = new express.Router();

const controller = require('@controllers/files');
const validate = require('@middleware/validate');

router.route('/save')
  .post(validate('file', false), controller.save);

module.exports = router;

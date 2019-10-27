const express = require('express');
const router = new express.Router();

const controller = require('@controllers/storage');
const validate = require('@middleware/validate');

router.route('/list')
  .get(controller.getList);

router.route('/load')
  .get(validate('id'), controller.load);

router.route('/save')
  .post(validate('file', false), controller.save);

module.exports = router;

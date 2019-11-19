const express = require('express');
const router = new express.Router();

const controller = require('@controllers/storage');
const validate = require('@middleware/validate');

router.route('/list')
  .get(controller.getList);

router.route('/file')
  .get(validate('title'), controller.loadFile);

router.route('/create')
  .post(validate('createFile', false), controller.createFile);

router.route('/update')
  .post(validate('update', false), controller.update);

module.exports = router;

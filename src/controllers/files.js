const fs = require('fs');

const { successRes } = require('@utils/res-builder');

const folder = 'src/files';

const save = async(req, res) => {
  const { data, title } = req.body;
  const path = `${folder}/${title}.json`;
  fs.writeFileSync(path, data);

  successRes(res);
};

module.exports = {
  save,
};

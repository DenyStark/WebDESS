const fs = require('fs');

const db = require('@db');
const { successRes } = require('@utils/res-builder');

const folder = 'src/files';

const randomIndex = () => (Math.random() * 1e18).toString(16);

const getList = async(_req, res) => {
  const list = await db.storage.getAll();
  successRes(res, { list });
};

const load = async(req, res) => {
  const { id } = req.query;
  const item = await db.storage.get({ id });

  item.data = fs.readFileSync(item.path, 'UTF8');
  delete item.path;

  successRes(res, { item });
};

const save = async(req, res) => {
  const { data, title } = req.body;
  const path = `${folder}/${randomIndex()}.json`;

  fs.writeFileSync(path, data);
  await db.storage.add({ title, path });

  successRes(res);
};

module.exports = {
  getList,
  load,
  save,
};

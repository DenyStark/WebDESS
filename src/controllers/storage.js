const fs = require('fs');

const db = require('@db');
const { successRes, errorRes } = require('@utils/res-builder');

const folder = 'src/files';

const randomIndex = () => (Math.random() * 1e18).toString(16);

const getList = async(_req, res) => {
  const list = await db.storage.getAll();
  successRes(res, { list });
};

const loadFile = async(req, res) => {
  const { title } = req.query;
  const { path, date } = await db.storage.get({ title });
  if (!path) return errorRes(res, 422, 73400);

  let data;
  try {
    const file = fs.readFileSync(path, 'UTF8');
    data = JSON.parse(file);
  } catch (error) { console.error(error); }

  if (!data) return errorRes(res, 500, 73500);
  successRes(res, { file: { data, date } });
};

const save = async(req, res) => {
  const { data, title } = req.body;
  const path = `${folder}/${randomIndex()}.json`;

  fs.writeFileSync(path, data);
  await db.storage.add({ title, path });

  successRes(res);
};

const update = async(req, res) => {
  const { id, data } = req.body;
  const item = await db.storage.get({ id });
  if (!item.path) return errorRes(res, 422, 73400);

  fs.writeFileSync(item.path, data);
  await db.storage.update({ id });

  successRes(res);
};

module.exports = {
  getList,
  loadFile,
  save,
  update,
};

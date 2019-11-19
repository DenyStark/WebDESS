const fs = require('fs');

const db = require('@db');
const { successRes, errorRes } = require('@utils/res-builder');

const randomIndex = () => (Math.random() * 1e18).toString(16);

const getList = async(_req, res) => {
  const list = await db.storage.getAll();
  successRes(res, { list });
};

const loadFile = async(req, res) => {
  const { title } = req.query;
  const { path, date } = await db.storage.get({ title });
  if (!path) return errorRes(res, 422, 73400);

  try {
    const file = fs.readFileSync(path, 'UTF8');
    const data = JSON.parse(file);
    successRes(res, { file: { data, date } });
  } catch (error) {
    console.error(error);
    errorRes(res, 500, 73500);
  }
};

const createFile = async(req, res) => {
  const { title } = req.body;
  const data = req.body.data || {};
  const path = `src/files/${randomIndex()}.json`;

  const id = await db.storage.add({ title, path });
  if (!id) return errorRes(res, 422, 73401);

  try {
    fs.writeFileSync(path, JSON.stringify(data));
    successRes(res);
  } catch (error) {
    console.error(error);
    errorRes(res, 500, 73500);
  }
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
  createFile,
  update,
};

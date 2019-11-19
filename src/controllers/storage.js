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

const updateFile = async(req, res) => {
  const { title, data } = req.body;

  const { path } = await db.storage.get({ title });
  if (!path) return errorRes(res, 422, 73400);

  try {
    await db.storage.update({ title });
    fs.writeFileSync(path, JSON.stringify(data));
    successRes(res);
  } catch (error) {
    console.error(error);
    errorRes(res, 500, 73500);
  }
};

module.exports = {
  getList,
  loadFile,
  createFile,
  updateFile,
};

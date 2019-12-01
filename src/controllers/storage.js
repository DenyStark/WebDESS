const fs = require('fs');

const db = require('@db');
const { successRes, errorRes } = require('@utils/res-builder');

const randomIndex = () => (Math.random() * 1e18).toString(16);

const getList = async(req, res) => {
  const { type } = req.query;
  const list = await db.storage.getAll({ type });
  successRes(res, { list });
};

const loadFile = async(req, res) => {
  const { type, title } = req.query;
  const { path, date } = await db.storage.get({ type, title });
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
  const { type, title } = req.body;
  const data = req.body.data || {};
  const path = `src/files/${randomIndex()}.json`;

  const id = await db.storage.add({ title, path, type });
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
  const { type, title, data } = req.body;

  const { path } = await db.storage.get({ type, title });
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

const deleteFile = async(req, res) => {
  const { type, title } = req.body;

  const { path } = await db.storage.get({ type, title });
  if (!path) return errorRes(res, 422, 73400);

  try {
    await db.storage.delete({ type, title });
    fs.renameSync(path, path.replace(/([0-9a-f])+[.json]\w+/g, e => `~${e}`));
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
  deleteFile,
};

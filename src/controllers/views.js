const db = require('@db');

const index = async(_req, res) => {
  const storage = await db.storage.getAll();
  res.render('index', { storage });
};

const model = (_req, res) => {
  res.render('model', {});
};

module.exports = {
  index,
  model,
};

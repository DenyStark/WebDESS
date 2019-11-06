const db = require('@db');

const index = async(_req, res) => {
  const storage = await db.storage.getAll();
  res.render('index', { storage });
};

const model = async(_req, res) => {
  const storage = await db.storage.getAll();
  res.render('model', { storage });
};

module.exports = {
  index,
  model,
};

const { version } = process.env;

const express = require('express');

const app = express();

app.use(express.json({
  type: ['application/json', 'text/plain']
}));

app.get('/', (_req, res) => {
  res.json({ version });
});

module.exports = app;

const { version } = process.env;

const express = require('express');

const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.json({
  type: ['application/json', 'text/plain']
}));

app.get('/version', (_req, res) => {
  res.json({ version });
});

app.use('/', (_req, res) => {
  res.render('NetDesigner');
});
app.use('/mobile', (_req, res) => {
  res.render('ModelDesigner');
});

module.exports = app;

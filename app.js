const { version } = process.env;

const express = require('express');
const bodyParser = require('body-parser');

const files = require('@routes/files');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(express.static('public'));
app.use(express.json({
  type: ['application/json', 'text/plain']
}));

app.get('/version', (_req, res) => {
  res.json({ version });
});

app.use('/files', files);

app.get('/', (_req, res) => {
  res.render('index', {});
});
app.get('/mobile', (_req, res) => {
  res.render('mobile', {});
});

module.exports = app;

const { version } = process.env;

const express = require('express');
const bodyParser = require('body-parser');

const views = require('@routes/views');
const storage = require('@routes/storage');

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

app.use('/', views);
app.use('/storage', storage);

module.exports = app;

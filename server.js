const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const indexRouter = require('./routes/index');

const app = express();
const appEnv = app.get('env');

module.exports = app;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname)));
app.set('view engine', 'ejs');

if (appEnv !== 'production') {
  app.set('views', path.join(__dirname, 'src'));
} else {
  app.set('views', path.join(__dirname, 'build'));
}

app.use('/', indexRouter);
// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  console.log(err);
  res.status(500).send('Something broke!');
});

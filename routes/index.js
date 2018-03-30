const fs = require('fs');
const express = require('express');
const router = express.Router();
const ReactDOMServer = require('react-dom/server');
const App = require('../build/index.server.bundle.js');
const testRouter = require('./api/test');

module.exports = router;

router.use('/api', testRouter);

router.get('*', (req, res) => {
  const props = { };

  App.default(req.url, props).then((reactComponent) => {
    let data = [];
    props.data = data;
    const content = ReactDOMServer.renderToString(reactComponent);
    console.log('content', content);
    // const html = template.replace('{{thing}}', result).replace('{{props}}', JSON.stringify(props));
    res.render('index', {
      content,
    });
  });
});

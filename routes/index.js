const fs = require('fs');
const express = require('express');
const router = express.Router();
const ReactDOMServer = require('react-dom/server');
const App = require('../build/index.server.bundle.js');
const testRouter = require('./api/test');

module.exports = router;

router.use('/api', testRouter);

router.get('*', (req, res) => {
  App.default(req.url).then((reactComponent) => {
    const content = ReactDOMServer.renderToString(reactComponent);
    res.render('index', {
      content,
      preloadData: reactComponent.props.context.data ? reactComponent.props.context.data : {},
    });
  });
});

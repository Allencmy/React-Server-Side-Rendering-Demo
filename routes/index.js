const fs = require('fs');
const express = require('express');
const router = express.Router();
const ReactDOMServer = require('react-dom/server');
const App = require('../build/index.server.bundle.js');
const testRouter = require('./api/test');

module.exports = router;

router.use('/api', testRouter);

router.get('*', (req, res, next) => {
  const props = { };

  App.default(req.url, props).then((result) => {

    if (result.length) {
      console.log('result', result);
      const reactComponent = result[0].reactComponent;
      const dataset = result[0].data;
      console.log('App.default reactComponent', reactComponent);
      console.log('dataset', dataset);
      const content = ReactDOMServer.renderToString(reactComponent);
      // console.log('content', content);
      // const html = template.replace('{{thing}}', result).replace('{{props}}', JSON.stringify(props));
      console.log('reactComponent.props ? reactComponent.props.data : {}', reactComponent.props ? reactComponent.props.data : {});
      res.render('index', {
        content,
        // preloadData: [1,2,3]

        preloadData: reactComponent.props ? reactComponent.props.data : {}
        // preloadData: {
        //   preloadData: reactComponent.props ? reactComponent.props.data : {}
        // },
      });
    }
  })
  .catch((error) => {
    console.error(error);
  })
});

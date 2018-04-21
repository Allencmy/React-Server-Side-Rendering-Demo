import React from 'react';
import { BrowserRouter, StaticRouter, } from 'react-router-dom';
import { render } from 'react-dom';
import { renderRoutes } from 'react-router-config';

import Nav from './components/common/nav/index';
import routeConfig from './routes';

import {ensureReady } from './utils/ssrUtils';


if (typeof window !== 'undefined') {
  ensureReady(routeConfig).then(() => {
    const preloadData = JSON.parse(document.getElementById('props').dataset.props);
    render(
      (
        <BrowserRouter>
          <div>
            <Nav />
            <hr />
            { renderRoutes(routeConfig, { preloadData, }) }
          </div>
        </BrowserRouter>
      ),
      document.getElementById('root'),
    );
  });
}

export default function render2(location) {
  return ensureReady(routeConfig, location).then((components) => {
    // component already loaded. Please match and render.

    if (components[0] && components[0].fetchData) {
      return components[0].fetchData()
        .then(result => (
          <StaticRouter context={{ data: result }} location={location}>
            {renderRoutes(routeConfig)}
          </StaticRouter>
        ));
    }
    return (
      <StaticRouter context={{ a: 1 }} location={location}>
        {renderRoutes(routeConfig)}
      </StaticRouter>
    );
  });
}

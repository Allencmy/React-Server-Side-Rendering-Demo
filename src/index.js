import React from 'react';
import { BrowserRouter, Route, Switch, Redirect, StaticRouter, } from 'react-router-dom';
import Nav from './components/common/nav/index';
import { renderRoutes } from 'react-router-config';
import routeConfig from './routes';
import { render } from 'react-dom';

import { convertCustomRouteConfig, ensureReady } from './utils/ssrUtils';


if (typeof window !== 'undefined') {
  ensureReady(routeConfig).then(() => {
    const props = JSON.parse(document.getElementById('props').dataset.props); // eslint-disable-line
    render(
      (
        <BrowserRouter>
          { renderRoutes(routeConfig, props) }
        </BrowserRouter>
      ),
      document.getElementById('root'), // eslint-disable-line
    );
  });
}


export default function render2(location, props) {
  return ensureReady(routeConfig, location).then((components) => {
    components.forEach((c) => {
      if (c && c.fetchData) {
        console.log('c.fetchData', c.fetchData);
        c.fetchData();
      }
    })
    return (
      <StaticRouter context={{}} location={location}>
        {renderRoutes(routeConfig, props)}
      </StaticRouter>
    );
  });
}

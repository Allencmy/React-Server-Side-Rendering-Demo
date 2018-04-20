import React from 'react';
import { BrowserRouter, Route, Switch, Redirect, StaticRouter, } from 'react-router-dom';
import Nav from './components/common/nav/index';
import { renderRoutes } from 'react-router-config';
import routeConfig from './routes';
import { render } from 'react-dom';

import { convertCustomRouteConfig, ensureReady } from './utils/ssrUtils';


if (typeof window !== 'undefined') {
  ensureReady(routeConfig).then(() => {
    // const props = JSON.parse(document.getElementById('props').dataset.props); // eslint-disable-line
    const props = {}; // eslint-disable-line
    const props1 = document.getElementById('props').dataset.props; // eslint-disable-line
    console.log('props1', props1);
    console.log('typeof props1', typeof props1);
    console.log('typeof props1', JSON.parse(props1));
    render(
      (
        <BrowserRouter>
          <div>
            <Nav />
            <hr />
            { renderRoutes(routeConfig, props) }
          </div>
        </BrowserRouter>
      ),
      document.getElementById('root'), // eslint-disable-line
    );
  });
}


export default function render2(location, props) {
  return ensureReady(routeConfig, location).then((components) => {
    // components.forEach((c) => {
    //   if (c && c.fetchData) {
    //     return c.fetchData()
    //     .then((data) => {
    //       console.log('data.length', data.length);
    //       return (
    //         <StaticRouter context={{ movies: data, }} location={location}>
    //           {renderRoutes(routeConfig, {...props, movies: data, })}
    //         </StaticRouter>
    //       );
    //     })
    //   }
    //   console.log(12123123123123);
    // })
    console.log('components', components);
    return Promise.all(components.map((c) => {
      if (c && c.fetchData) {
        return c.fetchData()
        .then(data => {
          console.log('data.length', data.length);
          // props.data = data;

          return {
            reactComponent: (
              <StaticRouter context={{}} location={location}>
              {renderRoutes(routeConfig, {...props, data})}
              </StaticRouter>),
            data,
          }
        });
      }
      console.log(909);
      return (
        <StaticRouter context={{}} location={location}>
        {renderRoutes(routeConfig, { ...props, data})}
        </StaticRouter>
      )
    }))
  });
}

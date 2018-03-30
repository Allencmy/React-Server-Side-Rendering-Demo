import Movie from './components/movie';
import About from './components/about'

import { convertCustomRouteConfig, generateAsyncRouteComponent, } from './utils/ssrUtils';

const routes = [{
  path: parentRoute => `${parentRoute}/`,
  exact: true,
  component: generateAsyncRouteComponent({
    loader: () => import('./components/movie'),
  }),
}, {
  path: parentRoute => `${parentRoute}/about`,
  component: generateAsyncRouteComponent({
    loader: () => import('./components/about'),
  }),
}];

export default convertCustomRouteConfig(routes);

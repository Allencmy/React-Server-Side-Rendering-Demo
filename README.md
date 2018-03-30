# React Server Side Rendering Demo

### 前言
Hello, 在SPA大行其道的今天，SEO一直存在比较严重的问题。大家都知道SSR是解决SEO的方向，我的理解也仅仅是：在服务器接收到访问的请求返回页面时，会把Component渲染成字符串塞到HTML中一同返回。但是，怎么实现呢？在research的时候，发现了Airbnb的一位工程师的文章--[Server Rendering, Code Splitting, and Lazy Loading with React Router v4](https://medium.com/airbnb-engineering/server-rendering-code-splitting-and-lazy-loading-with-react-router-v4-bfe596a6af70)。这位前辈不仅实现了SSR，还与Code Splitting、Lazy Loading集合在了一起，这简直是非常的厉害了。在前辈的demo中，唯一缺失的地方是所有的数据都是mock的。在实际的App当中，所有的数据都是通过请求来获得，这部分数据的获取，也是SSR一个比较关键的点。这篇文章主要是是站在前辈的肩膀上，结合自己平常的项目结构的实践，实现完整的SSR的demo给大家一些借鉴。

我的这个demo也比较简单，一个app有两个子路由。其中Movie Component，是动态的获取的数据，调用豆瓣的api。在没有做SSR之前，加载组件的时候白屏至少200ms，查看网页源码也是空荡荡的，这样的页面爬虫怎么会喜欢呢……

### React Router V4
无论是SSR还是Code Splitting，甚至是同时实现它们，你都需要在渲染之前就匹配到访问的路径。然而，React Router v4的路由已经不再是集中配置，而是分散在App当中。现在定义路由会像下面这样：
```js
export default function App() {
  return (
    <div>
      <h1>Welcome!</h1>
      <Route path="/about" component={About}/>
      <Route path="/dashboard" component={Dashboard}/>
    </div>
  );
}
```
用这种方式定义路由意味着，在实际渲染之前，你不会知道哪些路由，哪些组件会被渲染。

### Re-Centralizing Routes
为了解决分散的路由配置所带来的问题，我们可以采用 react-router-config。这可以让我们在一个集中的位置定义路由，并在触发初始渲染之前就匹配到它们。我们现在，可以像下面一样定义路由：
```js
import Movie from './components/movie';
import About from './components/about'


const routes = [{
  path: '/',
  exact: true,
  component: Movie,
}, {
  path: '/about',
  component: About,
}];

export default routes;

```

采用react-router-config非常好，但是还是有一些工作要做。react-router-config似乎不支持以异步方式加载组件，并且子路由的路径需要非常明确。需要注意的是，所有被定义的路径都要是完整的路径。这样会有点笨拙，并且限制重用。为了解决这个问题，我们实现了一个映射函数，允许组件定义子路由。

```JS
// ssrUtils.js
// This will recursively map our format of routes to the format
// that react-router-config expects
export default function convertCustomRouteConfig(routes, parentRoute) {
  return customRouteConfig.map((route) => {
    const pathResult = typeof route.path === 'function' ? route.path(parentRoute || '') : `${parentRoute}/${route.path}`;
    return {
      path: pathResult.replace('//', '/'),
      component: route.component,
      exact: route.exact,
      routes: route.routes ? convertCustomRouteConfig(route.routes, pathResult) : [],
    };
  });
  return mapping;
}
```
现在我们的路由就可以，像下面这样写。这里示例对大型的SPA、路由嵌套很深的项目有很好的帮助。
```JS
import Movie from './components/movie';
import About from './components/about'

import { convertCustomRouteConfig, } from './utils/ssrUtils';

const routes = [{
  path: parentRoute => `${parentRoute}/`,
  exact: true,
  component: Movie,
}, {
  path: parentRoute => `${parentRoute}/about`,
  component: About,
}];

export default convertCustomRouteConfig(routes);

```

### Defining an Async Route

我们需要确保在我们进行渲染调用之前，加载用户点击的所有路径的所有组件。我们定义一个异步加载的组件，注意静态的load方法，稍后将使用它来确保我们已经准备好进行渲染。

```js
/**
 * Returns a new React component, ready to be instantiated.
 * Note the closure here protecting Component, and providing a unique
 * instance of Component to the static implementation of `load`.
 */
export function generateAsyncRouteComponent({ loader, Placeholder }) {
  let Component = null;

  return class AsyncRouteComponent extends React.Component {
    constructor() {
      super();
      this.updateState = this.updateState.bind(this);
      this.state = {
        Component,
      };
    }

    componentWillMount() {
      AsyncRouteComponent.load().then(this.updateState);
    }

    updateState() {
      // Only update state if we don't already have a reference to the
      // component, this prevent unnecessary renders.
      if (this.state.Component !== Component) {
        this.setState({
          Component,
        });
      }
    }

    /**
     * Static so that you can call load against an uninstantiated version of
     * this component. This should only be called one time outside of the
     * normal render path.
    */
    static load() {
      return loader().then((ResolvedComponent) => {
        Component = ResolvedComponent.default || ResolvedComponent;
      });
    }

    render() {
      const { Component: ComponentFromState } = this.state;
      if (ComponentFromState) {
        return <ComponentFromState {...this.props} />;
      }
      if (Placeholder) {
        return <Placeholder {...this.props} />;
      }
      return null;
    }
  };
}
```

现在更新一下我们的路由配置。
```js
import Movie from './components/movie';
import About from './components/about'

import { convertCustomRouteConfig, generateAsyncRouteComponent, } from './utils/ssrUtils';

const routes = [{
  path: parentRoute => `${parentRoute}/`,
  exact: true,
  component: generateAsyncRouteComponent(() => import('./components/movie')),
}, {
  path: parentRoute => `${parentRoute}/about`,
  component: generateAsyncRouteComponent(() => import('./components/about')),
}];

export default convertCustomRouteConfig(routes);

```

### Ensuring the Routes are Ready

我们现在已经导出了一个路由的配置，包含路由与组件，其中组件特别注意有静态的load方法。在渲染之前剩下的工作，就是确保一切都被加载。

```js
import routes from './routes';
import { matchRoutes } from 'react-router-config';

/**
 * First match the routes via react-router-config's `matchRoutes` function.
 * Then iterate over all of the matched routes, if they've got a load function
 * call it.
 *
 * This helps us to make sure all the async code is loaded before rendering.
 */
export function ensureReady(routeConfig, providedLocation) {
  const matches = matchRoutes(routeConfig, providedLocation || location.pathname);
  return Promise.all(matches.map((match) => {
    const { component } = match.route;
    if (component && component.load) {
      return component.load();
    }
    return undefined;
  }));
}
```

### Putting it all Together

import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, } from 'react-router-dom';
import History from './components/history';
import About from './components/about';

export default class ClientApp extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={History}/>
          <Route path="/history" component={History}/>
          <Route path="/about" component={About}/>
        </Switch>
      </Router>
    );
  }
}

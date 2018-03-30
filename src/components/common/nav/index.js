import React from 'react';
import { Link, } from 'react-router-dom';

export default class Nav extends React.Component {


  render() {
    return (
      <div>
        <Link to="/movie">movie</Link>
        <Link to="/about">About</Link>
      </div>
    )
  }
}

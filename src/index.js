import React from 'react';
import { render, hydrate, } from 'react-dom';

import App from './app';

if (typeof window !== 'undefined') {
  render(<App />, document.getElementById("root"));
}

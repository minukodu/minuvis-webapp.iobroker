// React
import '@babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import ConfigLoader from './components/ConfigLoader';

// Render application
ReactDOM.render(
  <ConfigLoader />,
  document.getElementById('root')
);

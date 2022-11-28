// Working till ui changes

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import "./i18n";
import * as serviceWorker from './serviceWorker';
import './index.css';

ReactDOM.render(
  <BrowserRouter basename="/">
    <App />
  </BrowserRouter>
  , document.getElementById('root'));

serviceWorker.unregister();
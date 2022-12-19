// Working till ui changes

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import "./i18n";
import * as serviceWorker from './serviceWorker';
import './index.css';
import axios from 'axios';
import { toast } from 'react-toastify'




// axios.interceptors.request.use(
//   req => {
//     const token = getToken();
//     if (token) {
//       req.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return req;
//   },
//   error => {
//     return Promise.reject(error)
//   }
// );

axios.interceptors.response.use(
  res => {
    if (res.status === 401) {
      console.log("You are not authorized");
      //redirect
    } else if (res.status === 500) {
      console.log("Internal server error");
    }
    return res;
  },
  error => {
    if (error.response.status === 401) {
      toast.error("Your token is expired please login again")
      localStorage.removeItem('user');
      localStorage.removeItem('userToken');
      localStorage.removeItem('persist:root');
      localStorage.removeItem('userMobileNo')
      window.location.reload()
    }
    return Promise.reject(error);
  }
);

ReactDOM.render(
  <BrowserRouter basename="/">
    <App />
  </BrowserRouter>,
  document.getElementById('root'));

serviceWorker.unregister();
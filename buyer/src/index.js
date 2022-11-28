import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';
import { getToken } from './utils/localstorage';
import { Provider } from 'react-redux';
import './assets/style/style.css';
import './assets/css/app.css';
import { store } from './redux/store';
import { AuthService } from './services/auth';
// combineReducers()

let refreshQueue = [];

axios.interceptors.request.use(
  req => {
    const token = getToken();
    if (token) {
      req.headers['Authorization'] = `Bearer ${token}`;
    }
    return req;
  },
  error => {
    return Promise.reject(error)
  }
);

axios.interceptors.response.use(
  res => {
    if (res.status === 401) {
      console.log("You are not authorized");
      // document.location.href = '/';
      //redirect
    } else if (res.status === 500) {
      console.log("Internal server error");
    }
    return res;
  },
  error => {
    if (error.response.status === 401) {
      localStorage.removeItem('user');
      localStorage.removeItem('userToken');
      localStorage.removeItem('persist:root');
      // if(!error.response.data.message?.match(/wrong password/i) && refreshQueue.length === 0) {
      //   refreshQueue.push(
      //     AuthService.refreshToken()
      //     .then(res => {
      //       refreshQueue.pop();
      //     })
      //   )
      // }
      if(!error.response.data.message?.match(/wrong password/i))
        document.location.href = '/';
    }
    return Promise.reject(error);
  }
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

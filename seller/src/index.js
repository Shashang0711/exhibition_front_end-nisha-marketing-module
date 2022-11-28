import 'react-app-polyfill/stable'
import 'core-js'
import React from 'react'
import { PersistGate } from 'redux-persist/integration/react'
import { createRoot } from 'react-dom/client'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { Provider } from 'react-redux'
import { store, persistor } from './store'
import axios from 'axios';
import './index.css'
import { getToken } from './utils/localstorage'
import '../src/assets/styles/style.css'
import { toast } from 'react-toastify'

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
      //redirect
    } else if (res.status === 500) {
      console.log("Internal server error");
    }
    return res;
  },
  error => {
    if (error.response.status === 401) {
      toast.error("Your token is expired please login agin")
      localStorage.removeItem('user');
      localStorage.removeItem('userToken');
      localStorage.removeItem('persist:root');
      localStorage.removeItem('userMobileNo')
      window.location.reload()
    }
    return Promise.reject(error);
  }
);

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()

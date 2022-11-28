import { getToken, setToken, removeToken } from "./token";
import { getUser, setUser, removeUser } from './user';
import { getMobileNo, setMobileNo, removeMobileNo } from "./mobileNo";

const clearLS = () => {
  const persist = localStorage.getItem('persist:root');
  localStorage.clear();
  localStorage.setItem('persist:root', persist);

  return true;
}

export {
  getToken,
  setToken,
  removeToken,
  getUser,
  getMobileNo,
  setMobileNo,
  removeMobileNo,
  clearLS
};
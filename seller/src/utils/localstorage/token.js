const TOKEN_KEY = 'userToken';

const getToken = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    localStorage.removeItem(TOKEN_KEY);
    return false;
  }
  return token;
};

const setToken = (tokenValue) => {
    localStorage.setItem(TOKEN_KEY, tokenValue);
    return true;
};

const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  return true;
}

export { getToken, setToken, removeToken };

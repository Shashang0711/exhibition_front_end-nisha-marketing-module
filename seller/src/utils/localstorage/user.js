const USER_KEY = 'user';

const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  if (!user) {
    localStorage.removeItem(USER_KEY);
    return false;
  }
  return user;
};

const setUser = (tokenValue) => {
    localStorage.setItem(USER_KEY, tokenValue);
    return true;
};

const removeUser = () => {
  localStorage.removeItem(USER_KEY);
  return true;
}

export { getUser, setUser, removeUser };

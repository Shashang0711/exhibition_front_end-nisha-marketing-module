const getToken = () => {
  const token = localStorage.getItem("userAccess");
  if (!token) {
    localStorage.removeItem("userAccess");
    // log out user rediret to login
    return;
  }
  return token;
};

export { getToken };
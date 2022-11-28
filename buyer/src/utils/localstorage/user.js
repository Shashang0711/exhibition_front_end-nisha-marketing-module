const root = 'persist:root';

const getUser = () => {
  const user = localStorage.getItem(root);
  if (!user) 
    return false;
  const Obj = JSON.parse(user);
  return JSON.parse(Obj.user);
};

export { getUser };

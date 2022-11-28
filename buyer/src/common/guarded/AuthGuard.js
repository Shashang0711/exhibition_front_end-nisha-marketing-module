import { useSelector } from "react-redux";
const AuthGuard = () => {
  const userFromRedux = useSelector((state) => state.user);
  const user = JSON.parse(JSON.stringify(userFromRedux));
  if (user) {
    return true;
  } else {
    return false;
  }
}

export default AuthGuard


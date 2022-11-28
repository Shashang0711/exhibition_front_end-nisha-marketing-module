import { useSelector } from "react-redux";
import { getUserFromRedux } from "src/utils/userFromredux/getUserFromRedux";

export const AuthGuard = () => {
    const userFromRedux = useSelector((state) => state.user);
    const user = getUserFromRedux(userFromRedux)
    if (user) {
        return true;
    } else {
        return false;
    }
}
import { putRequest } from ".";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const USER_URL = '/users';

export const updateProfile = async (payload) => {
    try {
        const localPath = `${USER_URL}/seller/updateProfile`;
        return await putRequest(localPath, payload);
    } catch (error) {
        toast.error(error.response.data.message);
    }
}

export const UserService = {
    updateProfile
};

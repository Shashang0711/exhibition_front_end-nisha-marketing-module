import { getRequest } from ".";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ADD_ON_URL = '/addOn';

const getAddOns = async () => {
  try {
    return await getRequest(ADD_ON_URL)
  } catch (error) {
    toast.error(error.response.data.message);
  }
}

export const AddOnService = {
  getAddOns
};

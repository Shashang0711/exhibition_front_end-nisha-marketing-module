import { getRequest } from ".";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TAG_URL = '/tag';

const getAllTags = async () => {
  try {
    return await getRequest(TAG_URL);
  } catch (error) {
    toast.error(error.response.data.message);
  }
}

export const TagService = {
  getAllTags
};
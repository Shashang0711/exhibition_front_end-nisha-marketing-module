import { getRequest } from ".";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CAT_URL = '/exhCategories';

const getExCategories = async () => {
  try {
    const categoryPath = CAT_URL;
    return await getRequest(categoryPath);
  } catch (error) {
    toast.error(error.response.data.message);
  }
}

export const CatExService = {
    getExCategories
}

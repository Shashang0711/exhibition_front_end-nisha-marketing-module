import { getReqWithoutToken } from ".";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CAT_URL = '/categories';

const getCategories = async () => {
  try {
    const categoryPath = CAT_URL;
    return await getReqWithoutToken(categoryPath);
  } catch (error) {
    toast.error(error.response.data.message);
  }
}

export const CatService = {
  getCategories
}

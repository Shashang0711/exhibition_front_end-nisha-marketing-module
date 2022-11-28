import { getRequest, deleteRequest } from ".";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PROD_IMG_URL = '/productImages';

const getProductImages = async (queryParams) => {
  try {
    const { productId } = queryParams;
    const productImagePath = `${PROD_IMG_URL}?productId=${productId}`;
    return await getRequest(productImagePath);
  } catch (error) {
    toast.error(error.response.data.message);
  }
}

export const prodImgService = {
  getProductImages
};

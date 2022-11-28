import { getRequest } from ".";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const SELLER_URL = '/users/sellers';

const getSellerById = async (sellerId) => {
  try {
    const sellerPath = `${SELLER_URL}/${sellerId}`;
    return await getRequest(sellerPath);
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

export const sellerService = {
  getSellerById
};

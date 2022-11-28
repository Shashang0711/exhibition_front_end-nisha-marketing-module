import { getRequest, postRequest } from ".";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ADD_SELLER_ON_URL = '/sellerAddOns';

const addAddOns = async (payload) => {
  try {
    return await postRequest(ADD_SELLER_ON_URL, payload);
  } catch (error) {
      toast.error(error.response.data.message);
  }
};

const addSingleAddOns = async (payload) => {
  try {
    return await postRequest(`${ADD_SELLER_ON_URL}/addOn`, payload);
  } catch (error) {
      toast.error(error.response.data.message);
  }
};

const getActiveAddOns = async (userId) => {
  try {
    const activeSubPath = `${ADD_SELLER_ON_URL}/${userId}`;
    return await getRequest(activeSubPath);
  } catch (error) {
      toast.error(error.response.data.message);
  }
}

const getActiveAddOnsByStatus = async (userId) => {
  try {
    const activeSubPath = `${ADD_SELLER_ON_URL}/${userId}?status=active`;
    return await getRequest(activeSubPath);
  } catch (error) {
      toast.error(error.response.data.message);
  }
}
export const AddSellerOnService = {
  addAddOns,
  getActiveAddOns,
  addSingleAddOns,
  getActiveAddOnsByStatus
};

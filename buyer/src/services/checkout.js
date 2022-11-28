import { getRequest, postRequest } from ".";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DETAILS_URL = "/buyer-details";
const ORDER_URL = "/order"

const addNewAddress = async (payload) => {
  try {
    const addAddressPath = `${DETAILS_URL}`;
    return await postRequest(addAddressPath, payload);
  } catch (error) {
    toast.error(error.response.data.message);
  }
};
const getAddress = async () => {
  try {
    const getBuyerDetails = `${DETAILS_URL}`;
    return await getRequest(getBuyerDetails);
  } catch (error) {
    toast.error(error.response.data.message);
  }
};
const placeOrder = async (payload) => {
  try {
    const addOrder = `${ORDER_URL}`;
    return await postRequest(addOrder, payload);
  } catch(error) {
    toast.error(error.response.data.message);
  }
}
const getOrders = async() => {
  try {
    const getOrdersPath = `${ORDER_URL}`;
    return await getRequest(getOrdersPath);
  } catch (error) {
    
  }
}
const verifyPayment = async (payload) => {
  try {
    const addOrder = `${ORDER_URL}/verify`;
    return await postRequest(addOrder, payload);
  } catch (error) {
    toast.error(error.response.data.message);
  }
}
export const CheckoutService = {
  addNewAddress,
  getAddress,
  placeOrder,
  getOrders,
  verifyPayment
};

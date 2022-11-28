import { deleteRequest, getRequest, postRequest, putRequest } from ".";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CART_URL = "/cart";

const addProductToCart = async (payload) => {
  try {
    const addToCartPath = `${CART_URL}`;
    return await postRequest(addToCartPath, payload);
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

const getCartItems = async () => {
  try {
    const getCartItemsPath = `${CART_URL}`;
    return await getRequest(getCartItemsPath);
  } catch (error) {
    toast.error(error.response.data.message);
  }
};
const itemQuantityChange = async (payload) => {
    try {
      const itemChangeUrl = `${CART_URL}`;
      return await putRequest(itemChangeUrl, payload);
    } catch (error) {
      toast.error(error.response.data.message);
    }
}
const removeItem = async (id) => {
  try {
    const removeItemUrl = `${CART_URL}/${id}`
    return await deleteRequest(removeItemUrl);
  } catch (error) {
    toast.error(error.response.data.message);
  }
}
const emptyCart = async () => {
  try {
    const emptyUrl = `${CART_URL}`
    return await deleteRequest(emptyUrl);
  } catch (error) {
    toast.error(error.response.data.message);    
  }
}
const checkInCart = async (payload) => {
  try {
    const checkUrl = `${CART_URL}/check-in-cart`;
    return await postRequest(checkUrl, payload)
  } catch (error) {
    
  }
}
const checkStock = async() => {
  try {
    const checkUrl = `${CART_URL}/check-stock`;
    return await postRequest(checkUrl);
  } catch(error) {
    
  }
}
export const CartService = {
  addProductToCart,
  getCartItems,
  itemQuantityChange,
  removeItem,
  emptyCart,
  checkInCart,
  checkStock
};

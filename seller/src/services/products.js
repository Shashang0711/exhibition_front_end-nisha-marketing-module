import { getRequest, postRequest, putRequest, deleteRequest } from ".";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PROD_URL = '/products';

const getAllProducts = async (queryParams) => {
  try {
    const { userId, search } = queryParams;
    const productPath = `${PROD_URL}/getSellerAllProducts?userId=${userId}&search=${search}`;
    return await getRequest(productPath);
  } catch (error) {
    toast.error(error.response.data.message);
  }
}

const getProducts = async (queryParams) => {
  try {
    const { search, pageRecord, pageNo, sortBy, order } = queryParams;
    const productPath = `${PROD_URL}/getSellerProducts?search=${search}&pageRecord=${pageRecord}&pageNo=${pageNo}&sortBy=${sortBy}&order=${order}`;
    return await getRequest(productPath);
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

const getProduct = async (id) => {
  try {
    const productPath = `${PROD_URL}/${id}`;
    return await getRequest(productPath);
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

const addProduct = async (payload) => {
  try {
    return await postRequest(PROD_URL, payload);
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

const updateProduct = async (payload) => {
  try {
    return await putRequest(PROD_URL, payload);
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

const deleteProduct = async (id) => {
  try {
    const productPath = `${PROD_URL}/${id}`;
    return await deleteRequest(productPath);
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

const filePost = async (formData) => {
  try {
    const productPath = `${PROD_URL}/uploadFile/product`;
    return await postRequest(productPath, formData);
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

export const prodService = {
  getAllProducts,
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  filePost
};
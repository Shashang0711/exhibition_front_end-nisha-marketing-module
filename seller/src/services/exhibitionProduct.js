import { getRequest, postRequest, putRequest, deleteRequest } from ".";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EXH_URL = '/exhibitionProduct';

const getExhibitonProduct = async (queryParams) => {
  try {
    const { search, pageRecord, pageNo, exhibitionId, sortBy, order } = queryParams;
    const exhibitionProPath = `${EXH_URL}/search?search=${search}&pageRecord=${pageRecord}&pageNo=${pageNo}&sortBy=${sortBy}&order=${order}&exhibitionId=${exhibitionId}`;
    return await getRequest(exhibitionProPath);
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

const deleteExhibitionProduct = async (id) => {
  try {
    const exhibitionProPath = `${EXH_URL}/${id}`
    return await deleteRequest(exhibitionProPath);
  } catch (error) {
    toast.error(error.response.data.message);
  }
}

const addExhibitonProduct = async (payload) => {
  try {
    return await postRequest(EXH_URL, payload);
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

const updateExhibitionProduct = async (payload) => {
  try {
    return await putRequest(EXH_URL, payload);
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

export const exhProdService = {
  getExhibitonProduct,
  deleteExhibitionProduct,
  addExhibitonProduct,
  updateExhibitionProduct
};

import { getRequest, postRequest, putRequest, deleteRequest } from ".";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EXH_URL = '/exhibition';

const filePost = async (formData) => {
  try {
    const storePath = `${EXH_URL}/uploadFile/exhibition`;
    return await postRequest(storePath, formData);
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

const getExhibitons = async (queryParams) => {
  try {
    const { search, pageRecord, pageNo } = queryParams;
    const exhibitionPath = `${EXH_URL}/getSellerExhibitions?search=${search}&pageRecord=${pageRecord}&pageNo=${pageNo}`;
    return await getRequest(exhibitionPath);
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

const getExhibiton = async (id) => {
  try {
    const exhibitonPath = `${EXH_URL}/${id}`;
    return await getRequest(exhibitonPath);
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

const addExhibiton = async (payload) => {
  try {
    return await postRequest(EXH_URL, payload);
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

const updateExhibition = async (payload) => {
  try {
    return await putRequest(EXH_URL, payload);
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

const deleteExhibition = async (id) => {
  try {
    const exhibitionPath = `${EXH_URL}/${id}`
    return await deleteRequest(exhibitionPath);
  } catch (error) {
    toast.error(error.response.data.message);
  }
}

const sendForApprovalExhibition = async (payload) => {
  try {
    const exhibitionPath = `${EXH_URL}/req-approval`
    return await putRequest(exhibitionPath, payload);
  } catch (error) {
    toast.error(error.response.data.message);
  }
}
const extendExhibiton = async (payload) => {
  try {
    return await putRequest(`${EXH_URL}/extend`, payload);
  } catch (error) {
    toast.error(error.response.data.message);
  }
};



export const exhService = {
  getExhibitons,
  getExhibiton,
  addExhibiton,
  updateExhibition,
  deleteExhibition,
  sendForApprovalExhibition,
  extendExhibiton,
  filePost
};

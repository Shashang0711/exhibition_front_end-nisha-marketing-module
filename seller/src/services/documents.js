import { postRequest, putRequest } from "./index";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const DOC_URL = '/document';

const addDocuments = async (payload) => {
  try {
    return await postRequest(DOC_URL, payload);
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

const uploadIdProof = async (formData) => {
  try {
    const docPath = `${DOC_URL}/uploadIdProof/idproof`;
    return await postRequest(docPath, formData);
  } catch (error) {

    toast.error(error.response.data.message);
  }
};

const uploadPassbook = async (formData) => {
  try {
    const docPath = `${DOC_URL}/uploadPassbook/passbook`;
    return await postRequest(docPath, formData);
  } catch (error) {

    toast.error(error.response.data.message);
  }
};

const updateResubmitDoc = async (formData) => {
  try {
    const docPath = `${DOC_URL}/resubmit`;
    return await putRequest(docPath, formData);
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

export const docService = {
  addDocuments,
  uploadIdProof,
  uploadPassbook,
  updateResubmitDoc
};

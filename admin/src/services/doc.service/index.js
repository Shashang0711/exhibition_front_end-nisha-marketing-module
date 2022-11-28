import Toast from '../../utils/toast';
import { getRequest, putRequest, deleteRequest, postReqWithFormData, postRequest } from '../index';

const docBaseUrl = '/document';

export const getDocuments = async (queryParams) => {
  try {
    const { search, pageRecord, pageNo, status, sortBy, order } = queryParams;
    const localPath = `${docBaseUrl}/search?search=${search}&pageRecord=${pageRecord}&pageNo=${pageNo}&status=${status}&sortBy=${sortBy}&order=${order}`;
    return await getRequest(localPath);
  } catch (error) {
    Toast('error', error.response.data.message);
  }
}

export const approveRejectDocuments = async (payload) => {
  try {
    const localPath = docBaseUrl;
    return await putRequest(localPath, payload);
  } catch (error) {
    Toast('error', error.response.data.message);
  }
}

export const approveRejectID = async (payload) => {
  try {
    const localPath = `${docBaseUrl}/verifyIdProof`;
    return await putRequest(localPath, payload);
  } catch (error) {
    Toast('error', error.response.data.message);
  }
}

export const approveRejectPassbook = async (payload) => {
  try {
    const localPath = `${docBaseUrl}/verifyPassbook`;
    return await putRequest(localPath, payload);
  } catch (error) {
    Toast('error', error.response.data.message);
  }
}

// Handling POST req for IdProof uploading doc image
export const uploadIdProof = async (formData) => {
  try {
    const localPath = docBaseUrl + '/uploadIdProof/idproof';
    return await postReqWithFormData(localPath, formData);
  } catch (error) {
    Toast('error', error.response.data.message);
  }
}

// Handling POST req for IdProof uploading doc image
export const uploadPassbook = async (formData) => {
  try {
    const localPath = docBaseUrl + '/uploadPassbook/passbook';
    return await postReqWithFormData(localPath, formData);
  } catch (error) {
    Toast('error', error.response.data.message);
  }
}

export const addDocuments = async (payload) => {
  try {
    const localPath = docBaseUrl;
    return await postRequest(localPath, payload);
  } catch (error) {
    Toast('error', error.response.data.message);
  }
}

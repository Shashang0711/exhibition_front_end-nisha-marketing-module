import Toast from '../../utils/toast';
import { getRequest, postRequest, putRequest, deleteRequest } from '../index';

const paymentMethodBaseUrl = '/paymentMethod';

// Handling POST req
export const addPaymentMethod = async (payload) => {
    try {
        const localPath = paymentMethodBaseUrl;
        return await postRequest(localPath, payload);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}

export const getPaymentMethods = async (payload) => {
    try {
        const { search, pageRecord, pageNo, sortBy, order } = payload;
        const localPath = `${paymentMethodBaseUrl}/search?search=${search}&pageRecord=${pageRecord}&pageNo=${pageNo}&sortBy=${sortBy}&order=${order}`;
        return await getRequest(localPath);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}

// Handling PUT req
export const updatePaymentMethod = async (payload) => {
    try {
        const localPath = paymentMethodBaseUrl;
        return await putRequest(localPath, payload);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}

// Handling DELETE req
export const deletePaymentMethodFromService = async (id) => {
    try {
        const localPath = `${paymentMethodBaseUrl}/${id}`;
        return await deleteRequest(localPath); 
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}
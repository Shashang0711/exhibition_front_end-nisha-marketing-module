import { getRequest, postRequest, putRequest, deleteRequest } from ".";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PAYMENT_URL = '/seller-payment';


const getStore = async () => {
    try {
        return await getRequest(PAYMENT_URL);
    } catch (error) {
        toast.error(error.response.data.message);
    }
}

const getSellerPayments = async (queryParams) => {
    try {
        const { search, pageRecord, pageNo, sortBy, order } = queryParams;
        const paymentPath = `${PAYMENT_URL}/order?search=${search}&pageRecord=${pageRecord}&pageNo=${pageNo}&sortBy=${sortBy}&order=${order}`;
        return await getRequest(paymentPath);
    } catch (error) {
        toast.error(error.response.data.message);
    }
};


const createOrder = async (payload) => {
    try {
        return await postRequest(PAYMENT_URL + '/order', payload);
    } catch (error) {
        toast.error(error.response.data.message);
    }
};

const paymentRequest = async (payload) => {
    try {
        return await postRequest(PAYMENT_URL + '/verify', payload);
    } catch (error) {
        toast.error(error.response.data.message);
    }
};


const updateStore = async (payload) => {
    try {
        return await putRequest(PAYMENT_URL, payload);
    } catch (error) {
        toast.error(error.response.data.message);
    }
};



const filePost = async (formData) => {
    try {
        const storePath = `${PAYMENT_URL}/uploadFile/storeLogo`;
        return await postRequest(storePath, formData);
    } catch (error) {
        toast.error(error.response.data.message);
    }
};

export const paymentService = {
    createOrder,
    paymentRequest,
    updateStore,
    filePost,
    getStore,
    getSellerPayments
};
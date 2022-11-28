import { getRequest, postRequest, putRequest, deleteRequest } from ".";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const STORE_URL = '/store';


const getStore = async () => {
    try {
        return await getRequest(STORE_URL);
    } catch (error) {
        toast.error(error.response.data.message);
    }
}


const addStore = async (payload) => {
    try {
        return await postRequest(STORE_URL, payload);
    } catch (error) {
        toast.error(error.response.data.message);
    }
};

const updateStore = async (payload) => {
    try {
        return await putRequest(STORE_URL, payload);
    } catch (error) {
        toast.error(error.response.data.message);
    }
};



const filePost = async (formData) => {
    try {
        const storePath = `${STORE_URL}/uploadFile/storeLogo`;
        return await postRequest(storePath, formData);
    } catch (error) {
        toast.error(error.response.data.message);
    }
};

export const storeService = {
    addStore,
    updateStore,
    filePost,
    getStore
};
import { getRequest } from ".";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EXH_URL = '/exhibition';
const STORE_URL = '/store'
const getExhibiton = async (id) => {
    try {
        const exhibitonPath = `${EXH_URL}/${id}`;
        return await getRequest(exhibitonPath);
    } catch (error) {
        toast.error(error.response.data.message);
    }
};
const getStore = async (userId) => {
    try {
        const storePath = `${STORE_URL}/${userId}`;
        return await getRequest(storePath);
    } catch (error) {
        
    }
}

export const exhService = {
    getExhibiton,
    getStore
};

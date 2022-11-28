import { getRequest } from ".";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EXH_PRO_URL = '/exhibitionProduct';



const getExhProduct = async (id) => {
    try {
        const exhibitonPath = `${EXH_PRO_URL}/${id}`;
        return await getRequest(exhibitonPath);
    } catch (error) {
        toast.error(error.response.data.message);
    }
};

export const ExhSingleProService = {
    getExhProduct,

};

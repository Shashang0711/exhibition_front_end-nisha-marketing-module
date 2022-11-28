import { getRequest, postRequest, putRequest, deleteRequest } from ".";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ORD_URL = '/order';

const getOrders = async (queryParams) => {
    try {
        const { search, pageRecord, pageNo, sortBy, order } = queryParams;
        const orderPath = `${ORD_URL}/search?search=${search}&pageRecord=${pageRecord}&pageNo=${pageNo}&sortBy=${sortBy}&order=${order}`;
        return await getRequest(orderPath);
    } catch (error) {
        toast.error(error.response.data.message);
    }
};

export const orderService = {
    getOrders,

};

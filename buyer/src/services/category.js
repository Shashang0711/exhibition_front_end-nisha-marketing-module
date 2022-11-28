import { getRequest } from ".";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EXH_CAT_URL = '/categories';


const getCatExhProduct = async (queryParams) => {
    try {
        const { exhibitionId, categoryId } = queryParams;
        const exhibitionPath = `${EXH_CAT_URL}/categoryWiseExhProducts/${exhibitionId}/${categoryId}`;
        return await getRequest(exhibitionPath);
    } catch (error) {
        toast.error(error.response.data.message);
    }
};


const getExhProductCat = async (id) => {
    try {
        const exhibitonPath = `${EXH_CAT_URL}/exhProductsCategories/${id}`;
        return await getRequest(exhibitonPath);
    } catch (error) {
        toast.error(error.response.data.message);
    }
};


export const CategoryService = {
    getExhProductCat,
    getCatExhProduct

};

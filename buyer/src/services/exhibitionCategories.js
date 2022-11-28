import { getRequest } from ".";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EXH_URL = '/exhCategories';

const getExhibitonCategories = async () => {
    try {
        return await getRequest(EXH_URL);
    } catch (error) {
        toast.error(error.response.data.message);
    }
};

const getExhCatWiseExhibition = async (queryParams) => {
    try {
        const { search, pageRecord, pageNo } = queryParams;
        const exhibitionPath = `${EXH_URL}/categoryWiseExhibitions/search?search=${search}&pageRecord=${pageRecord}&pageNo=${pageNo}`;
        return await getRequest(exhibitionPath);
    } catch (error) {
        toast.error(error.response.data.message);
    }
};

const getExhibitonByCategory = async (id) => {
    try {
        const exhibitonPath = `${EXH_URL}/${id}`;
        return await getRequest(exhibitonPath);
    } catch (error) {
        toast.error(error.response.data.message);
    }
};


export const exhCatService = {
    getExhibitonCategories,
    getExhCatWiseExhibition,
    getExhibitonByCategory

};

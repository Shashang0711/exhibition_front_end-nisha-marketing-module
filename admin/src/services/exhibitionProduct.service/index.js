import Toast from '../../utils/toast';
import { getRequest, postRequest, putRequest, deleteRequest } from '../index';

const exhibitionProductBaseUrl = '/exhibitionProduct';

// Handling POST req
export const addExhProduct = async (payload) => {
    try {
        const localPath = exhibitionProductBaseUrl;
        return await postRequest(localPath, payload);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}

export const getExhProducts = async (payload) => {
    try {
        const { search, pageRecord, pageNo, exhibitionId } = payload;
        const localPath = `${exhibitionProductBaseUrl}/search?search=${search}&pageRecord=${pageRecord}&pageNo=${pageNo}&exhibitionId=${exhibitionId}`;
        return await getRequest(localPath, payload);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}

// Handling PUT req
export const updateExhProduct = async (payload) => {
    try {
        const localPath = exhibitionProductBaseUrl;
        return await putRequest(localPath, payload);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}

// Handling DELETE req
export const deleteExhProductFromServer = async (id) => {
    try {
        const localPath = exhibitionProductBaseUrl + '/' + id;
        return await deleteRequest(localPath);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}
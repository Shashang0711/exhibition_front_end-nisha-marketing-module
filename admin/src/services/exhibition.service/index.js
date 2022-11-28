import Toast from '../../utils/toast';
import { getRequest, postRequest, putRequest, deleteRequest, postReqWithFormData } from '../index';

const exhibitionBaseUrl = '/exhibition';

// Handling GET req
export const getExhibitionFromService = async (id) => {
    try {
        const localPath = exhibitionBaseUrl + '/' + id;
        return await getRequest(localPath);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}

export const addExhibition = async (payload) => {
    try {
        const localPath = exhibitionBaseUrl;
        return await postRequest(localPath, payload);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}

export const getExhibitions = async (queryParams) => {
    try {
        const { search, pageRecord, pageNo } = queryParams;
        const localPath = `${exhibitionBaseUrl}/search?search=${search}&pageRecord=${pageRecord}&pageNo=${pageNo}`;
        return await getRequest(localPath);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}

export const getExhibitionsByStatus = async (queryParams) => {
    try {
        const { search, pageRecord, pageNo, status } = queryParams;
        const localPath = `${exhibitionBaseUrl}/search/status?search=${search}&pageRecord=${pageRecord}&pageNo=${pageNo}&status=${status}`;
        return await getRequest(localPath);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}

export const approveRejectExhibitions = async (payload) => {
    try {
        const localPath = `${exhibitionBaseUrl}/verification`;
        return await putRequest(localPath, payload);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}

// Handling GET req
export const getSellerExhibitions = async (payload) => {
    try {
        const { search, pageRecord, pageNo } = payload;
        let localPath;
        if (localStorage.getItem('sellerId')) {
            const sellerId = localStorage.getItem('sellerId');
            payload.sellerId = sellerId;
            localPath = `${exhibitionBaseUrl}/getSellerExhibitions?search=${search}&pageRecord=${pageRecord}&pageNo=${pageNo}&sellerId=${sellerId}`;
        } else {
            localPath = exhibitionBaseUrl + '/getSellerExhibitions';
        }

        return await getRequest(localPath);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}

// Handling PUT req
export const updateExhibition = async (payload) => {
    try {
        const localPath = exhibitionBaseUrl;
        return await putRequest(localPath, payload);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}

// Handling DELETE req
export const deleteExhibitionFromService = async (id) => {
    try {
        const localPath = exhibitionBaseUrl + '/' + id;
        return await deleteRequest(localPath);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}

export const exhImagePost = async (formData) => {
    try {
        const localPath = exhibitionBaseUrl + '/uploadFile/exhibition';
        return await postReqWithFormData(localPath, formData);
    } catch (error) {

        Toast('error', error.response.data.message);
    }
}
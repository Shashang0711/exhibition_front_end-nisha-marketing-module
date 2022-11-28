import Toast from '../../utils/toast';
import { getRequest, postRequest, postReqWithFormData, putRequest, deleteRequest } from '../index';

const categoryBaseUrl = '/categories';

export const addCategory = async (payload) => {
    try {
        const localPath = categoryBaseUrl;
        return await postRequest(localPath, payload);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}

// Handling get req for fetching categories with pagination
export const getCategories = async (payload) => {
    try {
        const { search, pageRecord, pageNo, sortBy, order } = payload;
        const localPath = `${categoryBaseUrl}/search?search=${search}&pageRecord=${pageRecord}&pageNo=${pageNo}&sortBy=${sortBy}&order=${order}`;
        return await getRequest(localPath);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}

// Handling get for fetching all categories
export const fetchAllCategories = async (payload) => {
    try {
        const localPath = categoryBaseUrl;
        return await getRequest(localPath);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}

// Handling POST req for uploading category image
export const catImagePost = async (formData) => {
    try {
        const localPath = categoryBaseUrl + '/uploadFile/category';
        return await postReqWithFormData(localPath, formData);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}

// Handling PUT req
export const updateCategory = async (payload) => {
    try {
        const localPath = categoryBaseUrl;
        return await putRequest(localPath, payload);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}

// Handling Delete req
export const deleteCategory = async (id) => {
    try {
        const localPath = categoryBaseUrl + '/' + id;
        return await deleteRequest(localPath);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}

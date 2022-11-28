import Toast from '../../utils/toast';
import { deleteRequest, getRequest, postRequest, putRequest } from "..";

const moduleBaseUrl = '/module';

export const addModule = async (payload) => {
    try {
        const localPath = moduleBaseUrl;
        return await postRequest(localPath, payload);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}

export const getModule = async () => {
    try {
        const localPath = moduleBaseUrl;
        return await getRequest(localPath);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}

export const getModulePermission = async (payload) => {
    try {
        const { search, pageRecord, pageNo, sortBy, order } = payload;
        const localPath = `${moduleBaseUrl}/search?search=${search}&pageRecord=${pageRecord}&pageNo=${pageNo}&sortBy=${sortBy}&order=${order}`;
        return await getRequest(localPath);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}

// Handling Delete req
export const deleteModule = async (id) => {
    try {
        const localPath = moduleBaseUrl + '/' + id;
        return await deleteRequest(localPath);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}

// Handling PUT req
export const updateModulePermission = async (id,payload) => {
    try {
        
        const localPath = moduleBaseUrl + '/' +id;
        return await putRequest(localPath, payload);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}
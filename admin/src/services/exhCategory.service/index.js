import Toast from "../../utils/toast";
import { getRequest, postRequest, postReqWithFormData, putRequest, deleteRequest } from "..";

const exhCategoryBaseUrl = '/exhCategories';

export const getExhCategories = async () => {
    try {
        const localPath = exhCategoryBaseUrl;
        return await getRequest(localPath);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
};

export const listExhCategories = async (queryParams) => {
    try {
        const { search, pageNo, pageRecord, sortBy, order } = queryParams;
        const localPath = `${exhCategoryBaseUrl}/search?seacrh=${search}&pageNo=${pageNo}&pageRecord=${pageRecord}&sortBy=${sortBy}&order=${order}`;
        return await getRequest(localPath);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}

export const addExhCategory = async (payload) => {
    try {
        const localPath = exhCategoryBaseUrl;
        return await postRequest(localPath, payload);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}

export const updateExhCategory = async (payload) => {
    try {
        const localPath = exhCategoryBaseUrl;
        return await putRequest(localPath, payload);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}

export const deleteExhCategory = async (id) => {
    try {
        const localPath = `${exhCategoryBaseUrl}/${id}`;
        return await deleteRequest(localPath);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}

export const exhCatImagePost = async (formData) => {
    try {
        const localPath = exhCategoryBaseUrl + '/uploadFile/exhCategory';
        return await postReqWithFormData(localPath, formData);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}
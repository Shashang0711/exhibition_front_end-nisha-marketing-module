import Toast from '../../utils/toast';
import { getRequest, postRequest, putRequest, deleteRequest } from '../index';

const userBaseUrl = '/users';

export const addUser = async (payload) => {
    try {
        const localPath = `${userBaseUrl}/addUsers`;
        return await postRequest(localPath, payload);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}

// Handling POST req for fetching users with pagination/fetching all users/fetching sellers
export const getUsers = async (payload) => {
    try {
        const { search, pageRecord, pageNo } = payload;
        const localPath = `${userBaseUrl}/search?search=${search}&pageRecord=${pageRecord}&pageNo=${pageNo}`;
        return await getRequest(localPath);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}

export const getAllUsers = async (payload) => {
    try {
        const localPath = userBaseUrl;
        return await getRequest(localPath);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}

export const getSellers = async (payload) => {
    try {
        const { search, pageRecord, pageNo, sortBy, order } = payload;
        const localPath = `${userBaseUrl}/sellers/search?search=${search}&pageRecord=${pageRecord}&pageNo=${pageNo}&sortBy=${sortBy}&order=${order}`;
        return await getRequest(localPath);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}

// Handling POST req for fetchin all users/sellers
export const getAllSellers = async (payload) => {
    try {
        const localPath = `${userBaseUrl}/sellers`;
        return await getRequest(localPath);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}

export const getSellerById = async (sellerId) => {
    try {
        const localPath = `${userBaseUrl}/sellers/${sellerId}`;
        return await getRequest(localPath);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}

export const sellerMaster = async (sellerId) => {
    try {
        const localPath = `${userBaseUrl}/sellers/master/${sellerId}`;
        return await getRequest(localPath);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
};

// Handling PUT req
export const updateUser = async (payload) => {
    try {
        const localPath = `${userBaseUrl}/updateUsers`;
        return await putRequest(localPath, payload);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}

// Handling DELETE req
export const deleteUserFromServer = async (id) => {
    try {
        const localPath = `${userBaseUrl}/removeUsers/${id}`;
        return await deleteRequest(localPath);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}
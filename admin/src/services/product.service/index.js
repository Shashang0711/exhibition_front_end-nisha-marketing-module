import Toast from '../../utils/toast';
import { getRequest, postRequest, putRequest, deleteRequest } from '../index';

const productBaseUrl = '/products';

// Handling POST req
export const addProduct = async (payload) => {
    try {
        const localPath = productBaseUrl;
        return await postRequest(localPath, payload);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
 }

export const getSellerProducts = async (payload) => {
    try {
        const { search, pageRecord, pageNo, sellerId } = payload;
        let localPath;
        if (localStorage.sellerId) {
            const sellerId = localStorage.getItem('sellerId');
            payload.sellerId = sellerId;
            localPath = `${productBaseUrl}/getSellerProducts?search=${search}&pageRecord=${pageRecord}&pageNo=${pageNo}&sellerId=${sellerId}`;
        } else {
            localPath = `${productBaseUrl}/getSellerProducts`;
        }
        return await getRequest(localPath);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}

// Handling PUT req
export const updateProduct = async (payload) => {
    try {
        const localPath = productBaseUrl;
        return await putRequest(localPath, payload);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}

// Handling DELETE req
export const deleteProductFromService = async (id) => {
    try {
        const localPath = `${productBaseUrl}/${id}`;
        return await deleteRequest(localPath);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}

// Handling POST req for file upload
export const filePost = async (formData) => {
    try {
        const localPath = `${productBaseUrl}/uploadFile/product`;
        return await postRequest(localPath, formData);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}

// Handling POST req to fetch products of single user
export const getSellerAllProducts = async (payload) => {
    try {
        const { userId, search } = payload;
        const localPath = `${productBaseUrl}/getSellerAllProducts?userId=${userId}&search=${search}`;
        return await getRequest(localPath);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}

// Handling GET req to fetch product by id
export const getProduct = async (id) => {
    try {
        const localPath = `${productBaseUrl}/${id}`;
        return await getRequest(localPath);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}

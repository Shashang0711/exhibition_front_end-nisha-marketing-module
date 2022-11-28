import Toast from '../../utils/toast';
import { getRequest, postReqWithoutToken } from '../index';

const authBaseUrl = '/auth';

export const tokenCheck = async () => {
    try{
        const localPath = authBaseUrl + '/checkAuth';
        return await getRequest(localPath);
    }
    catch (error) {
        Toast('error', error.response.data.message);
    }
}

// Handle login post req
export const AuthPost = async (payload) => {
    try{
        const localPath = authBaseUrl + '/login';
        return await postReqWithoutToken(localPath, payload);
    }
    catch (error) {
        Toast('error', error.response.data.message);
    }
}

// Handle register post req
export const registerSeller = async (payload) => {
    try{
        const localPath = authBaseUrl + '/registerSeller';
        return await postReqWithoutToken(localPath, payload);
    }
    catch (error) {
        Toast('error', error.response.data.message);
    }
}

export const forgotPassword = async (payload) => {
    try {
        const localPath = `${authBaseUrl}/forgot-password`;
        return await postReqWithoutToken(localPath, payload);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}
  
export const resetPassword = async (payload) => {
    try {
        const localPath = `${authBaseUrl}/reset-password`;
        return await postReqWithoutToken(localPath, payload);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}

export const sellerLogInByAdmin = async (sellerId) => {
    try {
        const localPath = `${authBaseUrl}/sellerLogInByAdmin/${sellerId}`;
        return await getRequest(localPath);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}

import { getRequest, postReqWithoutToken, postAllowCookie, postSendCookie } from ".";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AUTH_URL = '/auth';


const userLogin = async (payload) => {
    try {
        const loginPath = `${AUTH_URL}/buyer/login`;
        return await postReqWithoutToken(loginPath, payload);
    } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
    }
};

const getOTP = async (payload) => {
    try {
        const otpPath = `${AUTH_URL}/buyer/req-otp`;
        return await postReqWithoutToken(otpPath, payload);
    } catch (error) {
        toast.error(error.response.data.message);
    }
}

const submitOTP = async (payload) => {
    try {
        const submitOTPPath = `${AUTH_URL}/buyer/submit-otp`;
        return await postReqWithoutToken(submitOTPPath, payload);
    } catch (error) {

        toast.error(error.response.data.message);
    }
}

const registerBuyer = async (payload) => {
    try {
        const registerPath = `${AUTH_URL}/buyer/register`;
        return await postReqWithoutToken(registerPath, payload)
    } catch (error) {
        console.log("error", error)
        toast.error(error.response.data.message);
    }
};

const resendOtp = async (payload) => {
    try {
        const resendPath = `${AUTH_URL}/resend-otp`;
        return await postReqWithoutToken(resendPath, payload)
    } catch (error) {
        console.log("error", error)
        toast.error(error.response.data.message);
    }
};

const tokenCheck = async () => {
    try {
        const localPath = `${AUTH_URL}/checkAuth`;
        return await getRequest(localPath);
    }
    catch (error) {
        toast.error(error.response.data.message);

    }
}
const forgetPassword = async (payload) => {
    try {
        const Path = `${AUTH_URL}/buyer/forgot-password
        `;
        return await postReqWithoutToken(Path, payload)
    } catch (error) {
        console.log("error", error)
        toast.error(error.response.data.message);
    }
};
const resetPassword = async (payload) => {
    try {
        const localPath = `${AUTH_URL}/buyer/reset-password`;
        return await postReqWithoutToken(localPath, payload);
    } catch (error) {
        toast.error(error.response.data.message);
    }
}
const refreshToken = async () => {
    try {
        const localPath = `${AUTH_URL}/refresh-token`;
        return await postSendCookie(localPath);

    } catch (error) {
        toast.error(error.response.data.message);
        localStorage.removeItem('persist:root');
        document.location.href = '/';
    }
}



export const AuthService = {
    userLogin,
    getOTP,
    submitOTP,
    registerBuyer,
    tokenCheck,
    resendOtp,
    forgetPassword,
    resetPassword,
    refreshToken
};

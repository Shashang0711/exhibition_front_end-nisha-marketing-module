import { getRequest, getReqWithoutToken, postReqWithoutToken } from ".";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AUTH_URL = '/auth';


const userLogin = async (payload) => {
  try {
    const loginPath = `${AUTH_URL}/seller/login`;
    return await postReqWithoutToken(loginPath, payload);
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

const getOTP = async (payload) => {
  try {
    const otpPath = `${AUTH_URL}/req-otp`;
    return await postReqWithoutToken(otpPath, payload);
  } catch (error) {
    toast.error(error.response.data.message);
  }
}

const submitOTP = async (payload) => {
  try {
    const submitOTPPath = `${AUTH_URL}/submit-otp`;
    return await postReqWithoutToken(submitOTPPath, payload);
  } catch (error) {
    toast.error(error.response.data.message);
  }
}

const registerSeller = async (payload) => {
  try {
    const registerPath = `${AUTH_URL}/registerSeller`;
    return await postReqWithoutToken(registerPath, payload)
  } catch (error) {
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
    const Path = `${AUTH_URL}/forgot-password
      `;
    return await postReqWithoutToken(Path, payload)
  } catch (error) {

    toast.error(error.response.data.message);
  }
};
export const resetPassword = async (payload) => {
  try {
    const localPath = `${AUTH_URL}/reset-password`;
    return await postReqWithoutToken(localPath, payload);
  } catch (error) {
    toast.error(error.response.data.message);
  }
}

const resendOtp = async (payload) => {
  try {
    const resendPath = `${AUTH_URL}/resend-otp`;
    return await postReqWithoutToken(resendPath, payload)
  } catch (error) {

    toast.error(error.response.data.message);
  }
};



export const AuthService = {
  userLogin,
  getOTP,
  submitOTP,
  registerSeller,
  tokenCheck,
  resetPassword,
  forgetPassword,
  resendOtp
};

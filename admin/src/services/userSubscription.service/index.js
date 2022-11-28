import Toast from "../../utils/toast";
import { getRequest, postRequest, putRequest, deleteRequest } from "../index";

const userSubBaseUrl = '/userSubscription';

export const buySubscription = async (payload) => {
  try {
    const localPath = userSubBaseUrl;
    return await postRequest(localPath, payload);
  } catch (error) {
    Toast('error', error.response.data.message);
  }
}

export const getUserSubscription = async (userId) => {
  try {
    const localPath = `${userSubBaseUrl}/${userId}`;
    return await getRequest(localPath);
  } catch (error) {
    Toast('error', error.response.data.message);
  }
}

export const getActiveSubscriptions = async (userId) => {
  try {
    const localPath = `${userSubBaseUrl}/activeSubscriptions/${userId}`;
    return await getRequest(localPath);
  } catch (error) {
    Toast('error', error.response.data.message);
  }
}

export const getAllPurchasedSubData = async (userId) => {
  try {
    const localPath = `${userSubBaseUrl}/getAllPurchasedSubscriptions/${userId}`;
    return await getRequest(localPath);
  } catch (error) {
    Toast('error', error.response.data.message);
  }
}

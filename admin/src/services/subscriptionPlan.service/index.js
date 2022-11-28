import Toast from "../../utils/toast";
import { getRequest, postRequest } from "../index";

const subBaseUrl = '/subscriptionPlan';

export const addSubscriptionPlan = async (payload) => {
  try {
    const localPath = subBaseUrl;
    return await postRequest(localPath, payload);
  } catch (error) {
    Toast('error', error.response.data.message);
  }
}

export const getAllSubscriptionPlans = async () => {
  try {
    const localPath = subBaseUrl;
    return await getRequest(localPath);
  } catch (error) {
    Toast('error', error.response.data.message);
  }
}

export const getSubsciptionPlan = async (id) => {
  try {
    const localPath = `${subBaseUrl}/${id}`;
    return await getRequest(localPath);
  } catch (error) {
    Toast('error', error.response.data.message);
  }
}

import { getRequest, postRequest } from ".";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const USER_SUB_URL = '/userSubscription';

const getUserSubscription = async (userId) => {
  try {
    const userSubPath = `${USER_SUB_URL}/${userId}`;
    return await getRequest(userSubPath);
  } catch (error) {
      toast.error(error.response.data.message);
  }
}

const getActiveSubscriptions = async (userId) => {
  try {
    const activeSubPath = `${USER_SUB_URL}/activeSubscriptions/${userId}`;
    return await getRequest(activeSubPath);
  } catch (error) {
      toast.error(error.response.data.message);
  }
}

const buySubscription = async (payload) => {
  try {
    // const userSubPath = `${USER_SUB_URL}`
    return await postRequest(USER_SUB_URL, payload);
  } catch (error) {
      toast.error(error.response.data.message);
  }
}

export const UserSubscriptionService = {
  getUserSubscription,
  getActiveSubscriptions,
  buySubscription
};

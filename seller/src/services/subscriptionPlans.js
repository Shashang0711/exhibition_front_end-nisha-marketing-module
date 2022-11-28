import { getReqWithoutToken, getRequest } from '.';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SUB_PLAN_URL = `/subscriptionPlan`;

const getSubscriptionPlans = async () => {
  try {
    return await getReqWithoutToken(SUB_PLAN_URL);
  } catch (error) {
     toast.error(error.response.data.message);
  }
}

const getSubscriptionById = async (id) => {
  try {
    const subPlanPath = `${SUB_PLAN_URL}/${id}`;
    return await getRequest(subPlanPath);
  } catch (error) {
     toast.error(error.response.data.message);
  }
}

export const SubPlanService = {
  getSubscriptionPlans,
  getSubscriptionById
};

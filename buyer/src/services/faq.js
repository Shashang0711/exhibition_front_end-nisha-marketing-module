import { getRequest } from ".";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FAQ_URL = '/faqs';

export const getFaq = async () => {
    try {
        return await getRequest(FAQ_URL);
    } catch (error) {
        toast.error(error.response.data.message);
    }
}

export const FaqService = {
    getFaq
};

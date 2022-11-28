import Toast from "../../utils/toast";
import { getRequest, postRequest, putRequest, deleteRequest } from "..";

const faqBaseUrl = '/faqs';

export const addFAQ = async (payload) => {
    try {
        const localPath = faqBaseUrl;
        return await postRequest(localPath, payload)
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}

export const getFAQs = async () => {
    try {
        const localPath = faqBaseUrl;
        return await getRequest(localPath);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}

export const updateFAQ = async (payload) => {
    try {
        const localPath = faqBaseUrl;
        return await putRequest(localPath, payload);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}

export const deleteFAQ = async (id) => {
    try {
        const localPath = `${faqBaseUrl}/${id}`;
        return await deleteRequest(localPath);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}

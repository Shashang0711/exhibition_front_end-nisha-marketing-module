import Toast from '../../utils/toast';
import { getRequest } from '../index';

const tagBaseUrl = '/tag';

// Handling POST req for fetching all tags
export const getAllTags = async (payload) => {
    try {
        const localPath = tagBaseUrl;
        return await getRequest(localPath);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}
import Toast from '../../utils/toast';
import { getRequest, deleteRequest } from '../index';

const productImagesBaseUrl = '/productImages';

// Handling POST req to get a product's images
export const getProductImages = async (payload) => {
    try {
        const { productId } = payload;
        const localPath = `${productImagesBaseUrl}?productId=${productId}`;
        return await getRequest(localPath, payload);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
};

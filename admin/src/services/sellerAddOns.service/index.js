import Toast from "../../utils/toast";
import { getRequest } from "..";

const sellerAddOnBaseUrl = '/sellerAddOns';

export const getAllPurchasedAddOnData = async (sellerId) => {
    try {
        const localPath = `${sellerAddOnBaseUrl}/getAllPurchasedAddOns/${sellerId}`;
        return await getRequest(localPath);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}

export const getActiveAddOns = async (sellerId) => {
    try {
        const localPath = `${sellerAddOnBaseUrl}/${sellerId}`;
        return await getRequest(localPath);
    } catch (error) {
        console.log(error);
        Toast('error', error.response.data.message);
    }
}

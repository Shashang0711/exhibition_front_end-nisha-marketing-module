import { getReqWithoutTokens } from ".";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { countryStateCityApi } from "src/constants/constants";



const getStateCityCountry = async () => {
    try {
        const stateCityCountryPath = `${countryStateCityApi}`;
        return await getReqWithoutTokens(stateCityCountryPath);
    } catch (error) {
        toast.error(error.response.data.message);
    }
};



export const stateCityCountryService = {
    getStateCityCountry,

};

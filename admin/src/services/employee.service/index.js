import { deleteRequest, getRequest, postRequest, putRequest } from "..";
import Toast from "../../utils/toast";

const employeeBaseUrl = '/admin'

export const getEmployees = async (payload) => {
    try {
        const { search, pageRecord, pageNo, sortBy, order } = payload;
        const localPath = `${employeeBaseUrl}/search?search=${search}&pageRecord=${pageRecord}&pageNo=${pageNo}&sortBy=${sortBy}&order=${order}`;
        return await getRequest(localPath);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}

export const deleteEmployeeService = async (id) => {
    try {
        const localPath = employeeBaseUrl + '/' + id;
        return await deleteRequest(localPath);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}

// Handling PUT req
export const updateEmployeeService = async (id, payload) => {
    try {

        const localPath = employeeBaseUrl + '/' + id;
        return await putRequest(localPath, payload);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}


export const addEmployeeService = async (payload) => {
    try {
        const localPath = employeeBaseUrl;
        return await postRequest(localPath, payload);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}


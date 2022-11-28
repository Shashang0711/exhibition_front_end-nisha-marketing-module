import Toast from '../../utils/toast';
import { deleteRequest, getRequest, postRequest, putRequest } from '../index';

const rolePermissionBaseUrl = '/role';

export const addRolePermission = async (payload) => {
    try {
        const localPath = rolePermissionBaseUrl;
        return await postRequest(localPath, payload);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}

export const getRolePermission = async (payload) => {
    try {
        const { search, pageRecord, pageNo, sortBy, order } = payload;
        const localPath = `${rolePermissionBaseUrl}/search?search=${search}&pageRecord=${pageRecord}&pageNo=${pageNo}&sortBy=${sortBy}&order=${order}`;
        return await getRequest(localPath);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}


export const getRolePermissions = async () => {
    try {
        const localPath = rolePermissionBaseUrl;
        return await getRequest(localPath);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}




// Handling Delete req
export const deleteRole = async (id) => {
    try {
        const localPath = rolePermissionBaseUrl + '/' + id;
        return await deleteRequest(localPath);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}

// Handling PUT req
export const updateRolePermission = async (id, payload) => {
    try {

        const localPath = rolePermissionBaseUrl + '/' + id;
        return await putRequest(localPath, payload);
    } catch (error) {
        Toast('error', error.response.data.message);
    }
}



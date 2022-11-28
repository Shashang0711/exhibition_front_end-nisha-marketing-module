import axios from "axios";
import { baseUrl, countryStateCityApi } from "src/constants/constants";
import { getToken } from "src/utils/localstorage";

// Handling GET request
const getRequest = async (path) => {
  const USER_TOKEN = getToken();
  const AXIOS_CONFIG = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: USER_TOKEN,
    }
  };
  const API_ENDPOINT = `${baseUrl}${path}`;
  return await axios.get(API_ENDPOINT, AXIOS_CONFIG);
}

const getReqWithoutToken = async (path) => {
  const AXIOS_CONFIG = {
    headers: {
      "Access-Control-Allow-Origin": "*",
    }
  };
  const API_ENDPOINT = `${baseUrl}${path}`;
  return await axios.get(API_ENDPOINT, AXIOS_CONFIG);
}

const getReqWithoutTokens = async (path) => {
  // const AXIOS_CONFIG = {
  //   headers: {
  //     "Access-Control-Allow-Origin": "*",
  //   }
  // };
  const API_ENDPOINT = `${path}`;
  return await axios.get(API_ENDPOINT);
}



// Handling POST request
const postRequest = async (path, payload) => {
  const USER_TOKEN = getToken();
  const AXIOS_CONFIG = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: USER_TOKEN,
    }
  };
  const API_ENDPOINT = `${baseUrl}${path}`;
  return await axios.post(API_ENDPOINT, payload, AXIOS_CONFIG);
};

const postReqWithFormData = async (path, formData) => {
  const USER_TOKEN = getToken();
  const AXIOS_CONFIG = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: USER_TOKEN,
    }
  };
  const API_ENDPOINT = `${baseUrl}${path}`;
  return await axios.post(API_ENDPOINT, formData, AXIOS_CONFIG);
}

const postReqWithoutToken = async (path, payload) => {
  const AXIOS_CONFIG = {
    headers: {
      "Access-Control-Allow-Origin": "*",
    }
  };
  const API_ENDPOINT = `${baseUrl}${path}`;
  return await axios.post(API_ENDPOINT, payload, AXIOS_CONFIG);
}

// Handling PUT request
const putRequest = async (path, payload) => {
  const USER_TOKEN = getToken();
  const AXIOS_CONFIG = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: USER_TOKEN,
    }
  };
  const API_ENDPOINT = `${baseUrl}${path}`;
  return await axios.put(API_ENDPOINT, payload, AXIOS_CONFIG);
}

const putReqWithFormData = async (path, formData) => {
  const USER_TOKEN = getToken();
  const AXIOS_CONFIG = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: USER_TOKEN,
    }
  };
  const API_ENDPOINT = `${baseUrl}${path}`;
  return await axios.put(API_ENDPOINT, formData, AXIOS_CONFIG);
}

// Handling DELETE request
const deleteRequest = async (path) => {
  const USER_TOKEN = getToken();
  const AXIOS_CONFIG = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: USER_TOKEN,
    }
  };
  const API_ENDPOINT = `${baseUrl}${path}`;
  return await axios.delete(API_ENDPOINT, AXIOS_CONFIG);
}

export {
  getRequest,
  getReqWithoutToken,
  postRequest,
  postReqWithFormData,
  postReqWithoutToken,
  putRequest,
  putReqWithFormData,
  deleteRequest,
  getReqWithoutTokens
};

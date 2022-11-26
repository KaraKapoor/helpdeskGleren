import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import Swal from "sweetalert2";
import config from "../../config/apiConfig.json";

const _baseUrl = config.general.baseUrl;
let requestCount = 0;
export  const RequestMethod ={
    GET : "GET",
    POST : "POST",
    PUT : "PUT",
    PATCH : "PATCH",
    DELETE : "DELETE",
  }

  export const Headers= {
    AUTHORIZATION : "Authorization",
    CONTENTTYPE :"Content-Type",
  }

  const appClient = axios.create({
    baseURL: _baseUrl,
    headers: {
      Accept: "application/json",
    },
  });

  appClient.interceptors.request.use(
  function (config) {
    const value = localStorage.getItem("accessToken");
    config.headers["Authorization"] =`Bearer ${value}`;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

  export const appRequest = (
    options,
    { showToast = true, fullResponse = false, afterSuccess = () => { } } = {}
  ) => {
    requestCount++;
    const onSuccess = function (response) {
      afterSuccess && afterSuccess();
      if (response && response.data) {
        return fullResponse ? response : response.data;
      } else {
        return false;
      }
    };
    
    const onError = (error) => {
      let errorMessage = {
        title: "Error",
        message:
          error?.error ||
          "Something went wrong, please try again later.",
        status: false,
        httpStatusCode: error.response?.data?.httpStatusCode || 500,
      };
  
    
      if (showToast) {
       
        Swal.fire({
          icon: 'error',
          title: errorMessage.title,
          text: errorMessage.message,
          showCloseButton: true,
          showConfirmButton: true,
          width:400,}
        )
      }
      
      if (errorMessage.httpStatusCode == 401) {
        // clear storage and redux
        localStorage.clear();
        window.location='/session/signin';
   
      }
      return Promise.reject(errorMessage);
    };
  
    return appClient(options).then(onSuccess).catch(onError);
  };

  
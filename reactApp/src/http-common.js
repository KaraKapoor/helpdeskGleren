import axios from "axios";

export const baseURL = "http://localhost:8080"; //used this as separate to get the base url for callback api.
const axiosApiInstance = axios.create();
// axiosApiInstance({
//   baseURL: "http://localhost:8080",
//   headers: {
//     "Content-type": "application/json",
//   },
// });
axiosApiInstance.defaults.baseURL = "http://localhost:8080";
axiosApiInstance.interceptors.request.use(
  async config => {
    const value = sessionStorage.getItem("jwtToken");
    config.headers = {
      'Authorization': `Bearer ${value}`,
      "Content-type": "application/json",
    }
    return config;
  },
  error => {
    Promise.reject(error)
  });
// Response interceptor for API calls
axiosApiInstance.interceptors.response.use((response) => {
  return response
}, async function (error) {
  const originalRequest = error.config;
  if (error.response.status === 401) {
    window.location.href = baseURL + '/login';
  }
  return Promise.reject(error);
});
export default axiosApiInstance;
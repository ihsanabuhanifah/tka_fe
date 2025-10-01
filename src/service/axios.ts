import axios from "axios";
import Cookies from "js-cookie";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_SERVICE as string,
  timeout: 1000 * 60 * 3,
});

axiosClient.interceptors.request.use(
  function (config) {
    // Do something before request is sent

    config.headers["Authorization"] = `Bearer ${Cookies.get("tka_token")}`;
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (401 === error?.response?.status) {
      clearToken();
    } else {
      return Promise.reject(error);
    }
  }
);

export const clearToken = () => {
  delete axiosClient.defaults.headers["tka_token"];
  Cookies.remove("tka_token");

  window.location.replace("/login");
};
export default axiosClient;

// https://mysmk.herokuapp.com

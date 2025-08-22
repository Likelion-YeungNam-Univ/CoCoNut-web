import axios from "axios";

const api = axios.create({
  baseURL: "http://15.165.164.49:8080/api/v1/",
  withCredentials: true,
});



api.interceptors.request.use(
  (config) => {
    const accessToken = sessionStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
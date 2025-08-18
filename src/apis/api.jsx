import axios from "axios";

const api = axios.create({
  baseURL: "http://15.165.164.49:8080/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default api;
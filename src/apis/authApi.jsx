import axios from "axios";

/**권한이 필요한 axios 객체(Access Token 포함) */
const authApi = (accessToken) =>
  axios.create({
    baseURL: "http://13.209.41.51:8080/api/v1/",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    withCredentials: true,
  });
export default authApi;

 import api from "./api";

 // GET /users/check-email?email=xxx@example.com  형태로 호출
 const emailcheckApi = async (email) => {
   const { data } = await api.get("users/check-email", {
    params: { email },
   });
   return data; 
 };

 export default emailcheckApi
 import api from "./api";

 // GET /users/check-email?email=xxx@example.com  형태로 호출
 const nicknamecheckApi = async (nickname) => {
   const { data } = await api.get("users/check-nickname", {
    params: { nickname },
   });
   return data; 
 };

 export default nicknamecheckApi
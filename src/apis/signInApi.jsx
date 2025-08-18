import api from "./api";

/**로그인 API */
const signInApi = async (body) => {
  try {
    const response = await api.post("users/login", body);
    return response.data;
  } catch (err) {
    if (err.response?.data?.message) {
      // 1️⃣ 서버가 명확한 에러 메시지를 준 경우
      throw new Error(err.response.data.message);
    } else if (err.response) {
      // 2️⃣ 서버가 응답은 했지만, 에러 메시지가 없는 경우
      throw new Error(`오류 발생 (status: ${err.response.status})`);
    } else if (err.request) {
      // 3️⃣ 요청은 보냈지만 서버로부터 응답이 없음 (ex. 서버 꺼짐)
      throw new Error("서버로부터 응답이 없습니다.");
    } else {
      // 4️⃣ 요청 자체에 문제가 있음 (ex. 코드 오류)
      throw new Error("요청 중 알 수 없는 오류가 발생했습니다.");
    }
  }
};

export default signInApi;

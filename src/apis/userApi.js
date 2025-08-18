import authApi from "./authApi";

// 내 정보 조회 API
export const fetchUserInfo = async () => {
  try {
    const token = sessionStorage.getItem("accessToken");
    if (!token) throw new Error("로그인이 필요합니다.");

    const api = authApi(token);
    const res = await api.get("users");
    return res.data;
  } catch (error) {
    console.error("사용자 정보 조회 실패:", error);
    throw error;
  }
};

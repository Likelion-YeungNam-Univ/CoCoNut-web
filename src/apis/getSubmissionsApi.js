// apis/getSubmissionsApi.js
import authApi from "./authApi";

// 특정 공모전의 작품 목록 조회 API
export const fetchSubmissions = async (projectId) => {
  try {
    const token = sessionStorage.getItem("accessToken");
    if (!token) throw new Error("로그인이 필요합니다.");

    const api = authApi(token);
    const res = await api.get(`/projects/${projectId}/submissions`);
    return res.data;
  } catch (error) {
    console.error("작품 목록 조회 실패:", error);
    throw error;
  }
};

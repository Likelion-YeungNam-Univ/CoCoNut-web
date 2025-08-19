import authApi from "./authApi";

// 작품 상세 조회 API
export const fetchSubmissionDetail = async (submissionId) => {
  try {
    const token = sessionStorage.getItem("accessToken");
    if (!token) throw new Error("로그인이 필요합니다.");
    const api = authApi(token);
    const res = await api.get(`submissions/${submissionId}`);
    return res.data;
  } catch (error) {
    console.error("작품 상세 조회 실패:", error);
    throw error;
  }
};

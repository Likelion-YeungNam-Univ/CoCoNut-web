import authApi from "./authApi";

export const checkSubmissionValid = async (projectId) => {
  try {
    const token = sessionStorage.getItem("accessToken");
    const api = authApi(token);
    const res = await api.get(`/projects/${projectId}/submissions/valid`);
    return res.data;
  } catch (error) {
    console.error("작품 제출 자격 검증 실패:", error);
    throw error;
  }
};

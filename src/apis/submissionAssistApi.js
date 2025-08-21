import authApi from "./authApi";

// AI 작품 설명 생성 API
export const fetchAiDescription = async (prompt) => {
  try {
    const token = sessionStorage.getItem("accessToken");
    const api = authApi(token);
    const res = await api.post("submissions/assist", { prompt });
    return res.data;
  } catch (error) {
    console.error("AI 설명 생성 실패:", error);
    throw error;
  }
};

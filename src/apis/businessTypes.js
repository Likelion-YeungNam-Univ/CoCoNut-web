import api from "./api";

export const getBusinessTypes = async () => {
  try {
    const response = await api.get("enums/businessTypes");
    return response.data; // [{ code, description }]
  } catch (error) {
    console.error("업종 목록 조회 실패:", error);
    throw error;
  }
};

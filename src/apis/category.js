import api from "./api";

export const fetchCategories = async () => {
  try {
    const res = await api.get("enums/categories");
    return res.data; // [{ code, description }]
  } catch (error) {
    console.error("카테고리 목록 조회 실패:", error);
    throw error;
  }
};

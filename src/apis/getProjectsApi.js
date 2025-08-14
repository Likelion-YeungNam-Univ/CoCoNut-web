import api from "./api";

// 프로젝트(공모전) 목록 조회 API
export const fetchProjects = async () => {
  try {
    const res = await api.get("projects");
    return res.data;
  } catch (error) {
    console.error("프로젝트 목록 조회 실패:", error);
    throw error;
  }
};

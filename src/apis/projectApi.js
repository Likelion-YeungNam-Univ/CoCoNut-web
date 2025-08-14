import api from "./api";

// 프로젝트(공모전) 목록 조회 API
export const fetchProjects = async () => {
  try {
    const token = localStorage.getItem("accessToken"); // 로그인 시 저장한 토큰 꺼내기

    const res = await api.get("projects", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("프로젝트 목록 조회 실패:", error);
    throw error;
  }
};

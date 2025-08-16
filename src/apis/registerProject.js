import api from "./api"; // api.jsx에서 생성한 인스턴스를 가져옵니다.

export const registerProject = async (projectData) => {
  try {
    // axios.post 대신 api.post를 사용합니다.
    // baseURL과 헤더 설정이 api 인스턴스에 이미 포함되어 있으므로,
    // URL은 상대 경로("/projects")로, 헤더는 별도로 지정하지 않아도 됩니다.
    const response = await api.post("/projects", projectData);

    // 이 부분은 서버 응답에 따라 변경될 수 있습니다.
    return response.data;
  } catch (error) {
    console.error("Project registration failed:", error);
    throw error;
  }
};

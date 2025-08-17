import api from "./api"; // api.jsx에서 생성한 인스턴스를 가져옵니다.

export const registerProject = async (projectData) => {
  try {
    const response = await api.post("/projects", projectData);

    return response;
  } catch (error) {
    console.error("Project registration failed:", error);
    throw error;
  }
};

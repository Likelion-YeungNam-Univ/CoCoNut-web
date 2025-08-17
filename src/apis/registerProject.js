import api from "./api";

export const registerProject = async (projectData) => {
  try {
    const response = await api.post("/projects", projectData);

    return response;
  } catch (error) {
    console.error("Project registration failed:", error);
    throw error;
  }
};

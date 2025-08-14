import api from "./api";

export const registerProject = async (formData) => {
  try {
    const response = await api.post("/projects", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Project registration failed:", error);
    throw error;
  }
};

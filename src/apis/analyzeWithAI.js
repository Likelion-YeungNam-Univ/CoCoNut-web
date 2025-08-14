import api from "./api";

export const analyzeProjectWithAI = async (assistanceText) => {
  try {
    const response = await api.post("/projects/assist", {
      prompt: assistanceText,
    });
    return response.data;
  } catch (error) {
    console.error("AI analysis error:", error);
    throw error;
  }
};

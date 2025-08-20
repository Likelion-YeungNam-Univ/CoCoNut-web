import authApi from "./authApi";

export const submitProject = async (
  projectId,
  { title, description, link, image }
) => {
  try {
    const token = sessionStorage.getItem("accessToken");
    const api = authApi(token || "");

    const formData = new FormData();

    const info = { title };
    if (description?.trim()) info.description = description;
    if (link?.trim()) info.relatedUrl = link;

    formData.append(
      "info",
      new Blob([JSON.stringify(info)], { type: "application/json" })
    );
    if (image) formData.append("image", image);

    const headers = { "Content-Type": "multipart/form-data" };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await api.post(`/projects/${projectId}/submissions`, formData, {
      headers,
    });

    return res.data;
  } catch (error) {
    console.error("제출 실패:", error.response?.data || error.message);
    throw error;
  }
};

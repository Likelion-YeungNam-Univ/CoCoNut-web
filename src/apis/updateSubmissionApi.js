import authApi from "./authApi";

// 작품 수정 API
export const updateSubmission = async (
  submissionId,
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

    const res = await api.put(`/submissions/${submissionId}`, formData, {
      headers,
    });

    return res.data;
  } catch (error) {
    console.error("작품 수정 실패:", error.response?.data || error.message);
    throw error;
  }
};

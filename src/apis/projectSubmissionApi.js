import authApi from "./authApi";

export const submitProject = async (
  projectId,
  { title, description, link, image }
) => {
  try {
    const token = sessionStorage.getItem("accessToken");
    if (!token) throw new Error("로그인이 필요합니다.");

    const api = authApi(token);

    const formData = new FormData();

    // info 객체 구성 - 값이 있는 경우만 추가
    const info = { title }; // title은 필수
    if (description && description.trim() !== "") {
      info.description = description;
    }
    if (link && link.trim() !== "") {
      info.relatedUrl = link;
    }

    // JSON blob으로 감싸서 append
    formData.append(
      "info",
      new Blob([JSON.stringify(info)], { type: "application/json" })
    );

    // 이미지 파일이 있으면 추가
    if (image) {
      formData.append("image", image);
    }

    const res = await api.post(`/projects/${projectId}/submissions`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error) {
    console.error("제출 실패:", error.response?.data || error.message);
    throw error;
  }
};

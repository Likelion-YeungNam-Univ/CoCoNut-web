import api from "./api";
import authApi from "./authApi";

/** 공통: 서버 응답을 배열로 정규화 */
const normalizeList = (data) => {
  if (Array.isArray(data)) return data; // 배열
  if (Array.isArray(data?.content)) return data.content; // pageable
  if (
    data &&
    typeof data === "object" &&
    ("submissionId" in data || "id" in data)
  ) {
    return [data]; // 단일 객체
  }
  return [];
};

/** 작품 제출(참가자) - POST /api/v1/projects/{projectId}/submissions */
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

/** 특정 프로젝트 제출물 목록 - GET /api/v1/projects/{projectId}/submissions */
export const getProjectSubmissions = async (projectId, opts = {}) => {
  const { page = 0, size = 1000, signal } = opts;
  const { data } = await api.get(`/projects/${projectId}/submissions`, {
    params: { page, size },
    signal,
    withCredentials: true,
  });
  return normalizeList(data);
};

/** 전체 제출물 - GET /api/v1/submissions */
export const fetchAllSubmissions = async (opts = {}) => {
  const { page = 0, size = 1000, signal } = opts;
  const { data } = await api.get("/submissions", {
    params: { page, size },
    signal,
    withCredentials: true,
  });
  console.log(normalizeList(data));
  return normalizeList(data);
};

/** 작품 상세 - GET /api/v1/submissions/{submission_id} */
export const fetchSubmissionDetail = async (submissionId, opts = {}) => {
  const { signal } = opts;
  const { data } = await api.get(`/submissions/${submissionId}`, {
    signal,
    withCredentials: true,
  });
  return data; // {submissionId, projectId, userId, title, relatedUrl, imageUrl, submittedAt, writer, ...}
};

// 호환용 별칭
export const fetchProjectSubmissions = getProjectSubmissions;

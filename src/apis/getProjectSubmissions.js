// src/apis/getProjectSubmissions.js
import api from "./api";

/** 프로젝트별 제출물 목록 조회 (pageable 응답/배열 둘 다 흡수) */
export const fetchProjectSubmissions = async (projectId) => {
  const { data } = await api.get(`/projects/${projectId}/submissions`, {
    // 스프링 기본 pageable을 쓴다면 size 크게 주기 (내 제출물이 2페이지에 있을 수 있음)
    params: { size: 1000 },
  });

  // 배열로 오거나 {content: [...]}로 오거나 모두 대응
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  return [];
};
s
// src/apis/rewardsApi.js
import api from "./api";

/**
 * 우승작 확정 (소상공인 전용)
 * Swagger: POST /api/v1/rewards/award/project/{projectId}/submission/{submissionId}

 */
export async function selectWinner(projectId, submissionId) {
  const pid = Number(projectId);
  const sid = Number(submissionId);
  if (!Number.isFinite(pid) || !Number.isFinite(sid)) {
    throw new Error("selectWinner: invalid ids");
  }

  const url = `/rewards/award/project/${pid}/submission/${sid}`;
  const res = await api.post(url); // ⚠️ body 생략!
  return res?.data;                // Reward JSON
}

/**
 * 내가 수상한 공모전 목록
 * GET /rewards/me/awards
 */
export async function getMyAwards() {
  const { data } = await api.get(`/rewards/me/awards`, {
    withCredentials: true,
  });

  return Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
}

/**
 * 내가 수상한 공모전 개수
 * GET /rewards/me/awards/count
 */
export async function getMyAwardsCount() {
  const { data } = await api.get(`/rewards/me/awards/count`, {
    withCredentials: true,
  });
  if (typeof data === "number") return data;
  return Number(data?.count ?? 0);
}

/**
 * 수상 목록을 submissionId Set으로 변환
 * - 다양한 응답 키(submissionId, submission_id, submission.id 등) 지원
 */
export function toAwardedSubmissionIdSet(awards = []) {
  const s = new Set();
  for (const a of awards) {
    const raw =
      a?.submissionId ??
      a?.submission_id ??
      a?.submission?.id ??
      a?.submission?.submissionId ??
      null;
    const id = Number(raw);
    if (Number.isFinite(id)) s.add(id);
  }
  return s;
}

/** 과거 이름 호환용(이미 사용 중인 곳이 있다면 유지) */
export const fetchMyAwards = getMyAwards;

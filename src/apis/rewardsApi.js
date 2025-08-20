// src/apis/rewardsApi.js
import api from "./api";

/**
 * 우승작 확정 (소상공인 전용)
 * Swagger: POST /api/v1/rewards/award/project/{projectId}/submission/{submissionId}
 *
 * ⚠️ 주의
 * - 경로 파라미터만 사용, Request Body 없음 (null)
 * - baseURL에 /api/v1 이 없다면 URL 앞에 '/api/v1'을 붙이세요.
 *   예) await api.post(`/api/v1/rewards/award/project/${pid}/submission/${sid}`, null, ...)
 * - 인증이 쿠키 기반이면 withCredentials: true 필요 (api 인스턴스 전역설정에 따라 생략 가능)
 */
export async function selectWinner(projectId, submissionId) {
  const pid = Number(projectId);
  const sid = Number(submissionId);
  if (!Number.isFinite(pid) || !Number.isFinite(sid)) {
    throw new Error("selectWinner: invalid ids");
  }

  // ✅ 두 번째 인자(data)도, 헤더도 아무것도 넘기지 않습니다.
  //    (api 인스턴스에 baseURL이 /api/v1 라면 OK, 아니라면 경로 앞에 /api/v1 붙이기)
  const { data } = await api.post(
    `/rewards/award/project/${pid}/submission/${sid}`
  );
  return data;
}

/**
 * 내가 수상한 공모전 목록
 * GET /rewards/me/awards
 */
export async function getMyAwards() {
  const { data } = await api.get(`/rewards/me/awards`, {
    withCredentials: true,
  });
  // 서버가 배열 또는 { data: [] } 형태를 줄 수 있으므로 안전 처리
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

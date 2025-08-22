// src/apis/votesApi.js
import api from "./api";

/**
 * 프로젝트별 제출작 투표 현황 조회
 * 기대 응답 1) { totalVotes, results:[{submissionId, votes}], myVoteSubmissionId? }
 * 기대 응답 2) [{ submissionId, count }]  (백엔드에 따라 다를 수 있음)
 * -> 그대로 반환하고, 필요 시 화면단에서 normalize해서 쓰세요.
 */
export async function getProjectVotes(projectId) {
  const { data } = await api.get(`/votes/projects/${projectId}`);
  return data;
}

/** (옵션) 제출작 단건 투표 현황 조회 */
export async function getSubmissionVotes(submissionId) {
  const { data } = await api.get(`/votes/submissions/${submissionId}`);
  return data;
}

/**
 * 참가자 투표
 * - 스타일 A: POST /votes/submissions/{submissionId}
 *   => voteSubmission(submissionId)
 * - 스타일 B: POST /votes   body:{ projectId, submissionId }
 *   => voteSubmission(projectId, submissionId)
 * 두 방식 모두 지원 (호출 시그니처로 분기)
 */
export async function voteSubmission(arg1, arg2) {
  // 스타일 B (projectId, submissionId)
  if (typeof arg2 !== "undefined" && arg2 !== null) {
    const projectId = arg1;
    const submissionId = arg2;
    const { data } = await api.post("/votes", { projectId, submissionId });
    return data;
  }

  // 스타일 A (submissionId)
  const submissionId = arg1;
  const { data } = await api.post(`/votes/submissions/${submissionId}`);
  return data;
}


export function normalizeProjectVotes(raw) {
  if (Array.isArray(raw)) {
    const results = raw.map(v => ({
      submissionId: v.submissionId,
      votes: typeof v.votes === "number"
        ? v.votes
        : typeof v.voteCount === "number"
        ? v.voteCount
        : (v.count || 0),
    }));
    const totalVotes = results.reduce((s, r) => s + (r.votes || 0), 0);
    return { totalVotes, results, myVoteSubmissionId: null };
  }

  // 객체 형태 그대로 들어온 경우
  const results = (raw?.results || []).map(v => ({
    submissionId: v.submissionId,
    votes: v.votes ?? v.voteCount ?? v.count ?? 0,
  }));
  const totalVotes =
    typeof raw?.totalVotes === "number"
      ? raw.totalVotes
      : results.reduce((s, r) => s + (r.votes || 0), 0);
  return {
    totalVotes,
    results,
    myVoteSubmissionId: raw?.myVoteSubmissionId ?? null,
  };
}

// apis/rewardsApi.js
import api from "./api";

/** 내 수상(award) 목록 */
export const fetchMyAwards = async () => {
  const { data } = await api.get("rewards/me/awards", { withCredentials: true });
  return Array.isArray(data) ? data : [];
};

/** 수상 목록을 Set(submissionId)으로 */
export const toAwardedSubmissionIdSet = (awards = []) => {
  const s = new Set();
  for (const a of awards) {
    const id =
      a?.submissionId ??
      a?.submission_id ??
      a?.submission?.id ??
      a?.submission?.submissionId ??
      null;
    if (id != null) s.add(id);
  }
  return s;
};

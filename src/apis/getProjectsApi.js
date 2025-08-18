// apis/getProjectsApi.js
import api from "./api";

// 전체 목록 (기존)
export const fetchProjects = async () => {
  const res = await api.get("projects");
  return res.data;
};

// 내 공모전만 (서버에 mine 파라미터가 있다면 우선 시도하고, 없으면 프론트 필터)
export const fetchMyProjects = async () => {
  // 1) 내 정보
  const meRes = await api.get("/users");
  const me = meRes.data; // { nickname, role, ... }

  // 2) 서버가 지원하면 이걸로 대체 (주석 해제해서 사용)
  // const mineRes = await api.get("projects", { params: { mine: true }});
  // return mineRes.data;

  // 3) 지원 없을 때 프론트에서 필터
  const all = await fetchProjects();
  // writerNickname 또는 merchantName 등의 필드에 맞춰 튜닝
  return all.filter(p =>
    p.writerNickname === me.nickname ||
    p.merchantName === me.nickname ||  // 백엔드 필드명에 맞게 추가
    p.ownerNickname === me.nickname
  );
};

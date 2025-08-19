
// src/components/myprojects/MyProjectsList.jsx
import React, { useEffect, useState } from "react";
import readProjectApi from "../../apis/joohee/readProjectApi";
import MyProjectRow from "./MyProjectRow";

const MyProjectsList = ({ getCategoryLabel, getBusinessTypeLabel, project }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  
  useEffect(() => {
    (async () => {
      try {
        const data = await readProjectApi(); // GET /projects
        console.log(data);
        // 응답이 배열/페이지형 둘 다 올 수 있으면 방어
        const list = Array.isArray(data) ? data : Array.isArray(data?.content) ? data.content : [];
        setProjects(list);
      } catch (err) {
        setErrorMsg(err?.response?.data?.message || err.message || "프로젝트 목록 조회 실패");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-4 text-sm text-gray-500">불러오는 중…</div>;
  if (errorMsg) return <div className="p-4 text-sm text-red-500">{errorMsg}</div>;
  if (projects.length === 0) return <div className="p-4 text-sm text-gray-500">프로젝트가 없습니다.</div>;

  return (
    <div className="divide-y">
        <MyProjectRow
          project={project.project}
          getCategoryLabel={getCategoryLabel}
          getBusinessTypeLabel={getBusinessTypeLabel}
        />
      
    </div>
  );
};

export default MyProjectsList;

/** 서버 응답을 화면에서 쓰기 편한 형태로 정규화 */
function normalizeProject(raw) {
  return {
    // 백엔드 키가 다를 수 있으니 넓게 대응
    id: raw.id ?? raw.projectId,
    category: raw.category,
    businessType: raw.businessType,
    title: raw.title,
    summary: raw.summary ?? raw.description, // 요약/설명
    rewardAmount: raw.rewardAmount ?? raw.prize ?? raw.reward, // 상금
    submissionsCount:
      raw.submissionsCount ??
      (Array.isArray(raw.submissions) ? raw.submissions.length : 0),
    createdAt: raw.createdAt ?? raw.startDate,
    deadline: raw.deadline ?? raw.endDate,
  };
}

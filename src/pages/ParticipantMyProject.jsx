// pages/ParticipantMyProject.jsx
import React, { useEffect, useMemo, useState } from "react";
import ParticipantHeader from "../header/ParticipantHeader";
import Footer from "../components/Footer";
import Pagination from "../components/Pagination";

import { fetchUserInfo } from "../apis/userApi";
import { fetchProjects } from "../apis/getProjectsApi";
import { fetchAllSubmissions } from "../apis/projectSubmissionApi";
import api from "../apis/api"; // /rewards/me/awards 호출용
import MyProjectRow from "../components/myprojects/MyProjectRow";
import { useNavigate, Link } from "react-router-dom";
import MyProjectsList from "../components/myprojects/MyprojectsList";
import { fetchCategories } from "../apis/category";
import { getBusinessTypes } from "../apis/businessTypes";

const PAGE_SIZE = 5;

const STATUS_LABEL = {
  IN_PROGRESS: "진행 중",
  VOTING: "투표 중",
  CLOSED: "완료",
};

const ParticipantMyProject = () => {
  const navigate = useNavigate();

  const [me, setMe] = useState(null);
  const [rows, setRows] = useState([]); // 화면에 그릴 {project, mySubmission, awarded} 리스트
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [businessTypes, setBusinessTypes] = useState([]);


  useEffect(() => {
    (async () => {
      try {
        // 1) 내 정보
        const user = await fetchUserInfo();
        setMe(user);

        // 참가자만 접근
        if (user?.role && user.role !== "ROLE_USER") {
          alert("참가자 전용 페이지입니다.");
          navigate("/merchant-main-page");
          return;
        }

        // 2) 프로젝트 전체 + 제출물 전체 + 내 수상 리스트 동시 로드
        const [projects, submissions, myAwardsRes] = await Promise.all([
          fetchProjects(), // 전체 프로젝트 목록  :contentReference[oaicite:1]{index=1}
          fetchAllSubmissions({ size: 1000 }),
          api.get("/rewards/me/awards").catch(() => ({ data: [] })), // 실패해도 빈 배열
        ]);
        
        // 카테고리 설정
        const [cats, biz] = await Promise.all([
          fetchCategories(),
          getBusinessTypes(),
        ]);
        setCategories(cats || []);
        setBusinessTypes(biz || []);

        // 3) 내 제출물만 고르기

        const mySubs = submissions.filter(
          (s) => String(s.userId) === String(user.user_id)
        );

        // projectId -> 내 제출물 매핑
        const byProject = new Map();

        mySubs.forEach((s) => {
          if (!byProject.has(s.projectId)) byProject.set(s.projectId, s);
        });


        // 4) 수상 세트 만들기(프로젝트/제출물 기준 둘 다 대비)
        const awardList = Array.isArray(myAwardsRes?.data)
          ? myAwardsRes.data
          : [];
        const awardProjectSet = new Set(
          awardList
            .map((a) => a.projectId ?? a.project?.id)
            .filter((v) => v != null)
        );
        const awardSubmissionSet = new Set(
          awardList
            .map((a) => a.submissionId ?? a.submission?.id)
            .filter((v) => v != null)
        );

        // 5) '내가 참여한 프로젝트'만 뽑아서 화면용 데이터 구성
        const mine = projects
          .filter((p) => byProject.has(p.projectId ?? p.id))
          .map((p) => {
            const pid = p.projectId ?? p.id;
            const mySubmission = byProject.get(pid);
            const awarded =
              awardProjectSet.has(pid) ||
              (mySubmission &&
                awardSubmissionSet.has(mySubmission.submissionId));
            return { project: p, mySubmission, awarded };
          });

        setRows(mine); 
        console.log('mine:', mine)
      } catch (e) {
        console.error(e);
        alert("내 공모전을 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const start = (page - 1) * PAGE_SIZE;
  const pageItems = useMemo(() => rows.slice(start, start + PAGE_SIZE), [rows, start]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <ParticipantHeader />
        <div className="max-w-[1120px] mx-auto py-20">로딩 중...</div>
        <Footer />
      </div>
    );
  }

  
  const getCategoryLabel = (code) =>
    categories.find((c) => c.code === code)?.description || "카테고리 없음";

  const getBusinessTypeLabel = (code) =>
    businessTypes.find((b) => b.code === code)?.description || "업종 없음";

  return (
    <div className="min-h-screen">
      <ParticipantHeader />
      <div className="max-w-[1120px] mx-auto pt-[40px] font-pretendard">
        <h1 className="text-[24px] font-bold mb-[16px]">내 공모전</h1>

        <div className="w-full border-y border-[#ECECEC] h-[44px] flex items-center text-[12px] text-[#8C8C8C]">
          <div className="flex-1 pl-[20px]">공모전 제목</div>
          <div className="w-[120px] text-center">수상여부</div>
        </div>

        {pageItems.length === 0 ? (
          <div className="py-[48px] text-center text-[#8C8C8C]">
            참가한 공모전이 없습니다.
          </div>
        ) : (
          rows.map((r) => (
            <div
              key={r.project.projectId}
              className="flex items-center border-b border-[#F2F2F2]"
            >
              {/* 좌측: 공모전 정보 카드(기존 컴포넌트 재사용) */}
              <div className="flex-1">
                <MyProjectsList
                  getCategoryLabel={getCategoryLabel}
                  getBusinessTypeLabel={getBusinessTypeLabel}
                  project={r}
                />
              </div>

              {/* 우측: 수상여부 */}
              <div className="w-[120px] text-center">
                {r.awarded ? (
                  <span className="inline-flex items-center justify-center w-[96px] h-[32px] rounded-[6px] bg-[#2FD8F6] text-white text-[12px]">
                    수상 확정
                  </span>
                ) : r.project.status === "CLOSED" ? (
                  <span className="text-[#8C8C8C] text-[12px]">마감됨</span>
                ) : (
                  <span className="text-[#4C4C4C] text-[12px]">참가 완료</span>
                )}
              </div>
            </div>
          ))
        )}

        {rows.length > PAGE_SIZE && (
          <div className="mt-[16px]">
            <Pagination
              page={page}
              setPage={setPage}
              pageSize={PAGE_SIZE}
              totalItems={rows.length}
              blockSize={5}
            />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ParticipantMyProject;

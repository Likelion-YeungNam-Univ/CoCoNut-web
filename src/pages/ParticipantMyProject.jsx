// pages/ParticipantMyProject.jsx
import React, { useEffect, useMemo, useState } from "react";
import ParticipantHeader from "../header/ParticipantHeader";
import Footer from "../components/Footer";
import Pagination from "../components/Pagination";

import { fetchUserInfo } from "../apis/userApi";
import { fetchProjects } from "../apis/getProjectsApi";
import { fetchAllSubmissions } from "../apis/projectSubmissionApi";
import api from "../apis/api"; 

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
     
        const user = await fetchUserInfo();
        setMe(user);

        // 참가자만 접근
        if (user?.role && user.role !== "ROLE_USER") {
          alert("참가자 전용 페이지입니다.");
          navigate("/merchant-main-page");
          return;
        }

      
        const [projects, submissions, myAwardsRes] = await Promise.all([
          fetchProjects(), 
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

  

        const mySubs = submissions.filter(
          (s) => String(s.userId) === String(user.user_id)
        );

        // projectId -> 내 제출물 매핑
        const byProject = new Map();

        mySubs.forEach((s) => {
          if (!byProject.has(s.projectId)) byProject.set(s.projectId, s);
        });


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
        <h1 className="text-[24px] font-bold mb-[40px] flex justify-center">내 공모전</h1>

        <div className="w-full border-y border-[#ECECEC] h-[44px] flex items-center text-[12px] text-[#8C8C8C] bg-[#F3F3F3]">
          <div className="flex-1 pl-[20px]">공모전 제목</div>
          <div className="w-[120px] text-center mr-16">수상여부</div>
        </div>

        {pageItems.length === 0 ? (
          <div className="py-[48px] text-center text-[#8C8C8C]">
            참가한 공모전이 없습니다.
          </div>
        ) : (
          pageItems.map((r) => (
            <div
              key={r.project.projectId}
              className="flex items-center border-b border-[#F2F2F2]"
            >
          
              <div className="flex-1">
              <Link
                    to={`/project-detail/${r.project.projectId}`}
                    className="block cursor-pointer hover:bg-[#FAFAFA] rounded-[6px] transition-colors"
                    aria-label={`${r.project.title || "공모전"} 상세보기`}
                  >
                    <MyProjectsList
                      getCategoryLabel={getCategoryLabel}
                      getBusinessTypeLabel={getBusinessTypeLabel}
                      project={r}
                    />
                  </Link>
              </div>

              {/* 수상여부 */}
              <div className="text-center pr-20">
                {r.awarded ? (
                  <span className="text-[#FFFFFF] text-[14px] border rounded-[18px] border-[#2FD8F6] bg-[#2FD8F6] w-[68px] h-[38px] px-[16px] py-[10px]">
                    선정됨
                  </span>
                ) : r.project.status === "CLOSED" ? (
                  <span className="text-[#AEAEAE] text-[14px] border rounded-[18px] border-[#F3F3F3] bg-[#F3F3F3] w-[68px] h-[38px] px-[16px] py-[10px]">마감됨</span>
                ) : (
                  <span className="text-[#26ADC5] text-[14px] border rounded-[18px] border-[#E0F9FE] bg-[#E0F9FE] w-[83px] h-[38px] px-[16px] py-[10px]">참가 완료</span>
                )}
              </div>
            </div>
          ))
        )}

       {true && (
   <div className="mt-[60px]">
     <Pagination
       totalItems={rows.length}
       page={page}
       onPageChange={setPage}
       pageSize={PAGE_SIZE}
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

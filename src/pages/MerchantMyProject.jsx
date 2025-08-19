// 시간날때 tailwind 수정해야함
import React, { useEffect, useMemo, useState } from "react";


import MerchantHeader from "../header/MerchantHeader";
import Footer from "../components/Footer";
import Pagination from "../components/Pagination";

import { fetchUserInfo } from "../apis/userApi";
import { fetchProjects } from "../apis/getProjectsApi";
import { fetchCategories } from "../apis/category";
import { getBusinessTypes } from "../apis/businessTypes";

import MyProjectRow from "../components/myprojects/MyProjectRow";
import MyProjectsList from "../components/myprojects/MyprojectsList";
import { useNavigate, Link } from "react-router-dom";

const PAGE_SIZE = 5;

const STATUS_LABEL = {
  IN_PROGRESS: "진행 중",
  VOTING: "투표 중",
  CLOSED: "완료",
};

const MerchantMyProject = () => {
  const navigate = useNavigate();

  const [me, setMe] = useState(null);
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [businessTypes, setBusinessTypes] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const user = await fetchUserInfo();
        setMe(user);

        if (user?.role && user.role !== "ROLE_BUSINESS") {
          alert("소상공인 전용 페이지입니다.");
          navigate("/participant-main-page");
          return;
        }

        const [cats, biz] = await Promise.all([
          fetchCategories(),
          getBusinessTypes(),
        ]);
        setCategories(cats || []);
        setBusinessTypes(biz || []);

        const all = await fetchProjects();
        const mine = all.filter(
          (p) =>
            p?.writerNickname === user?.nickname ||
            p?.merchantName === user?.nickname ||
            p?.ownerNickname === user?.nickname
        );
        setProjects(mine);
      } catch (e) {
        console.error(e);
        alert("내 공모전을 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const start = (page - 1) * PAGE_SIZE;
  const pageItems = useMemo(
    () => projects.slice(start, start + PAGE_SIZE),
    [projects, start]
  );

  const getCategoryLabel = (code) =>
    categories.find((c) => c.code === code)?.description || "카테고리 없음";

  const getBusinessTypeLabel = (code) =>
    businessTypes.find((b) => b.code === code)?.description || "업종 없음";

  const renderAwardCell = (p) => {
    const awarded = p.awarded === true || p.winnerSelected === true;

    if (p.status === "CLOSED" && !awarded) {
      return (
        <button
          onClick={() => navigate(`/project-detail/${p.projectId}`)}
          className="w-[96px] h-[32px] rounded-[6px] bg-[#2FD8F6] hover:bg-[#2AC2DD] text-white text-[12px]"
        >
          수상 확정
        </button>
      );
    }
    if (p.status === "CLOSED" && awarded) {
      return (
        <button
          disabled
          className="w-[96px] h-[32px] rounded-[6px] bg-[#EDEDED] text-[#A3A3A3] text-[12px] cursor-not-allowed"
        >
          거래 완료
        </button>
      );
    }
    return (
      <button
        disabled
        className="w-[96px] h-[32px] rounded-[6px] bg-[#F3F3F3] text-[#A3A3A3] text-[12px] cursor-not-allowed"
      >
        수상 확정
      </button>
    );
  };

  if (loading) return <div className="p-10">불러오는 중...</div>;

  return (
    <div className="min-h-screen bg-white font-pretendard">
      <MerchantHeader />

      <div className="flex flex-col items-center w-full">
        <div className="w-[1120px] max-w-[92vw]">
          <h2 className="text-[24px] font-semibold mt-[40px] mb-[20px] text-center">
            내 공모전
          </h2>

        {/* 헤더: 좌(8) | 상태(2) | 수상작(2) */}
<div
  className="grid grid-cols-12 items-center h-[40px] gap-0
             bg-[#F3F3F3] border-b border-[#E0E0E0]
             text-[12px] text-[#212121]"
>
  <div className="col-span-8 pl-4">공모전 목록</div>
  <div className="col-span-2 text-center">상태</div>
  <div className="col-span-2 text-center ">수상작</div>
</div>

{/* 목록 행: 헤더와 동일하게 gap-0 + px-4, 첫 행만 -1px 겹치기 */}
{pageItems.map((p) => (
  <div
    key={p.projectId}
    className="grid grid-cols-12 items-stretch gap-0
               border-b border-[#F1F1F1] first:-mt-px"
  >
    {/* 좌측: 공모전 카드 클릭 → 상세로 이동 */}
    <div className="col-span-8 py-3">
      <Link
        to={`/project-detail/${p.projectId}`}
        className="block cursor-pointer hover:bg-[#FAFAFA] rounded-[6px] transition-colors"
        aria-label={`${p.title || "공모전"} 상세보기`}
      >
        <MyProjectsList
          getCategoryLabel={getCategoryLabel}
          getBusinessTypeLabel={getBusinessTypeLabel}
        />
      </Link>
    </div>

    {/* 가운데: 상태 */}
    <div className="col-span-2 border-l border-[#E0E0E0]
                    flex items-center justify-center py-3
                    text-center text-[14px] text-[#222] font-medium">
      {STATUS_LABEL[p.status] || p.status}
    </div>

    {/* 오른쪽: 수상작 */}
    <div className="col-span-2 border-l border-[#E0E0E0]
                    flex items-center justify-center py-3">
      {renderAwardCell(p)}
    </div>
  </div>
))}

          <div className="flex justify-center my-6">
            <Pagination
              totalItems={projects.length}
              page={page}
              onPageChange={setPage}
              pageSize={PAGE_SIZE}
              blockSize={5}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MerchantMyProject;

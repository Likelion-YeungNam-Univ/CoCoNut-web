// src/pages/MerchantMyProject.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";

import MerchantHeader from "../header/MerchantHeader";
import Footer from "../components/Footer";
import Pagination from "../components/Pagination";
import MyProjectsList from "../components/myprojects/MyprojectsList";

import { fetchUserInfo } from "../apis/userApi";
import { fetchProjects } from "../apis/getProjectsApi";
import { fetchCategories } from "../apis/category";
import { getBusinessTypes } from "../apis/businessTypes";
import api from "../apis/api";

const PAGE_SIZE = 5;

const STATUS_LABEL = {
  IN_PROGRESS: "진행 중",
  VOTING: "투표 중",
  CLOSED: "완료",
};

// 서버/객체 어디에서 와도 우승작 id를 뽑아내는 헬퍼 (fallback)
const deriveWinnerId = (p) => {
  if (!p) return null;
  return (
    p.winnerSubmissionId ??
    p.winnerId ??
    p.awardedSubmissionId ??
    p?.winnerSubmission?.submissionId ??
    p?.reward?.submissionId ??
    (Array.isArray(p?.rewards) && p.rewards[0]?.submissionId) ??
    null
  );
};

const MerchantMyProject = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState([]);
  const [businessTypes, setBusinessTypes] = useState([]);

  const [page, setPage] = useState(1);
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = useMemo(
    () => projects.slice(start, start + PAGE_SIZE),
    [projects, start]
  );

  const getCategoryLabel = (code) =>
    categories.find((c) => c.code === code)?.description || "카테고리 없음";
  const getBusinessTypeLabel = (code) =>
    businessTypes.find((b) => b.code === code)?.description || "업종 없음";

  // 각 프로젝트의 우승작 여부/ID를 서버에서 직접 조회
  const enrichWithWinners = useCallback(async (list) => {
    const fetchOne = async (pid) => {
      try {
        const res = await api.get(`/projects/${pid}/submissions`);
        const arr = Array.isArray(res?.data) ? res.data : res?.data?.data || [];
        const win = arr.find((s) => s?.winner === true);
        return {
          hasWinner: Boolean(win),
          winnerSubmissionId: win ? (win.submissionId ?? win.id ?? null) : null,
        };
      } catch (e) {
        console.error("submissions fetch failed:", pid, e);
        return { hasWinner: false, winnerSubmissionId: null };
      }
    };

    const results = await Promise.all(
      list.map((p) => fetchOne(p.projectId ?? p.id))
    );

    return list.map((p, i) => ({
      ...p,
      hasWinner: results[i].hasWinner,
      winnerSubmissionId:
        results[i].winnerSubmissionId ?? deriveWinnerId(p) ?? null,
      // awardConfirmed는 서버가 주는 값 우선, 없으면 false
      awardConfirmed: Boolean(p.awardConfirmed),
    }));
  }, []);

  // 내 공모전 목록 로드
  const loadMine = useCallback(async () => {
    const user = await fetchUserInfo();
    if (user?.role && user.role !== "ROLE_BUSINESS") {
      alert("소상공인 전용 페이지입니다.");
      navigate("/participant-main-page");
      return [];
    }

    const [cats, biz, all] = await Promise.all([
      fetchCategories(),
      getBusinessTypes(),
      fetchProjects(),
    ]);

    setCategories(cats || []);
    setBusinessTypes(biz || []);

    // 내 프로젝트만
    const mine = (all || []).filter(
      (p) =>
        p?.writerNickname === user?.nickname ||
        p?.merchantName === user?.nickname ||
        p?.ownerNickname === user?.nickname
    );

    const enriched = await enrichWithWinners(mine);
    setProjects(enriched);
    return enriched;
  }, [navigate, enrichWithWinners]);

  useEffect(() => {
    (async () => {
      try {
        await loadMine();
      } catch (e) {
        console.error(e);
        alert("내 공모전을 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, [loadMine]);

  // 버튼 렌더링 규칙 (모달 없이 두 가지 라벨만)
  // - "거래 완료"(비활성): CLOSED && hasWinner === true
  // - "수상 확정":
  //    * 활성: (VOTING || CLOSED) && hasWinner === false  → 클릭 시 상세페이지 이동
  //    * 비활성: 그 외(IN_PROGRESS 등)
  const renderAwardCell = (p) => {
    const hasWinner = Boolean(p.hasWinner);
    const pid = p.projectId ?? p.id;

    if (p.status === "CLOSED" && hasWinner) {
      return (
        <button
          disabled
          className="w-[96px] h-[32px] rounded-[6px] bg-[#EDEDED] text-[#A3A3A3] text-[12px] cursor-not-allowed"
        >
          거래 완료
        </button>
      );
    }

    const canGoConfirm =
      (p.status === "VOTING" || p.status === "CLOSED") && !hasWinner;

    if (canGoConfirm) {
      return (
        <button
          onClick={() => navigate(`/project-detail/${pid}`)}
          className="w-[96px] h-[32px] rounded-[6px] bg-[#2FD8F6] hover:bg-[#2AC2DD] text-white text-[12px]"
          title="선정작을 확정하려면 상세 페이지로 이동합니다"
        >
          수상 확정
        </button>
      );
    }

    // 나머지(IN_PROGRESS 등): 비활성 수상 확정
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
    <div className="min-h-screen flex flex-col bg-white font-pretendard">
      <MerchantHeader />
      <div className="flex flex-col items-center w-full ">
        <div className="w-[1120px] max-w-[92vw]">
          <h2 className="text-[24px] font-semibold mt-[40px] mb-[20px] text-center">
            내 공모전
          </h2>

          {/* 헤더: 좌(8) | 상태(2) | 수상작(2) */}
          <div className="grid grid-cols-12 items-center h-[40px] gap-0 bg-[#F3F3F3] border-b border-[#E0E0E0] text-[12px] text-[#212121]">
            <div className="col-span-8 pl-4">공모전 목록</div>
            <div className="col-span-2 text-center">상태</div>
            <div className="col-span-2 text-center">수상작</div>
          </div>

          {/* 목록 */}
          {pageItems.map((p) => {
            const pid = p.projectId ?? p.id;
            return (
              <div
                key={pid}
                className="grid grid-cols-12 items-stretch gap-0 border-b border-[#F1F1F1] first:-mt-px"
              >
                {/* 좌측 카드 (상세 페이지 링크) */}
                <div className="col-span-8 py-3">
                  <Link
                    to={`/project-detail/${pid}`}
                    className="block cursor-pointer hover:bg-[#FAFAFA] rounded-[6px] transition-colors"
                    aria-label={`${p.title || "공모전"} 상세보기`}
                  >
                    <MyProjectsList
                      getCategoryLabel={getCategoryLabel}
                      getBusinessTypeLabel={getBusinessTypeLabel}
                      project={{ project: p }}
                    />
                  </Link>
                </div>

                {/* 상태 */}
                <div className="col-span-2 border-l border-[#E0E0E0] flex items-center justify-center py-3 text-center text-[14px] text-[#222] font-medium">
                  {STATUS_LABEL[p.status] || p.status}
                </div>

                {/* 수상/확정 버튼 */}
                <div className="col-span-2 border-l border-[#E0E0E0] flex items-center justify-center py-3">
                  {renderAwardCell(p)}
                </div>
              </div>
            );
          })}

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

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default MerchantMyProject;

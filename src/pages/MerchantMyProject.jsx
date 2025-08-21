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
import { selectWinner } from "../apis/rewardsApi";

import AwardConfirmModal from "../components/AwardConfirmModal";

const PAGE_SIZE = 5;

const STATUS_LABEL = {
  IN_PROGRESS: "진행 중",
  VOTING: "투표 중",
  CLOSED: "완료",
};

// 서버/객체 어디에서 와도 우승작 id를 뽑아내는 헬퍼
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

  const [me, setMe] = useState(null);
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

  // 확정 모달
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetProject, setTargetProject] = useState(null);

  const openConfirm = useCallback((p) => {
    setTargetProject(p);
    setConfirmOpen(true);
  }, []);

  const getCategoryLabel = (code) =>
    categories.find((c) => c.code === code)?.description || "카테고리 없음";
  const getBusinessTypeLabel = (code) =>
    businessTypes.find((b) => b.code === code)?.description || "업종 없음";

  // 내 공모전 목록 로드 (+ 로컬 캐시 보정)
  const loadMine = useCallback(
    async (userForFilter) => {
      const all = await fetchProjects();
      const mine = all.filter(
        (p) =>
          p?.writerNickname === userForFilter?.nickname ||
          p?.merchantName === userForFilter?.nickname ||
          p?.ownerNickname === userForFilter?.nickname
      );

      const merged = mine.map((p) => {
        const pid = p.projectId ?? p.id;
        const cachedWinner = sessionStorage.getItem(`winner:${pid}`);
        const cachedAward = sessionStorage.getItem(`awarded:${pid}`) === "1";

        return {
          ...p,
          // 우승작 id는 캐시로 보강 가능
          winnerSubmissionId:
            p.winnerSubmissionId ??
            (cachedWinner ? Number(cachedWinner) : undefined),
          // ✅ 규칙: 완료일 때만 캐시로 '확정됨' 반영
          // 진행중/투표중에는 항상 비활성 버튼이므로 캐시 무시
          awardConfirmed: p.status === "CLOSED" ? (p.awardConfirmed || cachedAward) : false,
        };
      });

      setProjects(merged);
    },
    [setProjects]
  );

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

        await loadMine(user);
      } catch (e) {
        console.error(e);
        alert("내 공모전을 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate, loadMine]);

  // 수상 확정 처리 (모달 확인)
  const confirmAward = async () => {
    if (!targetProject) return;
    const pid = targetProject.projectId ?? targetProject.id;

    try {
      // 가능한 모든 소스에서 submissionId 확보
      let sid =
        deriveWinnerId(targetProject) ??
        targetProject.selectedSubmissionId ??
        targetProject.submissionId ??
        null;

      if (!sid) {
        try {
          const fresh = await api.get(`/projects/${pid}`);
          const p = fresh?.data;
          sid = deriveWinnerId(p) ?? p?.selectedSubmissionId ?? null;
        } catch {}
      }
      if (!sid) {
        const cached = sessionStorage.getItem(`winner:${pid}`);
        if (cached) sid = Number(cached);
      }

      // sid가 있으면 보상 확정 API 호출(이미 확정 409/400은 성공으로 간주)
      if (sid) {
        try {
          await selectWinner(pid, sid);
        } catch (err) {
          const status = err?.response?.status;
          if (!(status === 409 || status === 400)) throw err;
        }
      }

      // 로컬 캐시: 완료로 표시 유지
      sessionStorage.setItem(`awarded:${pid}`, "1");
      if (sid != null) sessionStorage.setItem(`winner:${pid}`, String(sid));

      // 리스트 즉시 갱신(거래 완료로 전환)
      setProjects((prev) =>
        prev.map((prj) =>
          (prj.projectId ?? prj.id) === pid
            ? {
                ...prj,
                winnerSubmissionId: sid ?? prj.winnerSubmissionId,
                awardConfirmed: true,
              }
            : prj
        )
      );

      alert("수상확정이 완료되었습니다.");
    } catch (e) {
      console.error(e);
      alert("수상 확정 처리에 실패했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setConfirmOpen(false);
      setTargetProject(null);
    }
  };

  // ✅ 버튼 렌더링: 너가 말한 규칙 그대로
  // - 진행중(IN_PROGRESS): 비활성(회색)
  // - 투표중(VOTING): 비활성(회색)
  // - 완료(CLOSED):
  //     * 미확정 → 활성(파랑) "수상 확정"
  //     * 확정  → "거래 완료"(비활성)
  const renderAwardCell = (p) => {
    if (p.status === "IN_PROGRESS" || p.status === "VOTING") {
      return (
        <button
          disabled
          className="w-[96px] h-[32px] rounded-[6px] bg-[#F3F3F3] text-[#A3A3A3] text-[12px] cursor-not-allowed"
        >
          수상 확정
        </button>
      );
    }

    if (p.status === "CLOSED") {
      if (p.awardConfirmed) {
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
          onClick={() => openConfirm(p)}
          className="w-[96px] h-[32px] rounded-[6px] bg-[#2FD8F6] hover:bg-[#2AC2DD] text-white text-[12px]"
        >
          수상 확정
        </button>
      );
    }

    // 혹시 모를 기타 상태 대비
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
          {pageItems.map((p) => (
            <div
              key={p.projectId}
              className="grid grid-cols-12 items-stretch gap-0 border-b border-[#F1F1F1] first:-mt-px"
            >
              {/* 좌측 카드 (상세 페이지 링크) */}
              <div className="col-span-8 py-3">
                <Link
                  to={`/project-detail/${p.projectId}`}
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

      <div className="mt-auto">
        <Footer />
      </div>

      {/* 수상 확정 모달 */}
      <AwardConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmAward}
        title="수상을 확정하시겠습니까?"
        description="수상을 확정하면 당선작에게 보상이 지급되며, 이후 변경이 불가능합니다."
        confirmText="수상 확정하기"
        cancelText="취소하기"
      />
    </div>
  );
};

export default MerchantMyProject;

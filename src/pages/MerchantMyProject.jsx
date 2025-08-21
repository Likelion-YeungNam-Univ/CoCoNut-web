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
import { selectWinner } from "../apis/rewardsApi";

import AwardConfirmModal from "../components/AwardConfirmModal"; // ✅ 새 모달

const PAGE_SIZE = 5;

const STATUS_LABEL = {
  IN_PROGRESS: "진행 중",
  VOTING: "투표 중",
  CLOSED: "완료",
};

// 서버가 내려주는 값 기준으로 '거래 완료' 판단
const isAwarded = (p) =>
  !!p?.winnerSubmissionId || p?.winnerSelected === true || p?.awardConfirmed === true;

const MerchantMyProject = () => {
  const navigate = useNavigate();

  const [me, setMe] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState([]);
  const [businessTypes, setBusinessTypes] = useState([]);

  // 페이지네이션
  const [page, setPage] = useState(1);
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = useMemo(() => projects.slice(start, start + PAGE_SIZE), [projects, start]);

  // 모달 상태
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetProject, setTargetProject] = useState(null);

  // 공통 라벨 함수
  const getCategoryLabel = (code) =>
    categories.find((c) => c.code === code)?.description || "카테고리 없음";
  const getBusinessTypeLabel = (code) =>
    businessTypes.find((b) => b.code === code)?.description || "업종 없음";

  // 내 프로젝트 목록 불러오기
  const loadMine = useCallback(
    async (userForFilter) => {
      const all = await fetchProjects();
      const mine = all.filter(
        (p) =>
          p?.writerNickname === userForFilter?.nickname ||
          p?.merchantName === userForFilter?.nickname ||
          p?.ownerNickname === userForFilter?.nickname
      );
      setProjects(mine);
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

        const [cats, biz] = await Promise.all([fetchCategories(), getBusinessTypes()]);
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

  // “수상 확정” 버튼 → 모달 열기
  const openConfirm = (p) => {
    setTargetProject(p);
    setConfirmOpen(true);
  };

  // 모달 확인
  const confirmAward = async () => {
    if (!targetProject) return;
    try {
      // 1) 우승작이 이미 선택되어 있으면 서버에 확정 저장
      const pid = targetProject.projectId ?? targetProject.id;
      const sid =
        targetProject.winnerSubmissionId ??
        targetProject.selectedSubmissionId ??
        targetProject.submissionId ??
        null;

      if (!sid) {
        // 2) 아직 우승작을 고르지 않았다면 상세 페이지로 이동시켜서 먼저 선정
        setConfirmOpen(false);
        alert("우승작이 아직 선택되지 않았습니다. 우승작을 먼저 선택해 주세요.");
        navigate(`/project-detail/${pid}`);
        return;
      }

      // 3) 서버에 영구 저장 (Request Body 없음)
      await selectWinner(pid, sid);

      // 4) 서버 기준으로 목록 다시 불러와 UI 반영
      await loadMine(me);
    } catch (e) {
      console.error(e);
      alert("수상 확정 처리에 실패했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setConfirmOpen(false);
      setTargetProject(null);
    }
  };

  // 수상 버튼 셀
  const renderAwardCell = (p) => {
    const awarded = isAwarded(p);

    // 완료(CLOSED)이고 아직 확정 전이면 버튼 노출
    if (p.status === "CLOSED" && !awarded) {
      return (
        <button
          onClick={() => openConfirm(p)}
          className="w-[96px] h-[32px] rounded-[6px] bg-[#2FD8F6] hover:bg-[#2AC2DD] text-white text-[12px]"
        >
          수상 확정
        </button>
      );
    }

    // 완료(CLOSED) + 확정됨 → 거래 완료
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

    // 진행 중/투표 중
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
          <div
            className="grid grid-cols-12 items-center h-[40px] gap-0
                       bg-[#F3F3F3] border-b border-[#E0E0E0]
                       text-[12px] text-[#212121]"
          >
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
              {/* 좌측: 공모전 카드 (상세로 이동) */}
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

              {/* 수상작 */}
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

      {/* ✅ 첨부 이미지 스타일 모달 */}
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

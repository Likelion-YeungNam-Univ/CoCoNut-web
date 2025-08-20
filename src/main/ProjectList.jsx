import React, { useEffect, useMemo, useState } from "react";
import ProjectCardInProgress from "./projectCard/ProjectCardInProgress";
import ProjectCardVoting from "./projectCard/ProjectCardVoting";
import ProjectCardClosed from "./projectCard/ProjectCardClosed";
import Pagination from "../components/Pagination";
import noProjectIcon from "../assets/noProjectIcon.png";
import magnifierIcon from "../assets/magnifierIcon.png";
import { fetchProjects } from "../apis/getProjectsApi";

const headerText = {
  IN_PROGRESS: "필요한 도움을 지금 요청해 보세요 🔎",
  VOTING: "마음에 드는 참여작에 투표해 주세요 🗳️",
  CLOSED: "최근 수상작들을 구경해 보세요 🏆",
};

const CardByStatus = {
  IN_PROGRESS: ProjectCardInProgress,
  VOTING: ProjectCardVoting,
  CLOSED: ProjectCardClosed,
};

const PAGE_SIZE = 10; // 페이지 당 최대 카드 수
const BLOCK_SIZE = 5; // 1~5, 다음으로는 6~10 처럼 보이는 페이지 묶음 크기

const toSafeRegex = (input) => {
  if (!input) return null;
  const esc = input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // 메타문자 이스케이프
  return new RegExp(esc.replace(/\s+/g, ".*"), "i"); // 공백은 느슨한 매칭
};

const ProjectList = ({
  q = "",
  isSearched = false,
  activeTab,
  categories,
  businessTypes,
  selectedCategories = [],
  selectedBusinesses = [],
  hideHeader = false,
  role,
  onRequireLogin,
}) => {
  const [page, setPage] = useState(1); // 현재 보고있는 페이지 번호 상태
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // 탭이 바뀌거나, 카테고리/업종 체크박스 선택 시 1페이지로 리셋
  useEffect(() => {
    setPage(1);
  }, [activeTab, selectedCategories, selectedBusinesses]);

  // 페이지 전환할 때 효과
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await fetchProjects();
        setProjects(data);
      } catch (err) {
        console.error("프로젝트 불러오기 실패", err);
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, []);

  // 탭 상태, 선택된 카테고리/업종과 동일한 공모전만 보여주기
  // 기존 + 제목 검색 필터
  const filtered = useMemo(() => {
    const rx = toSafeRegex(q);

    const byStatus = activeTab
      ? projects.filter((p) => p.status === activeTab)
      : projects.slice();

    const byCategoryOrBusiness =
      selectedCategories.length === 0 && selectedBusinesses.length === 0
        ? byStatus
        : byStatus.filter((p) => {
            const categoryMatch = selectedCategories.includes(p.category);
            const businessMatch = selectedBusinesses.includes(p.businessType);
            return categoryMatch || businessMatch;
          });

    const byTitle = rx
      ? byCategoryOrBusiness.filter((p) => rx.test(p.title ?? ""))
      : byCategoryOrBusiness;

    return byTitle;
  }, [q, activeTab, selectedCategories, selectedBusinesses, projects]);

  const totalItems = filtered.length; // 필터 거친 아이템 개수
  const start = (page - 1) * PAGE_SIZE; // 현재 페이지에서 몇 번째 데이터부터 가져올지 계산
  const pageItems = filtered.slice(start, start + PAGE_SIZE); //현재 페이지에 해당하는 데이터만 잘라서 저장

  const emptyBySearch = isSearched && q.trim() !== "" && pageItems.length === 0;

  if (loading) return <div>로딩 중...</div>;

  return (
    <div className="flex flex-col gap-4 font-pretendard">
      {!hideHeader && activeTab && (
        <div className="text-[20px] font-semibold mb-[16px]">
          {headerText[activeTab]}
        </div>
      )}

      {pageItems.length === 0 ? (
        emptyBySearch ? (
          // 검색 결과 없음 (검색 제출 후 0건)
          <div className="flex flex-col justify-center items-center w-[856px] pt-[80px]">
            <img src={magnifierIcon} className="w-[120px] h-[120px]" />
            <div className="pt-[16px] text-[16px] text-[#212121] font-semibold">
              일치하는 검색 결과가 없습니다.
            </div>
            <div className="pt-[8px] text-[12px] text-[#A3A3A3] font-medium">
              다른 검색어를 입력해 주세요.
            </div>
          </div>
        ) : (
          // 기본 빈 상태 (탭/카테고리/업종만으로 0건)
          <div className="flex flex-col justify-center items-center w-[856px] pt-[80px]">
            <img src={noProjectIcon} className="w-[120px] h-[120px]" />
            <div className="pt-[16px] text-[16px] text-[#212121] font-semibold">
              아직 공모전이 없어요.
            </div>
            <div className="pt-[8px] text-[12px] text-[#A3A3A3] font-medium">
              조금만 기다려주세요.
            </div>
          </div>
        )
      ) : (
        <>
          {pageItems.map((project) => {
            const Card = activeTab
              ? CardByStatus[activeTab]
              : CardByStatus[project.status];
            return (
              <Card
                key={project.projectId}
                project={project}
                categories={categories}
                businessTypes={businessTypes}
                role={role}
                onRequireLogin={onRequireLogin}
              />
            );
          })}
          <div className="mt-[60px]">
            <Pagination
              totalItems={totalItems}
              page={page}
              onPageChange={setPage}
              pageSize={PAGE_SIZE}
              blockSize={BLOCK_SIZE}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectList;

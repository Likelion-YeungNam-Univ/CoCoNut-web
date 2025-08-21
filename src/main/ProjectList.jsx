import React, { useEffect, useMemo, useState } from "react";
import ProjectCardInProgress from "./projectCard/ProjectCardInProgress";
import ProjectCardVoting from "./projectCard/ProjectCardVoting";
import ProjectCardClosed from "./projectCard/ProjectCardClosed";
import Pagination from "../components/Pagination";
import noProjectIcon from "../assets/noProjectIcon.png";
import magnifierIcon from "../assets/magnifierIcon.png";
import DropdownSort from "./DropdownSort";
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

const PAGE_SIZE = 10;
const BLOCK_SIZE = 5;

const toSafeRegex = (input) => {
  if (!input) return null;
  const esc = input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(esc.replace(/\s+/g, ".*"), "i");
};

const ProjectList = ({
  q = "",
  isSearched = false,
  activeTab,
  categories,
  businessTypes,
  selectedCategories = [],
  selectedBusinesses = [],
  role,
  onRequireLogin,
}) => {
  const [page, setPage] = useState(1);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("최신순");

  useEffect(() => {
    setPage(1);
  }, [activeTab, selectedCategories, selectedBusinesses, sortOption]);

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

  const filtered = useMemo(() => {
    const rx = toSafeRegex(q);
    let byStatus = activeTab
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

    let sortedProjects = [...byTitle];
    if (sortOption === "최신순") {
      sortedProjects.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else if (sortOption === "총상금순") {
      sortedProjects.sort((a, b) => b.rewardAmount - a.rewardAmount);
    }

    return sortedProjects;
  }, [
    q,
    activeTab,
    selectedCategories,
    selectedBusinesses,
    projects,
    sortOption,
  ]);

  const totalItems = filtered.length;
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  const emptyBySearch = isSearched && q.trim() !== "" && pageItems.length === 0;

  if (loading) return <div>로딩 중...</div>;

  return (
    <div className="flex flex-col gap-4 font-pretendard w-[856px]">
      <div className="flex justify-between items-center mb-4 z-10">
        {activeTab && (
          <h2 className="text-[20px] font-semibold">{headerText[activeTab]}</h2>
        )}
        <DropdownSort sortOption={sortOption} setSortOption={setSortOption} />
      </div>

      {pageItems.length === 0 ? (
        emptyBySearch ? (
          <div className="flex flex-col justify-center items-center w-full pt-[80px]">
            <img
              src={magnifierIcon}
              className="w-[120px] h-[120px]"
              alt="돋보기"
            />
            <div className="pt-[16px] text-[16px] text-[#212121] font-semibold">
              일치하는 검색 결과가 없습니다.
            </div>
            <div className="pt-[8px] text-[12px] text-[#A3A3A3] font-medium">
              다른 검색어를 입력해 주세요.
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center w-full pt-[80px]">
            <img
              src={noProjectIcon}
              className="w-[120px] h-[120px]"
              alt="프로젝트 없음"
            />
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

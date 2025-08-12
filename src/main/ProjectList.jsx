import React, { useEffect, useMemo, useState } from "react";
import ProjectCardInProgress from "./projectCard/ProjectCardInProgress";
import ProjectCardVoting from "./projectCard/ProjectCardVoting";
import ProjectCardClosed from "./projectCard/ProjectCardClosed";
import Pagination from "../components/Pagination";
import noProjectIcon from "../assets/noProjectIcon.png";

// 임시 목업 데이터
const projects = [
  {
    project_id: 1,
    title: "음식점 메뉴판 3장 디자인 필요해요",
    merchant_name: "빌런호프",
    category: "그래픽/편집",
    business_type: "식당/카페/주점",
    description:
      "포차 감성 술집을 운영하는 중입니다. 지류 3장 메뉴판 디자인이 필요해요.",
    period: "2025.08.10 - 2025.08.20",
    reward_amount: 300000,
    summary: "감성적인 로고를 원합니다.",
    created_at: "2025-08-10",
    deadline: "2025-08-27",
    status: "in_progress",
    user_id: 101,
    nickname: "오뚜기",
  },
  {
    project_id: 11,
    title: "음식점 메뉴판 3장 디자인 필요해요",
    merchant_name: "빌런호프",
    category: "그래픽/편집",
    business_type: "식당/카페/주점",
    description:
      "포차 감성 술집을 운영하는 중입니다. 지류 3장 메뉴판 디자인이 필요해요.",
    period: "2025.08.10 - 2025.08.20",
    reward_amount: 300000,
    summary: "감성적인 로고를 원합니다.",
    created_at: "2025-08-10",
    deadline: "2025-08-27",
    status: "in_progress",
    user_id: 101,
    nickname: "오뚜기",
  },
  {
    project_id: 12,
    title: "음식점 메뉴판 3장 디자인 필요해요",
    merchant_name: "빌런호프",
    category: "그래픽/편집",
    business_type: "식당/카페/주점",
    description:
      "포차 감성 술집을 운영하는 중입니다. 지류 3장 메뉴판 디자인이 필요해요.",
    period: "2025.08.10 - 2025.08.20",
    reward_amount: 300000,
    summary: "감성적인 로고를 원합니다.",
    created_at: "2025-08-10",
    deadline: "2025-08-27",
    status: "in_progress",
    user_id: 101,
    nickname: "오뚜기",
  },
  {
    project_id: 13,
    title: "음식점 메뉴판 3장 디자인 필요해요",
    merchant_name: "빌런호프",
    category: "그래픽/편집",
    business_type: "식당/카페/주점",
    description:
      "포차 감성 술집을 운영하는 중입니다. 지류 3장 메뉴판 디자인이 필요해요.",
    period: "2025.08.10 - 2025.08.20",
    reward_amount: 300000,
    summary: "감성적인 로고를 원합니다.",
    created_at: "2025-08-10",
    deadline: "2025-08-27",
    status: "in_progress",
    user_id: 101,
    nickname: "오뚜기",
  },
  {
    project_id: 14,
    title: "음식점 메뉴판 3장 디자인 필요해요",
    merchant_name: "빌런호프",
    category: "그래픽/편집",
    business_type: "식당/카페/주점",
    description:
      "포차 감성 술집을 운영하는 중입니다. 지류 3장 메뉴판 디자인이 필요해요.",
    period: "2025.08.10 - 2025.08.20",
    reward_amount: 300000,
    summary: "감성적인 로고를 원합니다.",
    created_at: "2025-08-10",
    deadline: "2025-08-27",
    status: "in_progress",
    user_id: 101,
    nickname: "오뚜기",
  },
  {
    project_id: 15,
    title: "음식점 메뉴판 3장 디자인 필요해요",
    merchant_name: "빌런호프",
    category: "그래픽/편집",
    business_type: "식당/카페/주점",
    description:
      "포차 감성 술집을 운영하는 중입니다. 지류 3장 메뉴판 디자인이 필요해요.",
    period: "2025.08.10 - 2025.08.20",
    reward_amount: 300000,
    summary: "감성적인 로고를 원합니다.",
    created_at: "2025-08-10",
    deadline: "2025-08-27",
    status: "in_progress",
    user_id: 101,
    nickname: "오뚜기",
  },
  {
    project_id: 16,
    title: "음식점 메뉴판 3장 디자인 필요해요",
    merchant_name: "빌런호프",
    category: "그래픽/편집",
    business_type: "식당/카페/주점",
    description:
      "포차 감성 술집을 운영하는 중입니다. 지류 3장 메뉴판 디자인이 필요해요.",
    period: "2025.08.10 - 2025.08.20",
    reward_amount: 300000,
    summary: "감성적인 로고를 원합니다.",
    created_at: "2025-08-10",
    deadline: "2025-08-27",
    status: "in_progress",
    user_id: 101,
    nickname: "오뚜기",
  },
  {
    project_id: 17,
    title: "음식점 메뉴판 3장 디자인 필요해요",
    merchant_name: "빌런호프",
    category: "그래픽/편집",
    business_type: "식당/카페/주점",
    description:
      "포차 감성 술집을 운영하는 중입니다. 지류 3장 메뉴판 디자인이 필요해요.",
    period: "2025.08.10 - 2025.08.20",
    reward_amount: 300000,
    summary: "감성적인 로고를 원합니다.",
    created_at: "2025-08-10",
    deadline: "2025-08-27",
    status: "in_progress",
    user_id: 101,
    nickname: "오뚜기",
  },
  {
    project_id: 18,
    title: "음식점 메뉴판 3장 디자인 필요해요",
    merchant_name: "빌런호프",
    category: "그래픽/편집",
    business_type: "식당/카페/주점",
    description:
      "포차 감성 술집을 운영하는 중입니다. 지류 3장 메뉴판 디자인이 필요해요.",
    period: "2025.08.10 - 2025.08.20",
    reward_amount: 300000,
    summary: "감성적인 로고를 원합니다.",
    created_at: "2025-08-10",
    deadline: "2025-08-27",
    status: "in_progress",
    user_id: 101,
    nickname: "오뚜기",
  },
  {
    project_id: 19,
    title: "음식점 메뉴판 3장 디자인 필요해요",
    merchant_name: "빌런호프",
    category: "그래픽/편집",
    business_type: "식당/카페/주점",
    description:
      "포차 감성 술집을 운영하는 중입니다. 지류 3장 메뉴판 디자인이 필요해요.",
    period: "2025.08.10 - 2025.08.20",
    reward_amount: 300000,
    summary: "감성적인 로고를 원합니다.",
    created_at: "2025-08-10",
    deadline: "2025-08-27",
    status: "in_progress",
    user_id: 101,
    nickname: "오뚜기",
  },
  {
    project_id: 19,
    title: "음식점 메뉴판 3장 디자인 필요해요",
    merchant_name: "빌런호프",
    category: "그래픽/편집",
    business_type: "식당/카페/주점",
    description:
      "포차 감성 술집을 운영하는 중입니다. 지류 3장 메뉴판 디자인이 필요해요.",
    period: "2025.08.10 - 2025.08.20",
    reward_amount: 300000,
    summary: "감성적인 로고를 원합니다.",
    created_at: "2025-08-10",
    deadline: "2025-08-27",
    status: "in_progress",
    user_id: 101,
    nickname: "오뚜기",
  },
  {
    project_id: 2,
    title: "청년 창업가 홍보 영상 제작",
    merchant_name: "청년상회",
    category: "사진/영상/UCC",
    business_type: "서비스/전문직",
    description: "창업 스토리를 담은 1분 홍보 영상을 제작해주세요.",
    period: "2025.08.05 - 2025.08.20",
    reward_amount: 300000,
    summary: "따뜻하고 진정성 있는 영상",
    created_at: "2025-07-22",
    deadline: "2025-07-27",
    status: "voting",
    user_id: 102,
    nickname: "오뚜기",
  },
  {
    project_id: 3,
    title: "청년 창업가 홍보 영상 제작",
    merchant_name: "청년상회",
    category: "사진/영상/UCC",
    business_type: "서비스/전문직",
    description: "창업 스토리를 담은 1분 홍보 영상을 제작해주세요.",
    period: "2025.08.05 - 2025.08.20",
    reward_amount: 300000,
    summary: "따뜻하고 진정성 있는 영상",
    created_at: "2025-07-22",
    deadline: "2025-08-15",
    status: "voting",
    user_id: 102,
    nickname: "오뚜기",
  },
  {
    project_id: 4,
    title: "청년 창업가 홍보 영상 제작",
    merchant_name: "청년상회",
    category: "사진/영상/UCC",
    business_type: "서비스/전문직",
    description: "창업 스토리를 담은 1분 홍보 영상을 제작해주세요.",
    period: "2025-08-05 - 2025-08-20",
    reward_amount: 300000,
    summary: "따뜻하고 진정성 있는 영상",
    created_at: "2025-07-22",
    deadline: "2025-08-11",
    status: "voting",
    user_id: 102,
    nickname: "오뚜기",
  },
  {
    project_id: 5,
    title: "지역 축제 포스터 디자인",
    merchant_name: "시청 문화관광과",
    category: "브랜딩/로고",
    business_type: "의류/쇼핑몰",
    description: "올해 열리는 지역 축제의 메인 포스터를 제작해주세요.",
    period: "2025-07-01 - 2025-07-10",
    reward_amount: 150000,
    summary: "활기차고 화려한 느낌",
    created_at: "2025-06-25",
    deadline: "2025-06-29",
    status: "closed",
    user_id: 103,
    nickname: "오뚜기",
  },
];

const headerText = {
  in_progress: "필요한 도움을 지금 요청해 보세요 🔎",
  voting: "마음에 드는 참여작에 투표해 주세요 🗳️",
  closed: "최근 수상작들을 구경해 보세요 🏆",
};

const CardByStatus = {
  in_progress: ProjectCardInProgress,
  voting: ProjectCardVoting,
  closed: ProjectCardClosed,
};

const PAGE_SIZE = 10; // 페이지 당 최대 카드 수
const BLOCK_SIZE = 5; // 1~5, 다음으로는 6~10 처럼 보이는 페이지 묶음 크기

const ProjectList = ({
  activeTab,
  selectedCategories = [],
  selectedBusinesses = [],
}) => {
  const [page, setPage] = useState(1); // 현재 보고있는 페이지 번호 상태

  // 탭이 바뀌거나, 카테고리/업종 체크박스 선택 시 1페이지로 리셋
  useEffect(() => {
    setPage(1);
  }, [activeTab, selectedCategories, selectedBusinesses]);

  // 페이지 전환할 때 효과
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  // 탭 상태, 선택된 카테고리/업종과 동일한 공모전만 보여주기
  const filtered = useMemo(() => {
    const byStatus = projects.filter((project) => project.status === activeTab);

    const byCategory =
      selectedCategories.length === 0
        ? byStatus
        : byStatus.filter((project) =>
            selectedCategories.includes(project.category)
          );

    const byBusiness =
      selectedBusinesses.length === 0
        ? byCategory
        : byCategory.filter((project) =>
            selectedBusinesses.includes(project.business_type)
          );

    return byBusiness;
  }, [activeTab, selectedCategories, selectedBusinesses]);

  const totalItems = filtered.length; // 필터 거친 아이템 개수
  const start = (page - 1) * PAGE_SIZE; // 현재 페이지에서 몇 번째 데이터부터 가져올지 계산
  const pageItems = filtered.slice(start, start + PAGE_SIZE); //현재 페이지에 해당하는 데이터만 잘라서 저장

  const Card = CardByStatus[activeTab];

  return (
    <div className="flex flex-col gap-4 font-pretendard">
      <div className="text-[20px] font-semibold mb-[16px]">
        {headerText[activeTab]}
      </div>

      {pageItems.length === 0 ? (
        <div className="flex flex-col justify-center items-center w-[856px] pt-[80px]">
          <img src={noProjectIcon} className="w-[120px] h-[120px]" />
          <div className="pt-[16px] text-[16px] text-[#212121] font-semibold">
            아직 공모전이 없어요.
          </div>
          <div className="pt-[8px] text-[12px] text-[#A3A3A3] font-medium">
            조금만 기다려주세요.
          </div>
        </div>
      ) : (
        <>
          {pageItems.map((project) => (
            <Card key={project.project_id} project={project} />
          ))}
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

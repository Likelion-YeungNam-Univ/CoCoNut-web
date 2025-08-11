import React, { useMemo } from "react";
import ProjectCardInProgress from "./projectCard/ProjectCardInProgress";
import ProjectCardVoting from "./projectCard/ProjectCardVoting";
import ProjectCardClosed from "./projectCard/ProjectCardClosed";

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

const ProjectList = ({ activeTab }) => {
  // 탭 상태와 동일한 status만 보여주기
  const filtered = useMemo(
    () => projects.filter((project) => project.status === activeTab),
    [projects, activeTab]
  );

  const Card = CardByStatus[activeTab];

  return (
    <div className="flex flex-col gap-4">
      <div className="text-[20px] font-pretendard font-semibold mb-[16px]">
        {headerText[activeTab]}
      </div>

      {filtered.length === 0 ? (
        <div>공모전이 없습니다.</div>
      ) : (
        filtered.map((project) => (
          <Card key={project.project_id} project={project} />
        ))
      )}
    </div>
  );
};

export default ProjectList;

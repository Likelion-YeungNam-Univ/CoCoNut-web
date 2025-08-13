import React, { useEffect, useMemo, useState } from "react";
import ProjectCardInProgress from "./projectCard/ProjectCardInProgress";
import ProjectCardVoting from "./projectCard/ProjectCardVoting";
import ProjectCardClosed from "./projectCard/ProjectCardClosed";
import Pagination from "../components/Pagination";
import noProjectIcon from "../assets/noProjectIcon.png";
import magnifierIcon from "../assets/magnifierIcon.png";

// 카테고리/업종 코드 반영한 목업 데이터
const projects = [
  {
    project_id: 1,
    title: "음식점 메뉴판 3장 디자인 필요해요",
    merchant_name: "빌런호프",
    category: "PLANNING_IDEA", // 기획 / 아이디어
    business_type: "FOOD_BEVERAGE", // 식당/카페/주점
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
    title: "SNS 광고 캠페인 기획",
    merchant_name: "마케팅랩",
    category: "ADVERTISING_MARKETING", // 광고 / 마케팅
    business_type: "RETAIL_COMMERCE", // 의류/쇼핑몰
    description: "신제품 출시 홍보를 위한 SNS 광고 캠페인 기획이 필요합니다.",
    period: "2025.08.15 - 2025.08.30",
    reward_amount: 500000,
    summary: "바이럴 마케팅 중심",
    created_at: "2025-08-12",
    deadline: "2025-08-28",
    status: "in_progress",
    user_id: 102,
    nickname: "나이키",
  },
  {
    project_id: 3,
    title: "브랜드 로고 리디자인",
    merchant_name: "오리엔탈카페",
    category: "BRANDING_LOGO", // 브랜딩 / 로고
    business_type: "BEAUTY_HEALTH", // 뷰티/헬스
    description: "브랜드 정체성을 강화하기 위한 로고 리디자인 프로젝트입니다.",
    period: "2025.07.20 - 2025.08.05",
    reward_amount: 200000,
    summary: "심플하고 세련된 느낌",
    created_at: "2025-07-19",
    deadline: "2025-08-05",
    status: "voting",
    user_id: 103,
    nickname: "한율",
  },
  {
    project_id: 4,
    title: "제품 패키지 디자인",
    merchant_name: "그린티샵",
    category: "PACKAGE_DESIGN", // 패키지 / 포장
    business_type: "EDUCATION", // 교육/학원
    description: "신규 출시되는 건강차 패키지 디자인 요청",
    period: "2025.08.01 - 2025.08.15",
    reward_amount: 350000,
    summary: "친환경 소재 사용",
    created_at: "2025-08-01",
    deadline: "2025-08-14",
    status: "in_progress",
    user_id: 104,
    nickname: "차연구소",
  },
  {
    project_id: 5,
    title: "슬로건 개발",
    merchant_name: "코스메틱스",
    category: "NAMING_SLOGAN", // 네이밍 / 슬로건
    business_type: "MEDICAL", // 병원/약국
    description: "신규 화장품 브랜드의 네이밍과 슬로건 개발",
    period: "2025.07.15 - 2025.07.25",
    reward_amount: 250000,
    summary: "글로벌 시장 진출 목표",
    created_at: "2025-07-15",
    deadline: "2025-07-25",
    status: "closed",
    user_id: 105,
    nickname: "뷰랩",
  },
  {
    project_id: 6,
    title: "캐릭터 디자인 제작",
    merchant_name: "펫토이샵",
    category: "CHARACTER_DESIGN", // 캐릭터
    business_type: "CULTURE_LEISURE", // 문화/여가
    description: "브랜드 마스코트 캐릭터 디자인",
    period: "2025.08.10 - 2025.08.25",
    reward_amount: 400000,
    summary: "귀엽고 친근한 느낌",
    created_at: "2025-08-09",
    deadline: "2025-08-25",
    status: "in_progress",
    user_id: 106,
    nickname: "루키",
  },
  {
    project_id: 7,
    title: "홍보 영상 제작",
    merchant_name: "로컬푸드마켓",
    category: "PHOTO_VIDEO_UCC", // 사진 / 영상 / UCC
    business_type: "PROFESSIONAL_SERVICE", // 서비스/전문직
    description: "지역 농산물 홍보를 위한 2분 영상 제작",
    period: "2025.08.05 - 2025.08.20",
    reward_amount: 300000,
    summary: "따뜻한 감성",
    created_at: "2025-08-04",
    deadline: "2025-08-20",
    status: "voting",
    user_id: 107,
    nickname: "상추",
  },
  {
    project_id: 8,
    title: "카페 인테리어 디자인",
    merchant_name: "커피앤드",
    category: "INTERIOR_ARCHITECTURE", // 인테리어 / 건축
    business_type: "ACCOMMODATION", // 숙박/관광
    description: "신규 카페의 인테리어 컨셉 제안",
    period: "2025.09.01 - 2025.09.15",
    reward_amount: 600000,
    summary: "빈티지 & 모던 믹스",
    created_at: "2025-08-28",
    deadline: "2025-09-15",
    status: "in_progress",
    user_id: 108,
    nickname: "커피향",
  },
  {
    project_id: 9,
    title: "웹/모바일 앱 UI 디자인",
    merchant_name: "헬스케어랩",
    category: "IT_WEB_MOBILE", // IT / 웹 / 모바일
    business_type: "ETC", // 기타
    description: "건강관리 서비스 앱 UI/UX 디자인",
    period: "2025.08.12 - 2025.08.30",
    reward_amount: 550000,
    summary: "직관적이고 깔끔한 UI",
    created_at: "2025-08-11",
    deadline: "2025-08-30",
    status: "in_progress",
    user_id: 109,
    nickname: "디자이너K",
  },
  {
    project_id: 10,
    title: "잡지 표지 디자인",
    merchant_name: "라이프스타일매거진",
    category: "GRAPHIC_EDIT", // 그래픽 / 편집
    business_type: "RETAIL_COMMERCE", // 의류/쇼핑몰
    description: "월간 잡지 표지 리디자인",
    period: "2025.07.25 - 2025.08.05",
    reward_amount: 180000,
    summary: "현대적이고 세련된 스타일",
    created_at: "2025-07-24",
    deadline: "2025-08-05",
    status: "closed",
    user_id: 110,
    nickname: "매거진편집부",
  },
  {
    project_id: 11,
    title: "기타 디자인 작업",
    merchant_name: "프리랜스팀",
    category: "ETC", // 기타
    business_type: "ETC", // 기타
    description: "다양한 디자인 작업 의뢰",
    period: "2025.08.01 - 2025.08.10",
    reward_amount: 100000,
    summary: "소규모 작업",
    created_at: "2025-08-01",
    deadline: "2025-08-10",
    status: "closed",
    user_id: 111,
    nickname: "팀워크",
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
  // 기존 + 제목 검색 필터
  const filtered = useMemo(() => {
    const rx = toSafeRegex(q);

    const byStatus = activeTab
      ? projects.filter((p) => p.status === activeTab)
      : projects.slice(); // 전체

    const byCategory =
      selectedCategories.length === 0
        ? byStatus
        : byStatus.filter((p) => selectedCategories.includes(p.category));

    const byBusiness =
      selectedBusinesses.length === 0
        ? byCategory
        : byCategory.filter((p) =>
            selectedBusinesses.includes(p.business_type)
          );

    const byTitle = rx
      ? byBusiness.filter((p) => rx.test(p.title ?? ""))
      : byBusiness;

    return byTitle;
  }, [q, activeTab, selectedCategories, selectedBusinesses]);

  const totalItems = filtered.length; // 필터 거친 아이템 개수
  const start = (page - 1) * PAGE_SIZE; // 현재 페이지에서 몇 번째 데이터부터 가져올지 계산
  const pageItems = filtered.slice(start, start + PAGE_SIZE); //현재 페이지에 해당하는 데이터만 잘라서 저장

  const emptyBySearch = isSearched && q.trim() !== "" && pageItems.length === 0;

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
                key={project.project_id}
                project={project}
                categories={categories}
                businessTypes={businessTypes}
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

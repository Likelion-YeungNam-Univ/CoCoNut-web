// src/pages/ProjectDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import MerchantHeader from "../header/MerchantHeader";
import api from "../apis/api";

// 투표 그리드 (components 루트에 생성)
import ParticipantVoteGrid from "../components/ParticipantVoteGrid";

// 아이콘 및 이미지
import calendarIcon from "../assets/calendarIcon.png";
import participantIcon from "../assets/participantIcon.png";
import prizeIcon from "../assets/prizeIcon.png";
import { CgMenuBoxed } from "react-icons/cg";
import { IoPersonCircle } from "react-icons/io5";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import { AiFillDelete } from "react-icons/ai";

// 데이터 및 컴포넌트
import { STYLES_DATA } from "../utils/stylesData";
import { TARGETS_DATA } from "../utils/targetData";
import { COLORS_DATA } from "../utils/colorData";
import ContentSubmissionsTabs from "../components/ContentSubmissionsTabs";
import Footer from "../components/Footer";
import DeleteModal from "../components/DeleteModal";

// ⚠️ (선택) 아래 모달 컴포넌트를 실제로 쓰고 있다면 import 유지
// import SubmissionDetailModal from "../components/SubmissionDetailModal";

const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return "가격 없음";
  const numericAmount = Number(String(amount).replace(/[^0-9]/g, ""));
  if (isNaN(numericAmount)) return amount;
  return `${numericAmount.toLocaleString()}원`;
};

// 더미 참여작 (API 연동 전 테스트용)
const DUMMY_SUBMISSIONS = [
  {
    id: 1,
    title: "참여작 제목 1",
    writerNickname: "참가자1",
    imageUrl: "https://via.placeholder.com/600/D3D3D3/000000?text=Submission+1",
    description: "참여작 내용입니다.",
  },
  {
    id: 2,
    title: "참여작 제목 2",
    writerNickname: "참가자2",
    imageUrl: "https://via.placeholder.com/600/D3D3D3/000000?text=Submission+2",
    description: "두 번째 참여작입니다.",
  },
  {
    id: 3,
    title: "참여작 제목 3",
    writerNickname: "참가자3",
    imageUrl: "https://via.placeholder.com/600/D3D3D3/000000?text=Submission+3",
    description: "세 번째 참여작입니다.",
  },
    {
    id: 4,
    title: "참여작 제목 4",
    writerNickname: "참가자4",
    imageUrl: "https://via.placeholder.com/600/D3D3D3/000000?text=Submission+1",
    description: "참여작 내용입니다.",
  },
    {
    id: 5,
    title: "참여작 제목 5",
    writerNickname: "참가자5",
    imageUrl: "https://via.placeholder.com/600/D3D3D3/000000?text=Submission+1",
    description: "참여작 내용입니다.",
  },
    {
    id: 6,
    title: "참여작 제목 6",
    writerNickname: "참가자6",
    imageUrl: "https://via.placeholder.com/600/D3D3D3/000000?text=Submission+1",
    description: "참여작 내용입니다.",
  },
];

const ProjectDetail = ({ role }) => {
  const [activeTab, setActiveTab] = useState("CONTENT");
  const [projectData, setProjectData] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { projectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        const projectResponse = await api.get(`/projects/${projectId}`);
        setProjectData(projectResponse.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch project details:", err);
        if (err.response && err.response.status === 404) {
          setError("해당 프로젝트를 찾을 수 없습니다.");
        } else {
          setError("프로젝트 정보를 불러오는 데 실패했습니다.");
        }
        setProjectData(null);
      } finally {
        setLoading(false);
      }
    };

    // 현재는 API 대신 더미 사용
    setSubmissions(DUMMY_SUBMISSIONS);
    fetchProjectDetails();
  }, [projectId]);

  const toggleOptionsModal = () => {
    setIsOptionsModalOpen(!isOptionsModalOpen);
  };

  const handleOpenDeleteModal = () => {
    setIsOptionsModalOpen(false);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/projects/${projectId}`);
      alert("프로젝트가 성공적으로 삭제되었습니다.");
      navigate("/merchant-main-page");
    } catch (err) {
      console.error("프로젝트 삭제 실패:", err);
      alert("프로젝트 삭제에 실패했습니다.");
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleSubmissionClick = (submission) => {
    setSelectedSubmission(submission);
  };

  const handleCloseSubmissionModal = () => {
    setSelectedSubmission(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>프로젝트 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>{error}</p>
      </div>
    );
  }

  if (!projectData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>프로젝트 데이터를 불러오지 못했습니다.</p>
      </div>
    );
  }

  const CATEGORIES_MAP = {
    PLANNING_IDEA: "기획/아이디어",
    ADVERTISING_MARKETING: "광고/마케팅",
    BRANDING_LOGO: "브랜딩/로고",
    PACKAGE_DESIGN: "패키지/포장",
    NAMING_SLOGAN: "네이밍/슬로건",
    CHARCTER_DESIGN: "캐릭터",
    PHOTO_VIDEO_UCC: "사진/영상/UCC",
    INTERIOR_ARCHITECTURE: "인테리어/건축",
    IT_WEB_MOBILE: "IT/웹/모바일",
    ETC: "기타",
  };

  const BUSINESSTYPES_MAP = {
    FOOD_BEVERAGE: "식당/카페/주점",
    LEISURE_SPORTS: "문화/여가",
    EDUCATION: "교육/학원",
    BEAUTY_HEALTH: "뷰티/헬스",
    RETAIL_COMMERCE: "의류/쇼핑몰",
    MEDICAL: "병원/약국",
    PROFESSIONAL_SERVICE: "서비스/전문직",
    ACCOMMAODATION: "숙박/관광",
    ETC: "기타",
  };

  const getCategoryLabel = (code) => CATEGORIES_MAP[code] || "카테고리 없음";
  const getBusinessTypeLabel = (code) => BUSINESSTYPES_MAP[code] || "업종 없음";

  const daysLeft = projectData.deadline
    ? Math.ceil(
        (new Date(projectData.deadline).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  const projectStatus = daysLeft > 0 ? "ongoing" : "ended";
  const hasSubmissions = projectData.submissionsCount > 0;

  return (
    <div className="flex flex-col min-h-screen font-pretendard">
      <MerchantHeader />
      <div className="flex-grow bg-[#FFFFFF] py-8 px-40">
        <div className="p-15">
          {/* 카테고리/업종 라벨 */}
          <div className="flex items-center justify-between text-gray-500 text-sm mb-4">
            <div className="flex items-center space-x-2 text-[#828282]">
              <span className="text-[#A3A3A3] text-[12px] font-normal">
                {daysLeft === 0 ? "오늘 마감" : `${daysLeft}일 후 마감`}
              </span>
              <span className="text-[#E1E1E1] text-[10px]">|</span>
              <span className="text-[#a3a3a3] text-[12px] font-normal">
                {getCategoryLabel(projectData.category)}
              </span>
              <span className="text-[#E1E1E1] text-[10px]">・</span>
              <span className="text-[#A3A3A3] text-[12px] font-normal">
                {getBusinessTypeLabel(projectData.businessType)}
              </span>
            </div>
          </div>

          {/* 제목 + 옵션 버튼 */}
          <div className="flex items-start justify-between mb-2">
            <h1 className="text-[28px] font-semibold text-[#212121] ">
              {projectData.title || "공모전 제목 없음"}
            </h1>
            <div className="relative">
              <button onClick={toggleOptionsModal}>
                <PiDotsThreeVerticalBold className="w-[30px] h-[30px] text-[#212121]" />
              </button>
              {isOptionsModalOpen && (
                <div
                  className="absolute right-0 top-10 bg-white border border-[#F3F3F3] rounded-md shadow-md py-2 w-38 z-10"
                  style={{ zIndex: 100 }}
                >
                  <button
                    className="flex items-center px-4 py-2 text-[#4C4C4C] hover:bg-gray-100 w-full text-left"
                    onClick={handleOpenDeleteModal}
                  >
                    <div className="flex space-x-2">
                      <AiFillDelete className="text-[#C3C3C3]" />
                      <span className="text-[#828282] text-[12px]">삭제하기</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 작성자/가게 */}
          <div className="flex space-x-2 mb-3">
            <IoPersonCircle className="text-[#B9B9B9] w-[20px] h-[20px]" />
            <p className="text-sm text-[#828282] mb-6">
              <span className="font-normal text-[#A3A3A3]">
                {projectData.merchantName || "가게명 없음"}
              </span>
              <span className="text-[#E1E1E1] text-[10px] mx-2">|</span>
              <span className="font-normal text-[#A3A3A3]">
                {projectData.writerNickname || "닉네임 없음"}
              </span>
            </p>
          </div>

          {/* 상금/참여작/기간 */}
          <div className="space-y-3 text-[#4C4C4C] mb-8">
            <div className="flex items-center space-x-2">
              <img src={prizeIcon} alt="상금 아이콘" className="h-4 w-4" />
              <span className="text-[14px] text-[#828282] font-medium w-[80px]">상금</span>
              <p className="text-[14px] font-medium text-[#212121]">
                {formatCurrency(projectData.rewardAmount)}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <img src={participantIcon} alt="참여작 아이콘" className="h-4 w-4" />
              <span className="text-[14px] text-[#828282] font-medium w-[80px]">참여작</span>
              <p className="text-[14px] font-medium text-[#212121]">{submissions.length}</p>
            </div>
            <div className="flex items-center space-x-2">
              <img src={calendarIcon} alt="기간 아이콘" className="h-4 w-4" />
              <span className="text-[14px] text-[#828282] font-medium w-[80px]">기간</span>
              <p className="text-[14px] font-medium text-[#212121]">
                {projectData.deadline
                  ? `${projectData.createdAt || "기간 없음"} ~ ${projectData.deadline}`
                  : "기간 없음"}
              </p>
            </div>
          </div>

          {/* 참가자 로그인 시 참가하기 버튼 */}
          {role === "participant" && (
            <button
              onClick={() => navigate(`/projects/${projectId}/submission`)}
              className="w-[95px] h-[45px] px-[20px] py-[12px] text-[16px] font-medium bg-[#2FD8F6] text-white rounded-[8px] leading-[130%] tracking-[-0.02em] hover:bg-[#2AC2DD] cursor-pointer"
            >
              참가하기
            </button>
          )}

          {/* 탭 */}
          <div className="pt-[60px]">
            <ContentSubmissionsTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          {/* 탭 콘텐츠 */}
          {activeTab === "CONTENT" ? (
            <div className="space-y-4 mt-18">
              {projectData.summary && (
                <div>
                  <h2 className="text-[16px] font-semibold text-[#212121] mb-2">한 줄 소개</h2>
                  <p className="text-[16px] font-normal">{projectData.summary}</p>
                </div>
              )}

              <div className="flex flex-col space-y-4">
                <h2
                  className={`text-[16px] font-semibold text-[#212121] ${
                    projectData.summary ? "mt-16" : ""
                  }`}
                >
                  내용
                </h2>

                {projectData.imageUrl && (
                  <div className="p-4 bg-[#EBEBEB] rounded-md text-[#4C4C4C] whitespace-pre-wrap w-full font-pretendard">
                    <img src={projectData.imageUrl} alt="업로드 이미지" className="..." />
                  </div>
                )}

                <div className="text-base font-normal whitespace-pre-wrap">
                  {projectData.description || "내용 없음"}
                </div>
              </div>

              {/* 색상 */}
              <div className="space-y-4 mb-8">
                <div>
                  <h2 className="text-[16px] font-semibold text-[#212121] mt-16">색상</h2>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {projectData.colors && projectData.colors.length > 0 ? (
                      projectData.colors[0] === "color_free" ? (
                        <span className="px-4 py-2 rounded border border-[#F3F3F3] text-sm bg-white text-[#212121] flex items-center justify-center col-span-3">
                          색상 자유
                        </span>
                      ) : (
                        projectData.colors.map((colorCode, index) => {
                          const colorItem = COLORS_DATA.find((item) => item.code === colorCode);
                          return colorItem ? (
                            <span
                              key={index}
                              className="w-[330px] h-[88px] rounded flex items-center justify-center"
                              style={{ background: colorItem.hex }}
                            ></span>
                          ) : null;
                        })
                      )
                    ) : (
                      <span className="text-[#A3A3A3] text-sm col-span-3">선택 안 함</span>
                    )}
                  </div>
                </div>

                {/* 스타일 */}
                <div>
                  <h2 className="text-[16px] font-semibold text-[#212121] mt-16">스타일</h2>
                  <div className="grid grid-cols-6 gap-2 mt-2">
                    {projectData.styles && projectData.styles.length > 0 ? (
                      projectData.styles[0] === "style_free" ? (
                        <span className="w-[130px] h-[48px] rounded border border-[#F3F3F3] text-sm bg-white text-[#212121] flex items-center justify-center col-span-6">
                          스타일 자유
                        </span>
                      ) : (
                        projectData.styles.map((styleValue, index) => {
                          const styleItem = STYLES_DATA.find((s) => s.value === styleValue);
                          return styleItem ? (
                            <span
                              key={index}
                              className="w-[152px] h-[48px] rounded border border-[#F3F3F3] text-sm bg-white text-black flex items-center justify-center text-center"
                            >
                              {styleItem.label}
                            </span>
                          ) : null;
                        })
                      )
                    ) : (
                      <span className="text-[#A3A3A3] text-sm col-span-6">선택 안 함</span>
                    )}
                  </div>
                </div>

                {/* 타겟 */}
                <div>
                  <h2 className="text-[16px] font-semibold text-[#212121] mt-16">타겟</h2>
                  <div className="grid grid-cols-6 gap-2 mt-2">
                    {projectData.targets && projectData.targets.length > 0 ? (
                      projectData.targets[0] === "target_free" ? (
                        <span className="w-[130px] h-[48px] rounded border border-[#F3F3F3] text-sm bg-white text-[#212121] flex items-center justify-center col-span-6">
                          타겟 자유
                        </span>
                      ) : (
                        projectData.targets.map((targetValue, index) => {
                          const targetItem = TARGETS_DATA.find((t) => t.value === targetValue);
                          return targetItem ? (
                            <span
                              key={index}
                              className="w-[152px] h-[48px] rounded border border-[#F3F3F3] text-sm bg-white text-black flex items-center justify-center text-center"
                            >
                              {targetItem.label}
                            </span>
                          ) : null;
                        })
                      )
                    ) : (
                      <span className="text-[#A3A3A3] text-sm col-span-6">선택 안 함</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // ✅ 참여작 탭: 썸네일 그리드 → 투표 그리드로 교체
            <ParticipantVoteGrid
              submissions={submissions}
              voteStartDate="2025.08.21"
              voteEndDate="2025.08.27"
              onVote={(s) => {
                alert(`투표 완료! 선택 작품: ${s.title || s.id}`);
                // 필요 시 여기서 API 호출/리프레시 등 처리
              }}
            />
          )}
        </div>
      </div>

      <Footer />

      {/* 삭제 모달 */}
      {isDeleteModalOpen && (
        <DeleteModal
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          projectStatus={projectStatus}
          hasSubmissions={hasSubmissions}
        />
      )}

      {/* (선택) 참여작 상세 모달 – 투표 모드에선 사용 안 하지만 기존 유지 */}
      {selectedSubmission && typeof SubmissionDetailModal !== "undefined" && (
        <SubmissionDetailModal submission={selectedSubmission} onClose={handleCloseSubmissionModal} />
      )}
    </div>
  );
};

export default ProjectDetail;

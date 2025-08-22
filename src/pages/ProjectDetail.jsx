// src/pages/ProjectDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import MerchantHeader from "../header/MerchantHeader";
import api from "../apis/api";
import { fetchSubmissions } from "../apis/getSubmissionsApi";
import { fetchUserInfo } from "../apis/userApi";
import ParticipantVoteGrid from "../components/ParticipantVoteGrid";
import MerchantVoteManage from "../components/MerchantVoteManage";
import ParticipantVoteManage from "../components/ParticipantVoteManage";
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
import SubmissionThumbnail from "../components/SubmissionThumbnail";
import SubmissionDetailModal from "../components/SubmissionDetailModal";
import ParticipantHeader from "../header/ParticipantHeader";

const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return "가격 없음";
  const numericAmount = Number(String(amount).replace(/[^0-9]/g, ""));
  if (isNaN(numericAmount)) return amount;
  return `${numericAmount.toLocaleString()}원`;
};

/** ✅ 우승작 id를 도출 — 서버의 submissions winner(boolean)를 1순위로 사용 */
const deriveWinnerId = (p, subs = []) => {
  if (!p && !subs?.length) return null;

  // 1) 서버가 각 제출물에 내려주는 winner 플래그 사용
  const byWinnerFlag = subs.find((s) => s?.winner === true)?.submissionId;
  if (byWinnerFlag) return byWinnerFlag;

  // 2) (혹시 남아있을 수 있는) 프로젝트/리워드 필드들 대비
  return (
    p?.winnerSubmissionId ??
    p?.winnerId ??
    p?.awardedSubmissionId ??
    p?.winnerSubmission?.submissionId ??
    p?.reward?.submissionId ??
    (Array.isArray(p?.rewards) && p.rewards[0]?.submissionId) ??
    null
  );
};

const ProjectDetail = ({ role }) => {
  // ---------------- Hooks (항상 최상단, 조기 리턴보다 위) ----------------
  const [projectData, setProjectData] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const { projectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const initialTab = location.state?.initialTab || "CONTENT";
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const data = await fetchUserInfo();
        setUserInfo(data);
      } catch (err) {
        console.error("사용자 정보 불러오기 실패:", err);
      }
    };
    loadUserInfo();
  }, []);

  useEffect(() => {
    if (!userInfo) return;
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        const projectResponse = await api.get(`/projects/${projectId}`);
        setProjectData(projectResponse.data);

        const submissionsData = await fetchSubmissions(projectId);
        setSubmissions(submissionsData);

        setError(null);
      } catch (err) {
        console.error("Failed to fetch project details:", err);
        if (err?.response?.status === 404) {
          setError("해당 프로젝트를 찾을 수 없습니다.");
        } else {
          setError("프로젝트 정보를 불러오는 데 실패했습니다.");
        }
        setProjectData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId, location.state?.refresh, userInfo]);

  // ✅ 서버/제출물에서 우승작 id 계산 (hook 아님)
  const winnerIdFromServer = deriveWinnerId(projectData, submissions);

  // ❌ sessionStorage 기반 복구 로직 완전 제거 (이제 서버의 winner만 신뢰)

  // ---------------- 조기 리턴 (훅들보다 아래) ----------------
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

  // ---------------- 나머지 파생 값 ----------------
  const hasMySubmission = submissions.some(
    (sub) => sub.userId === userInfo?.user_id
  );

  const deadline = projectData.deadline ? new Date(projectData.deadline) : null;
  const toYMD = (d) => {
    if (!(d instanceof Date) || isNaN(d)) return null;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}.${m}.${day}`; // ← 2025.08.23 이런식으로 반환
  };

  const voteStartForGrid =
    projectData.voteStartDate ??
    (deadline
      ? toYMD(new Date(deadline.getTime() + 1 * 24 * 60 * 60 * 1000))
      : null);
  const voteEndForGrid =
    projectData.voteEndDate ??
    (deadline
      ? toYMD(new Date(deadline.getTime() + 7 * 24 * 60 * 60 * 1000))
      : null);

  let fallbackStatus = "IN_PROGRESS";
  if (deadline) {
    const now = new Date();
    const votingEnd = new Date(deadline);
    votingEnd.setDate(votingEnd.getDate() + 7);
    if (now <= deadline) fallbackStatus = "IN_PROGRESS";
    else if (now > deadline && now <= votingEnd) fallbackStatus = "VOTING";
    else fallbackStatus = "CLOSED";
  }
  const projectStatus = projectData?.status ?? fallbackStatus;

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
        (new Date(projectData.deadline).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  const hasSubmissions = projectData.submissionsCount > 0;

  const isParticipant = userInfo?.role === "ROLE_USER";
  const isMerchant = userInfo?.role === "ROLE_BUSINESS";
  const isMyProject = isMerchant && userInfo?.user_id === projectData.userId;

  let displayedSubmissions = [...submissions];
  if (isParticipant) {
    const mySubmission = submissions.find(
      (sub) => sub.userId === userInfo?.user_id
    );
    if (mySubmission) {
      displayedSubmissions = [
        mySubmission,
        ...submissions.filter((sub) => sub.userId !== userInfo?.user_id),
      ];
    }
  }

  return (
    <div className="flex flex-col min-h-screen font-pretendard">
      {isMerchant ? <MerchantHeader /> : <ParticipantHeader />}

      <div className="flex-grow bg-[#FFFFFF] py-8 px-40">
        <div className="p-15">
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

          <div className="flex items-start justify-between mb-2">
            <h1 className="text-[28px] font-semibold text-[#212121] ">
              {projectData.title || "공모전 제목 없음"}
            </h1>
            {isMerchant && isMyProject && (
              <div className="relative">
                <button
                  onClick={() => setIsOptionsModalOpen(!isOptionsModalOpen)}
                >
                  <PiDotsThreeVerticalBold className="w-[30px] h-[30px] text-[#212121]" />
                </button>
                {isOptionsModalOpen && (
                  <div
                    className="absolute right-0 top-10 bg-white border border-[#F3F3F3] rounded-md py-2 w-38 z-10"
                    style={{ zIndex: 100 }}
                  >
                    <button
                      className="flex items-center px-4 py-2 text-[#4C4C4C] hover:bg-gray-100 w-full text-left"
                      onClick={() => {
                        setIsOptionsModalOpen(false);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      <div className="flex space-x-2">
                        <AiFillDelete className="text-[#C3C3C3]" />
                        <span className="text-[#828282] text-[12px]">
                          삭제하기
                        </span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

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

          <div className="space-y-3 text-[#4C4C4C] mb-8">
            <div className="flex items-center space-x-2">
              <img src={prizeIcon} alt="상금 아이콘" className="h-4 w-4" />
              <span className="text-[14px] text-[#828282] font-medium w-[80px]">
                상금
              </span>
              <p className="text-[14px] font-medium text-[#212121]">
                {formatCurrency(projectData.rewardAmount)}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <img
                src={participantIcon}
                alt="참여작 아이콘"
                className="h-4 w-4"
              />
              <span className="text-[14px] text-[#828282] font-medium w-[80px]">
                참여작
              </span>
              <p className="text-[14px] font-medium text-[#212121]">
                {submissions.length}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <img src={calendarIcon} alt="기간 아이콘" className="h-4 w-4" />
              <span className="text-[14px] text-[#828282] font-medium w-[80px]">
                기간
              </span>
              <p className="text-[14px] font-medium text-[#212121]">
                {projectData.deadline
                  ? `${projectData.createdAt || "기간 없음"} ~ ${
                      projectData.deadline
                    }`
                  : "기간 없음"}
              </p>
            </div>
          </div>

          {/* 참가자로 로그인한 경우 참가하기 버튼 */}
          {role === "participant" && (
            <button
              onClick={() =>
                !hasMySubmission &&
                navigate(`/projects/${projectId}/submission`)
              }
              className={`w-[95px] h-[45px] px-[20px] py-[12px] text-[16px] font-medium rounded-[8px] leading-[130%] tracking-[-0.02em]  ${
                hasMySubmission
                  ? "bg-[#E1E1E1] text-white"
                  : "bg-[#2FD8F6] text-white hover:bg-[#2AC2DD] cursor-pointer"
              }`}
            >
              {hasMySubmission ? "참가완료" : "참가하기"}
            </button>
          )}

          <div className="pt-[60px]">
            <ContentSubmissionsTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>

          {activeTab === "CONTENT" ? (
            /* ====== CONTENT 탭 ====== */
            <div className="space-y-4 mt-18">
              {projectData.summary && (
                <div>
                  <h2 className="text-[16px] font-semibold text-[#212121] mb-2">
                    한 줄 소개
                  </h2>
                  <p className="text-[16px] font-normal">
                    {projectData.summary}
                  </p>
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
                  <div className="p-4 rounded-md text-[#4C4C4C] whitespace-pre-wrap w-full font-pretendard">
                    <img
                      src={projectData.imageUrl}
                      alt="업로드 이미지"
                      className="..."
                    />
                  </div>
                )}
                <div className="text-base font-normal whitespace-pre-wrap">
                  {projectData.description || "내용 없음"}
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div>
                  <h2 className="text-[16px] font-semibold text-[#212121] mt-16">
                    색상
                  </h2>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {projectData.colors && projectData.colors.length > 0 ? (
                      projectData.colors[0] === "color_free" ? (
                        <span className="px-4 py-2 rounded border border-[#F3F3F3] text-sm bg-white text-[#212121] flex items-center justify-center col-span-3">
                          색상 자유
                        </span>
                      ) : (
                        projectData.colors.map((colorCode, index) => {
                          const colorItem = COLORS_DATA.find(
                            (item) => item.code === colorCode
                          );
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
                      <span className="text-[#A3A3A3] text-sm col-span-3">
                        선택 안 함
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h2 className="text-[16px] font-semibold text-[#212121] mt-16">
                    스타일
                  </h2>
                  <div className="grid grid-cols-6 gap-2 mt-2">
                    {projectData.styles && projectData.styles.length > 0 ? (
                      projectData.styles[0] === "style_free" ? (
                        <span className="w-[130px] h-[48px] rounded border border-[#F3F3F3] text-sm bg-white text-[#212121] flex items-center justify-center col-span-6">
                          스타일 자유
                        </span>
                      ) : (
                        projectData.styles.map((styleValue, index) => {
                          const styleItem = STYLES_DATA.find(
                            (s) => s.value === styleValue
                          );
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
                      <span className="text-[#A3A3A3] text-sm col-span-6">
                        선택 안 함
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h2 className="text-[16px] font-semibold text-[#212121] mt-16">
                    타겟
                  </h2>
                  <div className="grid grid-cols-6 gap-2 mt-2">
                    {projectData.targets && projectData.targets.length > 0 ? (
                      projectData.targets[0] === "target_free" ? (
                        <span className="w-[130px] h-[48px] rounded border border-[#F3F3F3] text-sm bg-white text-[#212121] flex items-center justify-center col-span-6">
                          타겟 자유
                        </span>
                      ) : (
                        projectData.targets.map((targetValue, index) => {
                          const targetItem = TARGETS_DATA.find(
                            (t) => t.value === targetValue
                          );
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
                      <span className="text-[#A3A3A3] text-sm col-span-6">
                        선택 안 함
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ====== 참여작 탭 ====== */
            <>
              {winnerIdFromServer ? ( // 선정작 존재
                <div className="mt-6">
                  {isMerchant ? ( // 선정작이 존재하고 소상공인일때
                    <MerchantVoteManage
                      projectId={projectId}
                      submissions={submissions.map((s) => ({
                        id: s.submissionId,
                        submissionId: s.submissionId,
                        title: s.title,
                        writerNickname: s.writerNickname,
                        imageUrl: s.imageUrl,
                      }))}
                      voteStartDate={voteStartForGrid}
                      voteEndDate={voteEndForGrid}
                      winnerSubmissionId={winnerIdFromServer}
                      projectStatus={projectStatus}
                    />
                  ) : (
                    <ParticipantVoteManage // 선정작이 존재하고 참가자일때
                      projectId={projectId}
                      submissions={submissions.map((s) => ({
                        id: s.submissionId,
                        submissionId: s.submissionId,
                        title: s.title,
                        writerNickname: s.writerNickname,
                        imageUrl: s.imageUrl,
                      }))}
                      voteStartDate={voteStartForGrid}
                      voteEndDate={voteEndForGrid}
                      winnerSubmissionId={winnerIdFromServer}
                      projectStatus={projectStatus}
                    />
                  )}
                </div>
              ) : projectStatus === "CLOSED" ? ( //마감일때
                isMerchant && isMyProject ? (
                  <div className="mt-6">
                    <MerchantVoteManage
                      projectId={projectId}
                      submissions={submissions.map((s) => ({
                        id: s.submissionId,
                        submissionId: s.submissionId,
                        title: s.title,
                        writerNickname: s.writerNickname,
                        imageUrl: s.imageUrl,
                      }))}
                      voteStartDate={voteStartForGrid}
                      voteEndDate={voteEndForGrid}
                      winnerSubmissionId={null}
                      uiVariant="result"
                      projectStatus={projectStatus}
                      onWinnerSelected={(winnerId, reward) => {
                        setProjectData((prev) => ({
                          ...prev,
                          winnerSubmissionId: winnerId,
                          reward: reward ?? prev?.reward,
                        }));
                        setSubmissions((prev) =>
                          prev.map((s) => ({
                            ...s,
                            winner: s.submissionId === winnerId,
                          }))
                        );
                      }}
                    />
                  </div>
                ) : (
                  <div className="mt-6">
                    <ParticipantVoteManage
                      projectId={projectId}
                      submissions={submissions.map((s) => ({
                        id: s.submissionId,
                        submissionId: s.submissionId,
                        title: s.title,
                        writerNickname: s.writerNickname,
                        imageUrl: s.imageUrl,
                      }))}
                      voteStartDate={voteStartForGrid}
                      voteEndDate={voteEndForGrid}
                      winnerSubmissionId={null}
                      projectStatus={projectStatus}
                    />
                  </div>
                )
              ) : projectStatus === "VOTING" ? (
                isMerchant && isMyProject ? (
                  <div className="mt-6">
                    <MerchantVoteManage
                      projectId={projectId}
                      submissions={submissions.map((s) => ({
                        id: s.submissionId,
                        submissionId: s.submissionId,
                        title: s.title,
                        writerNickname: s.writerNickname,
                        imageUrl: s.imageUrl,
                      }))}
                      voteStartDate={voteStartForGrid}
                      voteEndDate={voteEndForGrid}
                      winnerSubmissionId={null}
                      onWinnerSelected={(winnerId, reward) => {
                        setProjectData((prev) => ({
                          ...prev,
                          winnerSubmissionId: winnerId,
                          reward: reward ?? prev?.reward,
                        }));
                        setSubmissions((prev) =>
                          prev.map((s) => ({
                            ...s,
                            winner: s.submissionId === winnerId,
                          }))
                        );
                      }}
                    />
                  </div>
                ) : (
                  <div className="mt-6">
                    <ParticipantVoteGrid
                      projectId={projectId}
                      userId={userInfo?.user_id}
                      mySubmissionId={
                        submissions.find((s) => s.userId === userInfo?.user_id)
                          ?.submissionId ?? null
                      }
                      submissions={submissions.map((s) => ({
                        id: s.submissionId,
                        submissionId: s.submissionId,
                        title: s.title,
                        writerNickname: s.writerNickname,
                        imageUrl: s.imageUrl,
                      }))}
                      voteStartDate={voteStartForGrid}
                      voteEndDate={voteEndForGrid}
                      forceOpen
                    />
                  </div>
                )
              ) : (
                // ✅ 그 외: 썸네일 뷰
                <div className="flex flex-col">
                  {submissions.length > 0 ? (
                    <div className="grid grid-cols-4 gap-8 mt-16">
                      {displayedSubmissions.map((submission) => {
                        const blurForParticipant =
                          isParticipant &&
                          submission.userId !== userInfo?.user_id;
                        const blurForMerchant = isMerchant && !isMyProject;
                        return (
                          <SubmissionThumbnail
                            key={submission.submissionId}
                            submission={submission}
                            onClick={(s) => {
                              const canOpenDetail =
                                (isMerchant && isMyProject) ||
                                (isParticipant &&
                                  s.userId === userInfo?.user_id);
                              if (canOpenDetail) setSelectedSubmission(s);
                            }}
                            isBlur={blurForParticipant || blurForMerchant}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[300px] mt-16">
                      <CgMenuBoxed size={120} className="text-[#E1E1E1]" />
                      <div className="flex flex-col items-center mt-10">
                        <label className="text-[#A3A3A3] text-[12px] font-medium">
                          아직 참여작이 없습니다.
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center">
        <button
          onClick={() => {
            if (isMerchant) {
              navigate("/merchant-main-page");
            } else if (isParticipant) {
              navigate("/participant-main-page");
            }
          }}
          className="px-6 py-3 bg-[#2FD8F6] text-white rounded-md font-medium text-base hover:bg-[#2AC2DD] transition-colors"
        >
          메인으로 돌아가기
        </button>
        <Footer />
      </div>

      {isDeleteModalOpen && (
        <DeleteModal
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={async () => {
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
          }}
          projectStatus={projectStatus}
          hasSubmissions={hasSubmissions}
        />
      )}

      {selectedSubmission && (
        <SubmissionDetailModal
          isOpen={
            !!selectedSubmission &&
            ((isMerchant && isMyProject) ||
              (isParticipant &&
                selectedSubmission.userId === userInfo?.user_id))
          }
          submissionId={selectedSubmission.submissionId}
          onClose={() => setSelectedSubmission(null)}
          role={role}
        />
      )}
    </div>
  );
};

export default ProjectDetail;

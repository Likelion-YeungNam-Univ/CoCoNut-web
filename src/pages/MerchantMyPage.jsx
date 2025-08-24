import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MerchantHeader from "../header/MerchantHeader";
import { IoPersonCircle } from "react-icons/io5";
import { PiNotebook } from "react-icons/pi";
import api from "../apis/api";
import Footer from "../components/Footer";
import BasicModal from "../components/BasicModal";
import {
  PERSONAL_INFO_CONSENT,
  SERVICE_TERMS_DATA,
  WITHDRAWAL_DATA,
} from "../utils/termsData";
import ProjectCardClosed from "../main/projectCard/ProjectCardClosed";

const MyPageContent = ({
  selectedTab,
  userData,
  userProjects,
  openLogoutModal,
  openWithdrawalModal,
  navigate,
  isWithdrawalAgreed,
  setIsWithdrawalAgreed,
}) => {
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

  const [csText, setCsText] = useState("");
const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

const handleSubmitCustomerService = async () => {
  const content = csText.trim();
  if (!content) {
    alert("내용을 입력해 주세요.");
    textareaRef.current?.focus();
    return;
  }
  try {

    setIsSubmitModalOpen(true); 
    setCsText("");              

    setTimeout(() => textareaRef.current?.focus(), 0);
  } catch (e) {
    console.error("고객센터 전송 실패:", e);
    alert("전송에 실패했습니다. 잠시 후 다시 시도해 주세요.");
  }
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

  const categories = Object.keys(CATEGORIES_MAP).map((key) => ({
    code: key,
    description: CATEGORIES_MAP[key],
  }));

  const businessTypes = Object.keys(BUSINESSTYPES_MAP).map((key) => ({
    code: key,
    description: BUSINESSTYPES_MAP[key],
  }));

  const closedProjects = userProjects.filter(
    (project) => project.status === "CLOSED"
  );
  const totalProjectsCount = userProjects.length;
  const completedCount = closedProjects.length;

  switch (selectedTab) {
    case "profile":
      return (
        <div className="p-8">
          <h2 className="font-semibold text-[20px] mb-4 text-[#212121]">
            내 프로필
          </h2>
          <hr className="mb-4" />
          <div className="flex flex-col space-y-8">
            <div className="flex items-center space-x-8 justify-between">
              <div className="flex items-center space-x-4 ml-8 mt-5">
                <IoPersonCircle className="text-[#B9B9B9] w-[80px] h-[80px]" />
                <div className="flex flex-col space-y-1">
                  <span className="font-semibold text-base text-[#212121] text-[20px]">
                    {userData.nickname}
                  </span>
                  <span className="font-normal text-[#4C4C4C] text-[14px]">
                    {userData.email}
                  </span>
                </div>
              </div>
              <div className="flex flex-row justify-end mr-16 space-x-8 mt-5">
                <div className="flex flex-col items-left">
                  <span className="text-[14px] text-[#A3A3A3] font-normal">
                    공모전 등록
                  </span>
                  <span className=" text-[#212121] text-[16px] font-semibold mt-1">
                    {totalProjectsCount}회
                  </span>
                </div>
                <div className="flex-1 border-l border-gray-200 pl-8 flex">
                  <div className="flex flex-col items-left">
                    <span className="text-sm text-[#A3A3A3] font-normal">
                      거래 완료
                    </span>
                    <span className="text-[#212121] text-[16px] font-semibold mt-1">
                      {completedCount}회
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <hr className="text-[#E1E1E1]" />
            {closedProjects && closedProjects.length > 0 ? (
              <>
                <h2 className="font-semibold text-[20px] mt-8 mb-4 text-[#212121]">
                  선정한 공모전
                </h2>
                <div className="flex flex-col space-y-4">
                  {closedProjects.map((project) => (
                    <ProjectCardClosed
                      key={project.projectId}
                      project={project}
                      categories={categories}
                      businessTypes={businessTypes}
                      navigate={navigate}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col space-y-2 items-center justify-center p-36 bg-white">
                <PiNotebook className="w-[120px] h-[120px] text-[#F3F3F3]" />
                <p className="text-[16px] font-semibold text-[#212121]">
                  아직 공모전이 없어요.
                </p>
                <p className="text-[12px] font-medium text-[#A3A3A3]">
                  가게에 필요한 도움을 요청해 보세요.
                </p>
              </div>
            )}
          </div>
        </div>
      );
    case "terms":
      return (
        <div className="p-8">
          <h2 className="font-semibold text-[20px] mb-4 text-[#212121]">
            약관 및 정책
          </h2>
          <hr className="mb-4" />
          <div className="text-sm space-y-4">
            <div>
              <h3 className="font-medium text-[#212121] text-base mt-12">
                서비스 이용약관 동의
              </h3>
              <div className="w-[744px] h-[280px] border border-[#F3F3F3] mt-4 rounded-lg overflow-y-auto">
                <div className="p-6">
                  {SERVICE_TERMS_DATA.sections.map((section, index) => (
                    <div key={index} className="mb-4">
                      <h1 className="text-[#212121] font-medium text-[14px]">
                        {section.heading}
                      </h1>
                      {Array.isArray(section.content) ? (
                        section.content.map((item, itemIndex) => (
                          <div key={itemIndex}>
                            <h3 className="text-[#626262] text-[14px] font-normal mt-2">
                              {item.subheading}
                            </h3>
                            <p className="text-[#626262] text-[14px]">
                              {item.text}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-[#626262] text-[14px]">
                          {section.content}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-[#212121] text-base mt-12">
                개인정보 수집 및 이용 동의
              </h3>
              <div className="w-[744px] h-[280px] border border-[#F3F3F3] mt-4 rounded-lg overflow-y-auto">
                <div className="p-6">
                  {PERSONAL_INFO_CONSENT.sections.map((section, index) => (
                    <div key={index} className="mb-4">
                      <h1 className="text-[#212121] font-medium text-[14px]">
                        {section.heading}
                      </h1>
                      {Array.isArray(section.content) ? (
                        section.content.map((item, itemIndex) => (
                          <div key={itemIndex}>
                            {typeof item === "object" && item !== null ? (
                              <>
                                <h3 className="text-[#626262] text-[14px] font-normal mt-2">
                                  {item.subheading}
                                </h3>
                                <p className="text-[#626262] text-[14px]">
                                  {item.text}
                                </p>
                              </>
                            ) : (
                              <p className="text-[#626262] text-[14px]">
                                {item}
                              </p>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-[#626262] text-[14px]">
                          {section.content}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    case "customer-service":
      return (
        <div className="p-8">
          <h2 className="font-semibold text-[20px] mb-4 text-[#212121]">
            고객센터
          </h2>
          <hr className="mb-4" />
          <div className="flex flex-col space-y-4">
            <p className="mt-5 text-[#212121] text-[16px] font-medium">
              도움이 필요하신가요?
            </p>
            <textarea
              className="w-[full] h-[288px] p-4 border border-[#F3F3F3] text-[14px] text-[#] rounded-md focus:outline-none"
              placeholder="불편한 점이나 질문을 자유롭게 남겨주세요."
              value={csText}
              onChange={(e)=> setCsText(e.target.value)}
            ></textarea>
            <div className="flex justify-end mt-4 space-x-4">
              <button className="px-4 py-2 text-[16px] text-[#212121] rounded-md border border-[#E1E1E1] hover:bg-gray-100"
              onClick={() => setCsText("")}>
                전체 삭제
              </button>
              <button className="px-4 py-2 text-[16px] text-white bg-[#212121] rounded-md hover:bg-[#4C4C4C]"
              onClick={handleSubmitCustomerService}>
                작성 완료
              </button>
            </div>
          </div>
                <BasicModal
        open={isSubmitModalOpen}
        title="문의사항 작성 완료"
        message={"회원님의 소중한 의견 감사합니다.\n빠른 처리 후 연락드리겠습니다."}
        confirmLabel="확인"
        onClose={() => setIsSubmitModalOpen(false)}
      />
    </div>
  );
    
    case "account":
      return (
        <div className="p-8">
          <h2 className="font-semibold text-[20px] mb-4 text-[#212121]">
            계정 관리
          </h2>
          <hr className="mb-4" />
          <div className="flex flex-col">
            <div className="flex flex-row items-center space-x-10 mt-8">
              <p className="font-medium text-[16px] text-[#212121] whitespace-nowrap">
                로그아웃
              </p>
              <button
                className="w-[98px] h-[45px] px-4 py-2 text-[16px] text-[#212121] font-medium rounded-md border border-[#E1E1E1] hover:bg-gray-100 text-center"
                onClick={openLogoutModal}
              >
                로그아웃
              </button>
            </div>
            <div className="space-y-2 mt-16">
              <p className="font-medium text-[16px] text-[#212121] whitespace-nowrap">
                회원 탈퇴
              </p>
              <div className="w-full h-[280px] border border-[#F3F3F3] mt-4 rounded-lg overflow-y-auto">
                <div className="p-6">
                  <h3 className="font-semibold text-base text-[#212121]">
                    {WITHDRAWAL_DATA.withdrawal.title}
                  </h3>
                  {WITHDRAWAL_DATA.withdrawal.sections.map((section, index) => (
                    <div key={index} className="mt-4">
                      <h4 className="font-medium text-sm text-[#212121]">
                        {section.subtitle}
                      </h4>
                      <ul className="list-disc list-inside text-sm text-[#626262] mt-2 space-y-1">
                        {section.points.map((point, pointIndex) => (
                          <li key={pointIndex}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <label className="flex items-center text-[#000000] gap-2 cursor-pointer">
                  <div
                    className={`w-4 h-4 rounded border-1 flex items-center justify-center transition-all duration-200 ${
                      isWithdrawalAgreed
                        ? "bg-[#2FD8F6] border-[#2FD8F6]"
                        : "bg-white border-[#F3F3F3]"
                    }`}
                    onClick={() => setIsWithdrawalAgreed(!isWithdrawalAgreed)}
                  >
                    {isWithdrawalAgreed && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-3 h-3"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </div>
                  탈퇴 시 안내사항을 모두 확인하였으며, 동의합니다.
                </label>
              </div>
              <div className="flex justify-end mt-4 space-x-4">
                <button
                  className="text-left px-4 py-2 text-[16px] text-[#212121] font-medium rounded-md border border-[#E1E1E1] hover:bg-gray-100"
                  onClick={() => navigate("/merchant-main-page")}
                >
                  메인으로 이동
                </button>
                <button
                  className={`text-left px-4 py-2 text-[16px] font-medium rounded-md transition-colors duration-200 ${
                    isWithdrawalAgreed
                      ? "bg-[#EE4343] text-white hover:bg-[#D35A5A]"
                      : "bg-[#E1E1E1] text-[#FFFFFF] cursor-not-allowed"
                  }`}
                  onClick={openWithdrawalModal}
                  disabled={!isWithdrawalAgreed}
                >
                  탈퇴하기
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    default:
      return null;
  }
};

const MerchantMyPage = () => {
  const [userData, setUserData] = useState(null);
  const [userProjects, setUserProjects] = useState([]);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("profile");

  const [isWithdrawalAgreed, setIsWithdrawalAgreed] = useState(false);

  const openLogoutModal = () => {
    setIsLogoutModalOpen(true);
  };

  const closeLogoutModal = () => {
    setIsLogoutModalOpen(false);
  };

  const openWithdrawalModal = () => {
    setIsWithdrawalModalOpen(true);
  };

  const closeWithdrawalModal = () => {
    setIsWithdrawalModalOpen(false);
  };

  const handleConfirmLogout = async () => {
    try {
      await api.post("/users/logout");
    } catch (error) {
      console.error("로그아웃 API 호출 실패:", error);
    }
    sessionStorage.removeItem("accessToken");
    console.log("로그아웃 완료.");
    closeLogoutModal();
    navigate("/signin");
  };

  const handleConfirmWithdrawal = async () => {
    try {
      await api.delete("/users");
      sessionStorage.removeItem("accessToken");
      console.log("회원 탈퇴가 완료되었습니다.");
      closeWithdrawalModal();
      navigate("/");
    } catch (error) {
      console.error("회원 탈퇴 실패:", error);
      alert("회원 탈퇴에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tab = queryParams.get("tab");
    if (tab) {
      setSelectedTab(tab);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchUserDataAndProjects = async () => {
      try {
        const userResponse = await api.get("/users");
        setUserData(userResponse.data);

        const projectsResponse = await api.get("/projects");
        const myProjects = projectsResponse.data.filter(
          (project) => project.writerNickname === userResponse.data.nickname
        );

        const projectsWithImages = await Promise.all(
          myProjects.map(async (project) => {
            try {
              const imageResponse = await api.get(
                `/rewards/finish/project/${project.projectId}/image`
              );
              return {
                ...project,
                winnerImageUrl:
                  imageResponse.data?.imageUrl &&
                  imageResponse.data.imageUrl !== "string"
                    ? imageResponse.data.imageUrl
                    : null,
              };
            } catch (err) {
              console.error(
                "수상작 이미지를 불러오는 중 오류가 발생했습니다:",
                err
              );
              return { ...project, winnerImageUrl: null };
            }
          })
        );

        setUserProjects(projectsWithImages);
      } catch (err) {
        console.error("데이터를 가져오는 데 실패했습니다:", err);
        setUserData(null);
        setUserProjects([]);
      }
    };

    fetchUserDataAndProjects();
  }, []);

  return (
    <div>
      <MerchantHeader />
      <div className="w-full min-h-[1200px] flex justify-center py-15 font-pretendard">
        <div className="w-[1200px] h-full flex font-pretendard">
          <div className="w-[240px] mt-19">
            <hr className="mb-0 border-t-1 border-[#E1E1E1]" />
            <ul className="text-[#4C4C4C] font-normal">
              <li
                className={`p-6 cursor-pointer border-b border-[#F3F3F3] bg-[#F9F9F9] ${
                  selectedTab === "profile"
                    ? "font-medium text-[#212121]"
                    : "text-[#4C4C4C]"
                }`}
                onClick={() => setSelectedTab("profile")}
              >
                내 프로필
              </li>
              <li
                className={`p-6 cursor-pointer border-b border-[#F3F3F3] bg-[#F9F9F9] ${
                  selectedTab === "terms"
                    ? "font-medium text-[#212121]"
                    : "text-[#4C4C4C]"
                }`}
                onClick={() => setSelectedTab("terms")}
              >
                약관 및 정책
              </li>
              <li
                className={`p-6 cursor-pointer border-b border-[#F3F3F3] bg-[#F9F9F9] ${
                  selectedTab === "customer-service"
                    ? "font-medium text-[#212121]"
                    : "text-[#4C4C4C]"
                }`}
                onClick={() => setSelectedTab("customer-service")}
              >
                고객센터
              </li>
              <li
                className={`p-6 cursor-pointer border-b border-[#F3F3F3] bg-[#F9F9F9] ${
                  selectedTab === "account"
                    ? "font-medium text-[#212121]"
                    : "text-[#4C4C4C]"
                }`}
                onClick={() => setSelectedTab("account")}
              >
                계정 관리
              </li>
            </ul>
            <hr className="mt-0 border-t-1 border-[#E1E1E1]" />
          </div>
          <div className="flex-1 overflow-y-auto">
            {userData && (
              <MyPageContent
                selectedTab={selectedTab}
                userData={userData}
                userProjects={userProjects}
                openLogoutModal={openLogoutModal}
                openWithdrawalModal={openWithdrawalModal}
                navigate={navigate}
                isWithdrawalAgreed={isWithdrawalAgreed}
                setIsWithdrawalAgreed={setIsWithdrawalAgreed}
              />
            )}
          </div>
        </div>
      </div>
      <Footer />
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-[420px] h-[200px]">
            <h3 className="text-[20px] font-semibold mb-2 text-[#212121] text-left">
              로그아웃 하시겠습니까?
            </h3>
            <p className="text-[14px] text-[#828282] mb-6 text-left">
              로그아웃하시면 서비스 이용을 위해 재로그인이 필요해요.
            </p>
            <div className="flex justify-end space-x-4 mt-14">
              <button
                onClick={closeLogoutModal}
                className="px-4 py-2 bg-[#FFFFFF] text-[#4C4C4C] text-[12px] border border-[#E1E1E1] rounded-md font-medium hover:bg-gray-200"
              >
                취소하기
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-4 py-2 bg-[#EE4343] text-white text-[12px] rounded-md font-medium hover:bg-[#D35A5A]"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      )}
      {isWithdrawalModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-[420px] h-[200px]">
            <h3 className="text-[20px] font-semibold mb-2 text-[#212121] text-left">
              정말 탈퇴하시겠습니까?
            </h3>
            <p className="text-[14px] text-[#828282] mb-6 text-left">
              지금까지 등록한 공모전, 거래 기록이 모두 삭제되며
              <br />
              계정 복구가 불가능합니다.
            </p>
            <div className="flex justify-end space-x-4 mt-10">
              <button
                onClick={closeWithdrawalModal}
                className="px-4 py-2 bg-[#FFFFFF] text-[#4C4C4C] text-[12px] border border-[#E1E1E1] rounded-md font-medium hover:bg-gray-200"
              >
                취소하기
              </button>
              <button
                onClick={handleConfirmWithdrawal}
                className="px-4 py-2 bg-[#EE4343] text-white text-[12px] rounded-md font-medium hover:bg-[#D35A5A]"
              >
                탈퇴하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MerchantMyPage;

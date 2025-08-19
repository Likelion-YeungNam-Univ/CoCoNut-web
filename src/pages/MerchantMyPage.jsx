import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import MerchantHeader from "../header/MerchantHeader";
import { IoPersonCircle } from "react-icons/io5";
import { PiNotebook } from "react-icons/pi";
import api from "../apis/api";
import Footer from "../components/Footer";
import { PERSONAL_INFO_CONSENT, SERVICE_TERMS_DATA } from "../utils/termsData";

const MyPageContent = ({ selectedTab, userData }) => {
  const handleLogout = () => {
    console.log("로그아웃 버튼이 클릭되었습니다.");
  };

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
                    00회
                  </span>
                </div>
                <div className="flex-1 border-l border-gray-200 pl-8 flex">
                  <div className="flex flex-col items-left">
                    <span className="text-sm text-[#A3A3A3] font-normal">
                      거래 완료
                    </span>
                    <span className="text-[#212121] text-[16px] font-semibold mt-1">
                      00회
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <hr className="text-[#E1E1E1]" />
            <div className="flex flex-col space-y-2 items-center justify-center p-36 bg-white">
              <PiNotebook className="w-[120px] h-[120px] text-[#F3F3F3]" />
              <p className="text-[16px] font-semibold text-[#212121]">
                아직 공모전이 없어요.
              </p>
              <p className="text-[12px] font-medium text-[#A3A3A3]">
                가게에 필요한 도움을 요청해 보세요.
              </p>
            </div>
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
              className="w-[full] h-[288px] p-4 border border-[#F3F3F3] text-[14px] text-[#C3C3C3] rounded-md focus:outline-none"
              placeholder="불편한 점이나 질문을 자유롭게 남겨주세요."
            ></textarea>
            <div className="flex justify-end mt-4 space-x-4">
              <button className="px-4 py-2 text-[16px] text-[#212121] rounded-md border border-[#E1E1E1] hover:bg-gray-100">
                전체 삭제
              </button>
              <button className="px-4 py-2 text-[16px] text-white bg-[#212121] rounded-md hover:bg-[#4C4C4C]">
                작성 완료
              </button>
            </div>
          </div>
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
                className="w-[98px] h-[45px] px-4 py-2 text-[16px] text-gray-400 font-medium rounded-md border border-[#F3F3F3] hover:bg-gray-100 text-center"
                onClick={handleLogout}
              >
                로그아웃
              </button>
            </div>
            <div className="space-y-2 mt-16">
              <p className="font-medium text-[16px] text-[#212121] whitespace-nowrap">
                회원 탈퇴
              </p>
              <div className="flex flex-col space-y-3">
                <div className="w-full h-[280px] border border-[#F3F3F3] mt-4 rounded-lg overflow-y-auto"></div>
                <p className="flex justify-end text-[14px] text-[#212121] font-normal">
                  탈퇴 시 안내 사항을 모두 확인하였으며, 동의합니다.
                </p>
                <div className="flex justify-end mt-4 space-x-4">
                  <button className="text-left px-4 py-2 text-[16px] text-[#212121] font-medium rounded-md border border-[#E1E1E1] hover:bg-gray-100">
                    메인으로 이동
                  </button>
                  <button
                    className="text-left px-4 py-2 text-[16px] text-white font-medium bg-[#EE4343] rounded-md hover:bg-[#D35A5A]"
                    onClick={handleLogout}
                  >
                    탈퇴하기
                  </button>
                </div>
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
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState("profile");

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tab = queryParams.get("tab");
    if (tab) {
      setSelectedTab(tab);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("/users");
        setUserData(response.data);
      } catch (err) {
        console.error("사용자 정보를 가져오는 데 실패했습니다:", err);
        setUserData(null);
      }
    };
    fetchUserData();
  }, []);

  return (
    <div>
      <MerchantHeader />
      <div className="w-full h-screen flex justify-center py-10 font-pretendard">
        <div className="w-[1200px] h-full flex font-pretendard">
          {/* 좌측 메뉴 바 */}
          <div className="w-[240px] text-sm mt-19">
            <hr className="mb-0 border-t-1 border-[#E1E1E1]" />
            <ul className="text-[#4C4C4C] font-normal">
              <li
                className={`p-4 cursor-pointer border-b border-[#F3F3F3] bg-[#F9F9F9] ${
                  selectedTab === "profile"
                    ? "font-medium text-[#212121]"
                    : "text-[#4C4C4C]"
                }`}
                onClick={() => setSelectedTab("profile")}
              >
                내 프로필
              </li>
              <li
                className={`p-4 cursor-pointer border-b border-[#F3F3F3] bg-[#F9F9F9] ${
                  selectedTab === "terms"
                    ? "font-medium text-[#212121]"
                    : "text-[#4C4C4C]"
                }`}
                onClick={() => setSelectedTab("terms")}
              >
                약관 및 정책
              </li>
              <li
                className={`p-4 cursor-pointer border-b border-[#F3F3F3] bg-[#F9F9F9] ${
                  selectedTab === "customer-service"
                    ? "font-medium text-[#212121]"
                    : "text-[#4C4C4C]"
                }`}
                onClick={() => setSelectedTab("customer-service")}
              >
                고객센터
              </li>
              <li
                className={`p-4 cursor-pointer border-b border-[#F3F3F3] bg-[#F9F9F9] ${
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

          {/* 우측 콘텐츠 영역 */}
          <div className="flex-1 overflow-y-auto">
            {userData && (
              <MyPageContent selectedTab={selectedTab} userData={userData} />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MerchantMyPage;

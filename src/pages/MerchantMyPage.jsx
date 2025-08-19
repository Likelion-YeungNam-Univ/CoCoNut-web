import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import MerchantHeader from "../header/MerchantHeader";
import { IoPersonCircle } from "react-icons/io5";
import api from "../apis/api";
import Footer from "../components/Footer";

// 각 메뉴 항목의 콘텐츠를 렌더링하는 컴포넌트
const MyPageContent = ({ selectedTab, userData }) => {
  const handleLogout = () => {
    console.log("로그아웃 버튼이 클릭되었습니다.");
    // 실제 로그아웃 API 호출 및 토큰 제거 로직 추가
    // navigate("/login"); // 예시: 로그인 페이지로 리디렉션
  };

  switch (selectedTab) {
    case "profile":
      return (
        <div className="p-8">
          <h2 className="font-medium text-xl mb-4 text-[#AEAEAE]">내 프로필</h2>
          <hr className="mb-4" />
          <div className="flex flex-col space-y-8">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-4">
                <IoPersonCircle className="text-[#B9B9B9] w-[60px] h-[60px]" />
                <div className="flex flex-col">
                  <span className="font-semibold text-base text-[#212121]">
                    {userData.nickname}
                  </span>
                  <span className="font-normal text-sm text-[#4C4C4C]">
                    {userData.email}
                  </span>
                </div>
              </div>
              <div className="flex-1 border-l border-gray-200 pl-8 flex justify-around">
                <div className="flex flex-col items-center">
                  <span className="text-sm text-[#4C4C4C] font-normal">
                    공모전 등록
                  </span>
                  <span className="text-xl font-bold mt-1">00회</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-sm text-[#4C4C4C] font-normal">
                    거래 완료
                  </span>
                  <span className="text-xl font-bold mt-1">00회</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow-inner">
              <div className="w-20 h-20 bg-gray-200 rounded-full mb-4"></div>{" "}
              <p className="text-lg font-bold text-[#4C4C4C]">
                아직 공모전이 없어요.
              </p>
              <p className="text-sm text-[#A3A3A3]">
                가장 쉬운 공모전 도전을 제안 받아보세요.
              </p>
            </div>
          </div>
        </div>
      );
    case "terms":
      return (
        <div className="p-8">
          <h2 className="font-medium text-xl mb-4 text-[#AEAEAE]">
            약관 및 정책
          </h2>
          <hr className="mb-4" />
          <div className="text-sm space-y-4">
            <div>
              <h3 className="font-semibold text-base mb-1">
                서비스 이용약관 동의
              </h3>
              <p className="text-[#4C4C4C]">
                이 약관은 팀 브릿지(이하 '회사'라 한다)가 운영하는 웹사이트 관련
                서비스(이하 '서비스')를 하나의 계정으로 가입하여 이용함에 있어
                회사와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로
                합니다.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-base mb-1">
                개인정보 수집 및 이용에 대한 안내
              </h3>
              <p className="text-[#4C4C4C]">
                이 약관은 팀 브릿지(이하 '회사'라 한다)가 운영하는 웹사이트 관련
                서비스(이하 '서비스')를 하나의 계정으로 가입하여 이용함에 있어
                회사와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로
                합니다.
              </p>
            </div>
          </div>
        </div>
      );
    case "customer-service":
      return (
        <div className="p-8">
          <h2 className="font-medium text-xl mb-4 text-[#AEAEAE]">고객센터</h2>
          <hr className="mb-4" />
          <div className="text-sm">
            <p className="mb-2 text-[#4C4C4C]">도움이 필요하신가요?</p>
            <p className="mb-4 text-[#A3A3A3]">
              불편한 점이나 질문을 자유롭게 남겨주세요.
            </p>
            <textarea
              className="w-full h-24 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#2FD8F6]"
              placeholder="문의 내용을 입력하세요."
            ></textarea>
            <div className="flex justify-end mt-4 space-x-2">
              <button className="px-4 py-2 text-sm text-[#4C4C4C] rounded-md border border-[#4C4C4C] hover:bg-gray-100">
                전체 삭제
              </button>
              <button className="px-4 py-2 text-sm text-white bg-[#2FD8F6] rounded-md hover:bg-[#1EBBDB]">
                작성 완료
              </button>
            </div>
          </div>
        </div>
      );
    case "account":
      return (
        <div className="p-8">
          <h2 className="font-medium text-xl mb-4 text-[#AEAEAE]">계정 관리</h2>
          <hr className="mb-4" />
          <div className="text-sm">
            <p className="mb-4 text-[#4C4C4C]">
              회원 정보를 안전하게 관리하세요.
            </p>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2 text-sm text-[#4C4C4C] rounded-md border border-gray-300 hover:bg-gray-100">
                비밀번호 변경
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-[#4C4C4C] rounded-md border border-gray-300 hover:bg-gray-100">
                연결된 소셜 계정
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm text-white bg-[#E57373] rounded-md hover:bg-[#D35A5A]"
                onClick={handleLogout}
              >
                회원 탈퇴
              </button>
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
    // URL에서 탭 정보를 가져와 초기 상태 설정
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
                    ? "font-bold text-[#212121]"
                    : "text-[#4C4C4C]"
                }`}
                onClick={() => setSelectedTab("profile")}
              >
                내 프로필
              </li>
              <li
                className={`p-4 cursor-pointer border-b border-[#F3F3F3] bg-[#F9F9F9] ${
                  selectedTab === "terms"
                    ? "font-bold text-[#212121]"
                    : "text-[#4C4C4C]"
                }`}
                onClick={() => setSelectedTab("terms")}
              >
                약관 및 정책
              </li>
              <li
                className={`p-4 cursor-pointer border-b border-[#F3F3F3] bg-[#F9F9F9] ${
                  selectedTab === "customer-service"
                    ? "font-bold text-[#212121]"
                    : "text-[#4C4C4C]"
                }`}
                onClick={() => setSelectedTab("customer-service")}
              >
                고객센터
              </li>
              <li
                className={`p-4 cursor-pointer border-b border-[#F3F3F3] bg-[#F9F9F9] ${
                  selectedTab === "account"
                    ? "font-bold text-[#212121]"
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

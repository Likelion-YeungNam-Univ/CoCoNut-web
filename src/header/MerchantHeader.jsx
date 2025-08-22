import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import { BiSearch } from "react-icons/bi";
import { IoPersonCircle } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { IoIosClose } from "react-icons/io";
import api from "../apis/api";

const MerchantHeader = ({ defaultValue = "" }) => {
  const [value, setValue] = useState(defaultValue);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

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

  const submit = (e) => {
    e.preventDefault();
    const q = value.trim();
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
    setIsMenuOpen(false);
  };

  const closeLogoutModal = () => {
    setIsLogoutModalOpen(false);
  };

  const handleConfirmLogout = async () => {
    try {
      await api.post("/users/logout");
      sessionStorage.removeItem("accessToken");
      console.log("로그아웃 성공");
      closeLogoutModal();
      navigate("/signin");
    } catch (error) {
      console.error("로그아웃 실패:", error);
      alert("로그아웃에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  return (
    <div className="w-full h-[60px] flex items-center px-[120px] border-b border-[#E1E1E1] font-pretendard">
      <div className="flex-1 flex justify-start">
        <Link to="/merchant-main-page">
          <img
            src={logo}
            alt="로고"
            className="w-[89.65px] h-[20px] cursor-pointer"
          />
        </Link>
      </div>

      <div className="flex-1 flex justify-center">
        <form
          onSubmit={submit}
          className="flex items-center w-[480px] h-[36px] bg-[#F3F3F3] border-[1px] border-transparent
          focus-within:bg-[#FBFBFB] focus-within:border-[#2FD8F6] rounded-[18px] px-3"
        >
          <BiSearch className="text-[#A3A3A3] w-[14px] h-[14px] ml-1" />
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="어떤 공모전을 찾고있나요?"
            className="w-full ml-1.5 bg-[#F3F3F3] text-[12px] text-[#212121] placeholder:text-[12px] placeholder:text-[#A3A3A3] placeholder:font-medium focus:bg-[#FBFBFB] focus:outline-none"
          />
          {value && (
            <IoIosClose
              className="text-[#212121] w-[20px] h-[20px] cursor-pointer"
              onClick={() => setValue("")}
            />
          )}
          <button type="submit" className="hidden">
            검색
          </button>
        </form>
      </div>

      <div className="flex-1 flex justify-end gap-8">
        <button
          onClick={() => navigate("/merchant-myproject")}
          className="text-[12px] text-[#4C4C4C] font-medium cursor-pointer"
        >
          내 공모전
        </button>
        <Link
          to="/project-register"
          className="w-[106px] h-[32px] px-[14px] py-[7px] text-[#4C4C4C] font-medium border-[1px] border-[#4C4C4C] rounded-[6px] text-[12px] cursor-pointer hover:bg-[#2FD8F6]"
        >
          공모전 등록하기
        </Link>

        <div className="relative">
          <IoPersonCircle
            className="text-[#B9B9B9] w-[32px] h-[32px] cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          />

          {isMenuOpen && (
            <div className="absolute top-10 right-0 w-[240px] bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4 font-pretendard text-sm">
              {userData && (
                <>
                  <div className="flex items-center gap-2 pb-3 border-b border-[#E1E1E1] mb-3">
                    <IoPersonCircle className="text-[#B9B9B9] w-[60px] h-[60px]" />
                    <div className="flex flex-col space-y-1">
                      <div className="font-semibold text-[14px] text-[#212121]">
                        {userData.nickname}
                      </div>
                      <div className="font-normal text-[12px] text-[#212121]">
                        {userData.email}
                      </div>
                    </div>
                  </div>
                  <ul className="space-y-2 text-[#212121] font-normal">
                    <li className="p-1 cursor-pointer hover:bg-gray-100 rounded">
                      <Link to="/merchant-mypage">내 프로필</Link>
                    </li>
                    <li className="p-1 cursor-pointer hover:bg-gray-100 rounded">
                      <Link to="/merchant-mypage?tab=terms">약관 및 정책</Link>
                    </li>
                    <li className="p-1 cursor-pointer hover:bg-gray-100 rounded">
                      <Link to="/merchant-mypage?tab=customer-service">
                        고객센터
                      </Link>
                    </li>
                    <li
                      className="p-1 cursor-pointer hover:bg-gray-100 rounded"
                      onClick={handleLogout}
                    >
                      <span className="block w-full">로그아웃</span>
                    </li>
                  </ul>
                </>
              )}
            </div>
          )}
        </div>
      </div>
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
    </div>
  );
};

export default MerchantHeader;

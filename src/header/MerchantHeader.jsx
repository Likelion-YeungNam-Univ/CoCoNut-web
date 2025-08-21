import React, { useState } from "react";
import logo from "../assets/logo.png";
import { BiSearch } from "react-icons/bi";
import { IoPersonCircle } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { IoIosClose } from "react-icons/io";

const MerchantHeader = ({ defaultValue = "" }) => {
  const [value, setValue] = useState(defaultValue); // value : 검색창에 쓴 글자
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    const q = value.trim();
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  };

  return (
    <div className="w-full h-[60px] flex items-center px-[120px] border-b border-gray-200 font-pretendard">
      {/* 로고 */}
      <div className="flex-1 flex justify-start">
        <Link to="/merchant-main-page">
          <img
            src={logo}
            alt="로고"
            className="w-[89.65px] h-[20px] cursor-pointer"
          />
        </Link>
      </div>

      {/* 검색창 */}
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
          {/* 입력값이 있을 때만 X 아이콘 표시 */}
          {value && (
            <IoIosClose
              className="text-[#212121] w-[20px] h-[20px] cursor-pointer"
              onClick={() => setValue("")}
            />
          )}
          {/* 보이지 않는 submit 버튼(엔터 제출용) */}
          <button type="submit" className="hidden">
            검색
          </button>
        </form>
      </div>

      {/* 버튼들 */}
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
        <IoPersonCircle className="text-[#B9B9B9] w-[32px] h-[32px] cursor-pointer" />
      </div>
    </div>
  );
};

export default MerchantHeader;

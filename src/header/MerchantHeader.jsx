import React from "react";
import logo from "../assets/logo.png";
import { BiSearch } from "react-icons/bi";
import { IoPersonCircle } from "react-icons/io5";
import { Link } from "react-router-dom";

const MerchantHeader = () => {
  return (
    <div className="w-full h-[60px] flex items-center px-[120px] border-b border-gray-200 font-pretendard">
      {/* 로고 */}
      <div className="flex-1 flex justify-start">
        <img
          src={logo}
          alt="로고"
          className="w-[89.65px] h-[20px] cursor-pointer"
        />
      </div>

      {/* 검색창 */}
      <div className="flex-1 flex justify-center">
        <div
          className="flex items-center w-[480px] h-[36px] bg-[#F3F3F3] border-[1px] border-transparent
      focus-within:bg-[#FBFBFB] focus-within:border-[#2FD8F6] rounded-[18px] px-3"
        >
          <BiSearch className="text-[#A3A3A3] w-[14px] h-[14px] ml-1" />
          <input
            type="text"
            placeholder="어떤 공모전을 찾고있나요?"
            className="w-full ml-1.5 bg-[#F3F3F3] text-[12px] text-[#212121] placeholder:text-[12px] placeholder:text-[#A3A3A3] placeholder:font-medium focus:bg-[#FBFBFB] focus:outline-none"
          />
        </div>
      </div>

      {/* 버튼들 */}
      <div className="flex-1 flex justify-end gap-8">
        <button className="text-[12px] text-[#4C4C4C] font-medium cursor-pointer">
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

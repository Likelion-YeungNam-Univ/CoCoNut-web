import React from "react";
import { BiSearch } from "react-icons/bi";

const MerchantHeader = () => {
  return (
    <header className="w-full h-[60px] flex justify-between items-center px-28 py-4 border-b border-gray-200">
      {/* 왼쪽: 로고 */}
      <div className="text-2xl font-bold text-[#5f5f5f] cursor-pointer">
        Bridgee
      </div>

      {/* 오른쪽: 검색창 + 버튼들 */}
      <div className="flex items-center gap-9">
        {/* 검색창 */}
        <div className="flex items-center w-[240px] h-[32px] bg-[#EDEDED] rounded-full px-3">
          <BiSearch className="text-[#B9B9B9] w-[12px] h-[12px] ml-1" />
          <input
            type="text"
            placeholder="어떤 공모전을 찾고있나요?"
            className="ml-1.5 bg-[#EDEDED] placeholder:text-[12px] placeholder:text-[#B9B9B9] text-[12px] w-full focus:outline-none"
          />
        </div>

        {/* 버튼: 내 공모전 */}
        <button className="text-[12px] text-black font-medium hover:underline cursor-pointer">
          내 공모전
        </button>

        {/* 버튼: 공모전 등록 */}
        <button className="w-[107px] h-[32px] text-black font-medium border-[1px] rounded-[4px] text-[12px] cursor-pointer">
          공모전 등록하기
        </button>

        {/* 프로필 */}
        <div className="w-9 h-9 rounded-full bg-[#D9D9D9] cursor-pointer" />
      </div>
    </header>
  );
};

export default MerchantHeader;

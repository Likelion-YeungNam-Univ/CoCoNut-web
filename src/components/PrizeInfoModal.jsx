import React from "react";

const PrizeInfoModal = () => {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-10 w-[360px] rounded-lg shadow-xl bg-white p-6 opacity-0 invisible transition-opacity duration-300 group-hover:opacity-100 group-hover:visible font-pretendard">
      <div className="text-left">
        <h2 className="text-[14px] text-[#212121]">
          브릿지가 상금의 약 23%를 지역 화폐로 부담해 드려요.
        </h2>
        <label className="text-[12px] text-[#626262]">
          지역 화폐로 참가자는 모으고, 경제적 부담을 줄일 수 있어요.
        </label>
      </div>
    </div>
  );
};

export default PrizeInfoModal;

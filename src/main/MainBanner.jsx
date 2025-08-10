import React from "react";
import bannerImg from "../assets/banner.png";

const MainBanner = () => {
  return (
    <div
      className="relative w-full h-[340px]"
      style={{ backgroundImage: `url(${bannerImg})` }}
    >
      {/* 텍스트 영역 */}
      <div className="absolute pl-[240px] font-pretendard">
        <h2 className="pt-[60px] text-[32px] font-bold text-[#212121]">
          가게에 필요한 도움, 경산에서 함께 찾아봐요.
        </h2>
        <p className="pt-[10px] text-[#4C4C4C] text-[16px]">
          가게에 필요한 홍보물이나 아이디어가 있다면 공모전을 등록해 주세요.
          <br />
          지역 화폐와 AI 도우미를 통해 부담 없이 도움을 요청할 수 있어요.
        </p>
      </div>
    </div>
  );
};

export default MainBanner;

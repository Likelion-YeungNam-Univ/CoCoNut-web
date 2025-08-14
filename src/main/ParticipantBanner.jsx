import React from "react";
import bannerImg from "../assets/participantBanner.png";

const ParticipantBanner = () => {
  return (
    <div
      className="relative w-full h-[340px]"
      style={{ backgroundImage: `url(${bannerImg})` }}
    >
      {/* 텍스트 영역 */}
      <div className="absolute pl-[240px] font-pretendard">
        <h2 className="pt-[60px] text-[32px] font-bold text-[#212121]">
          경산에서 당신의 재능을 펼쳐보세요.
        </h2>
        <p className="pt-[10px] text-[#4C4C4C] text-[16px]">
          지역 소상공인이 기다리는 다양한 공모전에 참여해 보세요.
          <br />
          지역 화폐로 더 커진 보상과 함께, 실전 경험까지 쌓을 수 있어요.
        </p>
      </div>
    </div>
  );
};

export default ParticipantBanner;

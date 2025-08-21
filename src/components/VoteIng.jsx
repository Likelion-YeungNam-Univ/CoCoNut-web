import React from "react";

const MerchantVote = () => {
  // 12개 카드 더미 데이터 (제목만 사용)
  const cards = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    title: "제목제목제목제목제목...",
  }));

  return (
    <div className="font-pretendard flex flex-col items-center">
      {/* 카드 그리드 */}
      <div className="mt-[60px] grid grid-cols-4 grid-rows-3 gap-[24px]">
        {cards.map(({ id, title }) => (
          <div
            key={id}
            className="border border-[#E1E1E1] rounded-[12px] w-[240px] h-[306px]"
          >
            {/* 썸네일 영역 */}
            <div className="border border-[#EBEBEB] w-[240px] h-[240px] rounded-[12px] bg-[#EBEBEB]" />
            {/* 제목 (말줄임) */}
            <span className="block mt-[8px] px-[8px] truncate">{title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MerchantVote;

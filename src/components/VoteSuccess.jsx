// src/components/VoteSuccess.jsx
import React from "react";
import { Link } from "react-router-dom";
import { IoPersonCircle } from "react-icons/io5";

const MOCK_WORKS = Array.from({ length: 9 }, (_, i) => ({
  id: i + 1,
  title: "제목제목제목제...",
  author: "참가자 닉네임",
  // imageUrl: null // API 연동 시 추가
}));

export default function VoteSuccess() {
  const featured = MOCK_WORKS[0];
  const others = MOCK_WORKS.slice(1);

  return (
    <div className="font-pretendard flex flex-col items-center">
      {/* 상단 메시지 */}
      <div className="flex flex-col items-center mt-[80px] gap-[8px]">
        <span className="font-semibold text-[24px]">수상작 선정이 완료되었습니다.🎉</span>
        <span className="text-[14px] text-[#A3A3A3]">
          선정하신 수상작은 모든 사용자에게 공개됩니다.
        </span>

        <div className="mt-[32px] flex w-[900px] h-[45px] items-center justify-between border border-[#E0F9FE] py-[12px] px-[20px] rounded-[24px] bg-[#E0F9FE] text-[#26ADC5]">
          <span>
            닉네임 님의 작품이 수상작으로 선정되었습니다. 프로필 내 연락처를 통해 거래를 완료해 주세요.
          </span>
          <Link
            className="font-semibold hover:underline hover:decoration-[#26ADC5]"
            to="/winner-profile"
          >
            프로필로 가기
          </Link>
        </div>
        <div className="border w-[1032px] h-[1032px] rounded-[12px] bg-[#EBEBEB] border-[#EBEBEB] mt-[21px]">이미지 넣을 자리</div>
        <span className="mt-[20px] font-semibold text-[20px]">{featured.title}</span>
        <div className="flex flex-row gap-[8px]">
             <IoPersonCircle size={24} color="#A3A3A3" />
             <span className="text-[#A3A3A3] text-[14px] mt-[4px]">{featured.author}</span>
        </div>
      </div>
        <div className="mt-[72px] grid grid-cols-4 grid-rows-2">
            {others.map((work)=> (
                <div className='border w-[240px] h-[306px] ml-[24px] mb-[24px] border-[#E1E1E1] rounded-[12px]' key={work.id}>
                    <div className="border w-[240px] h-[240px] rounded-[12px] border-[#EBEBEB] bg-[#EBEBEB]">이미지</div>
                    <span className="flex justify-center mt-[20px] font-semibold">{work.title}</span>
                </div>
            ))}
        </div>

    </div>
  );
}

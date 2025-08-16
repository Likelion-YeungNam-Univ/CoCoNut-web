import React from 'react'

const VoteTitle = () => {
  return (
    <div className="font-pretendard flex flex-col items-center">
    <span className="border border-[#E0F9FE] bg-[#E0F9FE] text-[#26ADC5] font-semibold text-[14px] pt-[8px] pb-[8px] rounded-[24px] w-[255px] h-[34px] mt-[80px] flex gap-[8px] items-center justify-center">
        <span className='font-medium'>투표 기간</span>2025.08.21 - 2025.08.27
      </span>
      <span className="text-[24px] font-semibold mt-[20px]">
        지금까지 100명이 투표에 참여했어요!
      </span>
      <span className="mt-[8px] text-[14px] text-[#A3A3A3]">
        투표를 통해 지역의 목소리가 반영된 순위를 확인할 수 있어요.
      </span>
      </div>
  )
}

export default VoteTitle
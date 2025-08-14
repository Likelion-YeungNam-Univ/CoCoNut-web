import React from 'react'
import { Link } from 'react-router-dom'


const Rending = () => {
  return (
    <>

    <div className='flex flex-col items-center gap-5 mt-40 font-pretendard'>
    <span className='font-bold text-4xl'>가게에 필요한 것,쉽게 요청하고 받아보세요.</span>
    <span className='text-[#626262]'>브릿지는 경산의 소상공인과 지역 주민이 연결될 수 있도록 돕는 B2P 공모 플랫폼입니다.</span>
    <div className='flex gap-3 mt-4'>

        <Link className='border border-[#2FD8F6] bg-[#EAFBFE] hover:bg-[#E0F9FE] rounded-xl w-[140px] h-[45px] flex items-center justify-center text-[#2FD8F6]'
       to="/signup" state={{ presetRole: "참가자" }}>
        공모전 참여하기
      </Link>
       <Link className='border rounded-xl bg-[#2FD8F6] hover:bg-[#2AC2DD] w-[140px] h-[45px] text-[#FFFFFF] flex items-center justify-center'
       to="/signup" state={{ presetRole: "소상공인" }}>
       도움 요청하기
       </Link>
   
    </div>
    <Link className='text-[#A3A3A3] underline text-sm' to="/main">지금 올라온 공모전 둘러보기</Link>
    </div>
    </>
  )
}

export default Rending
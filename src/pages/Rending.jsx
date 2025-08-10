import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png';

const Rending = () => {
  return (
    <>
    <div className='border h-[60px] border-t-[#FFFFFF] border-b-[#F3F3F3] '>
       <div className='flex flex-row justify-between px-[120px] py-[20px]'>
        <img src={logo} alt="로고" className="w-[89.65px] h-[20px]" />
        <div className='flex  font-pretendard gap-3'>
        <Link className='border bg-[#FFFFFF] text-[#000000] hover:bg-[#F3F3F3]  rounded-[6px] border-[#FFFFFF] w-[73px] h-[32px] flex justify-center items-center'to='/signin'>로그인</Link>
        <Link className='border bg-[#4C4C4C] hover:bg-[#212121] text-[#FFFFFF] rounded-[6px] w-[73px] h-[32px] flex justify-center items-center ' to='/signup'>회원가입</Link>
        </div>
    </div>
    </div>
    <div className='flex flex-col items-center gap-5 mt-40 font-pretendard'>
    <span className='font-bold text-4xl'>가게에 필요한 것,쉽게 요청하고 받아보세요.</span>
    <span className='text-[#626262]'>브릿지는 경산의 소상공인과 지역 주민이 연결될 수 있도록 돕는 B2P 공모 플랫폼입니다.</span>
    <div className='flex gap-3 mt-4'>
        <Link className='border border-[#2FD8F6] bg-[#EAFBFE] hover:bg-[#E0F9FE] rounded-xl w-[140px] h-[45px] flex items-center justify-center text-[#2FD8F6]' to="/signup">공모전 참여하기</Link>
        <Link className='border rounded-xl bg-[#2FD8F6] hover:bg-[#2AC2DD] w-[140px] h-[45px] text-[#FFFFFF] flex items-center justify-center' to="/signup">도움 요청하기</Link>
    </div>
    <Link className='text-[#A3A3A3] underline text-sm' to="/main">지금 올라온 공모전 둘러보기</Link>
    </div>
    </>
  )
}

export default Rending
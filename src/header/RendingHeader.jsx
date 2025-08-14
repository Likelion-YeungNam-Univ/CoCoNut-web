import React from 'react'
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';

const RendingHeader = () => {
  return (
      <div className='flex items-center border-b h-[60px] border-gray-200 font-pretendard justify-between'>
        <Link to='/'>
            <img src={logo} alt="로고" className="w-[89.65px] h-[20px] ml-[120px]" /></Link>
            <div className='flex  font-pretendard gap-[12px]'>
            <Link className='border bg-[#FFFFFF] text-[#000000] hover:bg-[#F3F3F3]  rounded-[6px] border-[#FFFFFF] w-[73px] h-[32px] flex justify-center text-[12px] items-center'to='/signin'>로그인</Link>
            <Link className='mr-[120px] border bg-[#4C4C4C] hover:bg-[#212121] text-[#FFFFFF] rounded-[6px] w-[73px] h-[32px] flex justify-center items-center text-[12px]' to='/signup'>회원가입</Link>
             </div>
     </div>
  )
}

export default RendingHeader
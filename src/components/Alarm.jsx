import React from 'react'
import { AiOutlineExclamationCircle } from "react-icons/ai";

const Alarm = () => {
  return (
    <div className='flex flex-row w-[330px] h-[28px] font-pretendard border rounded-[15px] bg-[#E0F9FE] ml-[12px] px-[12px] py-[6px] border-[#E0F9FE] text-[#26ADC5] justify-center items-center'>
        <AiOutlineExclamationCircle size={15} />
         <span className='text-[12px] ml-[4px]'>수상자와 거래 후 '내 공모전'에서 수상 확정을 진행해 주세요.</span>    

    </div>
   
  )
}

export default Alarm
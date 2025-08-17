import React from 'react'
import MerchantHeader from '../header/MerchantHeader'
import ProjectCardClosed from '../main/projectCard/ProjectCardClosed'




const Merchantmy = () => {
  return (
    <>
    <MerchantHeader/>
    <div className='font-pretendard flex flex-col items-center'>
        <span className='text-[24px] font-semibold mt-[80px]'>내 공모전</span>
        <ProjectCardClosed/> 
    </div>
    </>
  )
}

export default Merchantmy
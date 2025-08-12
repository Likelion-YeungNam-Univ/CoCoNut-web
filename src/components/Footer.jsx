import React from "react";
import logo from "../assets/footerLogo.png";

const Footer = () => {
  return (
    <div className="mt-[160px] w-[1512px] h-[200px] pt-[40px] pl-[120px] bg-[#F9F9F9]">
      <img src={logo} className="w-[89.65px] h-[20px]" />
      <div className="text-[#AEAEAE] text-[10px] font-pretendard pt-[12px]">
        브릿지는 경산의 소상공인과 지역 주민이 연결될 수 있도록 돕는 B2P 공모
        플랫폼입니다.
      </div>
    </div>
  );
};

export default Footer;

import React from "react";
import { Link } from "react-router-dom";
import { IoIosClose } from "react-icons/io";

const LoginRequiredModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-10000 bg-black/50 overflow-y-auto font-pretendard flex items-center justify-center">
      <div className="relative bg-white rounded-[12px] shadow-lg pt-[32px] pb-[23px] w-[420px] h-[240px] text-center">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-[#A3A3A3] cursor-pointer"
        >
          <IoIosClose className="w-[40px] h-[40px]" />
        </button>
        <h2 className="text-[20px] font-semibold mb-[8px]">
          로그인이 필요해요 😊
        </h2>
        <p className="text-[14px] text-[#828282] mb-[36px]">
          공모전은 자유롭게 구경하실 수 있지만, <br />더 많은 기능을 이용하려면
          로그인이 필요합니다.
        </p>
        <div className="flex flex-col items-center gap-3">
          <Link
            to="/signin"
            className="w-[180px] h-[45px] flex items-center justify-center
               bg-[#2FD8F6] text-white text-[16px] font-medium rounded-[8px]
               hover:bg-[#2AC2DD] cursor-pointer"
          >
            로그인하러 가기
          </Link>
          <Link
            to="/signup"
            className="text-[12px] text-[#A3A3A3] hover:underline cursor-pointer"
          >
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginRequiredModal;

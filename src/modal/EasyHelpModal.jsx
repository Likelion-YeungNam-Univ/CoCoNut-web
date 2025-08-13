import React from "react";
import { IoIosCloseCircle, IoIosCheckmarkCircle } from "react-icons/io";

const EasyHelpModal = () => {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-[100%] mt-2 z-10 w-[440px] rounded-lg shadow-xl bg-white p-6 opacity-0 invisible transition-opacity duration-300 group-hover:opacity-100 group-hover:visible">
      <div className="text-left">
        <h2 className="text-[14px] font-medium text-[#212121] mb-2">
          AI로 더 빠르고 정확하게 요청하세요!
        </h2>
        <p className="text-[12px] text-[#626262] mb-5">
          하고 싶은 말을 간단히 적으면, AI가 예쁘게 다듬고 아이디어까지 제안해
          드려요.
        </p>
      </div>
      <div className="flex flex-col space-y-4 text-left">
        <div className="flex items-start space-x-2">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#2FD8F6] text-white font-medium text-center flex items-center justify-center">
            1
          </span>
          <div>
            <p className="font-medium text-[14px] text-[#212121]">
              구체적으로 작성할수록 좋아요
            </p>
            <p className="text-[12px] text-[#626262]">
              왜 필요한지, 형식, 필수 요소를 포함하면 더 정확해져요.
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-2">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#2FD8F6] text-white font-medium text-center flex items-center justify-center">
            2
          </span>
          <div>
            <p className="font-medium text-[14px] text-[#212121]">
              목표와 타겟을 알려주세요
            </p>
            <p className="text-[12px] text-[#626262]">
              타겟에 대한 정보를 알려주면 결과물의 완성도가 올라가요.
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-2">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#2FD8F6] text-white font-medium text-center flex items-center justify-center">
            3
          </span>
          <div>
            <p className="font-medium text-[14px] text-[#212121]">
              원하는 스타일을 제시하세요
            </p>
            <p className="text-[12px] text-[#626262]">
              참고 이미지가 있다면 첨부해도 좋아요.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-6 space-x-4 items-stretch">
        <div className="w-1/2 flex flex-col">
          <div className="flex items-center mb-1">
            <IoIosCloseCircle className="text-[#EE4343] text-[24px] mr-2" />
            <p className="text-[14px] font-medium text-[#212121]">나쁜 예시</p>
          </div>
          <div className="w-full p-4 rounded-lg border border-gray-200 flex-grow">
            <p className="text-[12px] text-[#212121]">홍보물 만들어줘</p>
          </div>
        </div>
        <div className="w-1/2 flex flex-col">
          <div className="flex items-center mb-1">
            <IoIosCheckmarkCircle className="text-[#2CCC41] text-[24px] mr-2" />
            <p className="text-[14px] font-medium text-[#212121]">좋은 예시</p>
          </div>
          <div className="w-full p-4 rounded-lg border border-gray-200 flex-grow">
            <p className="text-[12px] text-[#212121]">
              '망고 빙수' 홍보 포스터 A3 사이즈, 가격과 QR코드를 포함한 홍보물이
              필요해요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EasyHelpModal;

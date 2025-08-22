import React from "react";
import { IoIosCloseCircle, IoIosCheckmarkCircle } from "react-icons/io";

const SubEasyHelpModal = () => {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-[100%] mt-2 z-10 w-[450px] rounded-lg shadow-xl bg-white p-6 opacity-0 invisible transition-opacity duration-300 group-hover:opacity-100 group-hover:visible font-pretendard">
      <div className="text-left">
        <h2 className="text-[14px] font-medium text-[#212121] mb-2">
          AI로 작품 설명을 더 멋지게 작성해 보세요!
        </h2>
        <p className="text-[12px] text-[#626262] mb-5">
          작품에 담은 생각을 간단히 적어주면, AI가 정리해주고 표현도 매끄럽게
          다듬어 드려요.
        </p>
      </div>
      <div className="flex flex-col space-y-4 text-left">
        <div className="flex items-start space-x-2">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#2FD8F6] text-white font-medium text-center flex items-center justify-center">
            1
          </span>
          <div>
            <p className="font-medium text-[14px] text-[#212121]">
              작품의 내용을 적어주세요
            </p>
            <p className="text-[12px] text-[#626262]">
              무엇을 만들었는지, 어떤 주제인지 구체적으로 적으면 설명이
              풍성해져요.
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-2">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#2FD8F6] text-white font-medium text-center flex items-center justify-center">
            2
          </span>
          <div>
            <p className="font-medium text-[14px] text-[#212121]">
              의도와 메시지를 알려주세요
            </p>
            <p className="text-[12px] text-[#626262]">
              왜 이 작품을 만들었는지, 어떤 의미를 담았는지 알려주면 더 잘
              전달돼요.
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-2">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#2FD8F6] text-white font-medium text-center flex items-center justify-center">
            3
          </span>
          <div>
            <p className="font-medium text-[14px] text-[#212121]">
              작품의 느낌과 분위기를 제시해 주세요
            </p>
            <p className="text-[12px] text-[#626262]">
              쾌활함, 따뜻함, 신선함 같은 키워드를 적으면 AI가 톤을 맞춰 드려요.
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
            <p className="text-[12px] text-[#212121]">포스터 작품이에요</p>
          </div>
        </div>
        <div className="w-1/2 flex flex-col">
          <div className="flex items-center mb-1">
            <IoIosCheckmarkCircle className="text-[#2CCC41] text-[24px] mr-2" />
            <p className="text-[14px] font-medium text-[#212121]">좋은 예시</p>
          </div>
          <div className="w-full p-4 rounded-lg border border-gray-200 flex-grow">
            <p className="text-[12px] text-[#212121]">
              망고 빙수 포스터에요. 건강과 신선함을 담고 싶었고, 후식으로
              최고라는 메시지를 전합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubEasyHelpModal;

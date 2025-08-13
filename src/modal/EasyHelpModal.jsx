import React from "react";

const EasyHelpModal = () => {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-[100%] mt-2 z-10 w-[440px] rounded-lg shadow-xl bg-white p-6 opacity-0 invisible transition-opacity duration-300 group-hover:opacity-100 group-hover:visible">
      <div className="text-left">
        <h2 className="text-xl font-sans text-[#212121] mb-2">
          AI로 더 빠르고 정확하게 요청하세요!
        </h2>
        <p className="text-xs text-[#626262] mb-6">
          하고 싶은 말을 간단히 적으면, AI가 예쁘게 다듬고 아이디어까지 제안해
          드려요.
        </p>
      </div>
      <div className="flex flex-col space-y-4 text-left">
        <div className="flex items-start space-x-2">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#2FD8F6] text-white font-normal text-center">
            1
          </span>
          <div>
            <p className="font-sans text-[#212121]">
              구체적으로 작성할수록 좋아요
            </p>
            <p className="text-sm text-[#626262]">
              왜 필요한지, 형식, 필수 요소를 포함하면 더 정확해져요.
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-2">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#2FD8F6] text-white font-normal text-center">
            2
          </span>
          <div>
            <p className="font-sans text-[#212121]">목표와 타겟을 알려주세요</p>
            <p className="text-sm text-[#626262]">
              타겟에 대한 정보를 알려주면 결과물의 완성도가 올라가요.
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-2">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#2FD8F6] text-white font-normal text-center">
            3
          </span>
          <div>
            <p className="font-sans text-[#212121]">
              원하는 스타일을 제시하세요
            </p>
            <p className="text-sm text-[#626262]">
              참고 이미지가 있다면 첨부해도 좋아요.
            </p>
          </div>
        </div>
      </div>
      {/* 이미지에 맞게 수정된 나쁜 예시와 좋은 예시 코드 */}
      <div className="flex justify-between mt-6 space-x-4">
        <div className="flex flex-col">
          <div className="flex items-center mb-2">
            <span className="text-red-500 text-lg mr-2">❌</span>
            <p className="text-sm font-bold text-[#212121]">나쁜 예시</p>
          </div>
          <div className="w-full p-4 rounded-lg border border-gray-200">
            <div className="border-t border-gray-200 pt-2">
              <p className="text-xs text-[#212121]">홍보물 만들어줘</p>
            </div>
          </div>
        </div>
        <div className="w-1/2 p-4 rounded-lg border border-gray-200">
          <div className="flex items-center mb-2">
            <span className="text-green-500 text-lg mr-2">✅</span>
            <p className="text-sm font-bold text-[#212121]">좋은 예시</p>
          </div>
          <div className="border-t border-gray-200 pt-2">
            <p className="text-xs text-[#212121]">
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

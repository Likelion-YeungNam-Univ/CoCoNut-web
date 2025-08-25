import React from "react";
import { useNavigate } from "react-router-dom";

const ConfirmBackModal = ({ isOpen, onClose, onConfirm }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 p-18 font-pretendard">
      <div className="bg-white rounded-xl max-w-md w-full m-4 mt-10 p-4 flex flex-col justify-between min-h-[200px]">
        <div className="space-y-2 mt-4 ml-5">
          <h1 className="text-[20px] font-semibold text-[#212121] text-left">
            이전 화면으로 돌아가시겠습니까?
          </h1>
          <p className="text-[14px] text-[#828282] text-left">
            작성하던 글은 다시 불러올 수 없어요.
          </p>
        </div>

        <div className="flex justify-end gap-4 mb-3 mr-3">
          <button
            onClick={onClose}
            className="py-2 px-4 border border-[#E1E1E1] rounded-lg text-[12px] text-gray-700 hover:bg-gray-100 transition"
          >
            취소하기
          </button>
          <button
            onClick={onConfirm}
            className="py-2 px-4 bg-[#4C4C4C] text-[12px] text-white rounded-lg hover:bg-gray-800 transition"
          >
            네, 돌아갈래요
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmBackModal;

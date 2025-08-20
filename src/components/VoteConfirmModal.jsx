
import React from "react";
import { IoPersonCircle } from "react-icons/io5";

const VoteConfirmModal = ({
  open,
  onClose,
  onConfirm,
  submission,
  title = "이 작품에 투표하시겠습니까?",
  description = "투표 확정 후에는 변경할 수 없습니다.",
  confirmText = "투표하기",
  cancelText = "취소",
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center font-pretendard">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-[476px] h-[640px] rounded-[12px] bg-white shadow-xl p-6">
        <h3 className="text-[20px] font-semibold text-[#212121] f">{title}</h3>
        {description && (
          <p className="mt-[8px] text-[14px] text-[#828282]">{description}</p>
        )}

        {submission && (
          <div className="mt-[36px] rounded-[10px] border border-[#F1F1F1] p-4 w-[420px] h-[420px] bg-[#EBEBEB]">
            <div className="flex flex-row gap-[8px] text-[14px] text-[#A3A3A3] items-center mt-[309px]">
            <IoPersonCircle size={24} color="#A3A3A3"/>
              {submission?.writerNickname || "제목 없음"}
            </div> 
            <div className="text-[20px] text-[#000000] font-semibold mt-[11px]">
              {submission?.title|| "작성자 정보 없음"}
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={onClose}
            className="border h-[45px] w-[180px] rounded-[8px] bg-white border-[#E1E1E1]"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="border h-[45px] w-[180px] rounded-[8px] bg-[#212121] border-[#212121] text-white"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoteConfirmModal;

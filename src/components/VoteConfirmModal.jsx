// src/components/VoteConfirmModal.jsx
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
      {/* 배경 딤 */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* 모달 카드 */}
      <div className="relative w-[476px] h-[640px] rounded-[12px] bg-white shadow-xl p-6">
        <h3 className="text-[20px] font-semibold text-[#212121]">{title}</h3>
        {description && (
          <p className="mt-[8px] text-[14px] text-[#828282]">{description}</p>
        )}

        {/* 이미지 미리보기 박스 */}
        <div className="relative mt-[36px] rounded-[10px] border border-[#F1F1F1] w-[420px] h-[420px] overflow-hidden bg-[#EBEBEB]">
          {submission?.imageUrl ? (
            <>
              <img
                src={submission.imageUrl}
                alt={submission?.title || "submission"}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* 아래에서 위로 그라데이션 */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/60 to-transparent" />
            </>
          ) : null}

          {/* 작품 정보 오버레이 */}
          <div className="absolute left-4 bottom-4 right-4">
            <div className="flex items-center gap-2 text-[14px] text-white/80">
              <IoPersonCircle size={24} />
              <span>{submission?.writerNickname || "닉네임 없음"}</span>
            </div>
            <div className="mt-[6px] text-[18px] font-semibold text-white truncate">
              {submission?.title || "제목 없음"}
            </div>
          </div>
        </div>

        {/* 버튼 영역 */}
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

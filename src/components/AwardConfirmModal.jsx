import React, { useEffect } from "react";

/**
 * AwardConfirmModal
 * - 디자인: 첨부 이미지 스타일
 * - props:
 *   open: boolean
 *   title: string
 *   description?: string
 *   confirmText?: string
 *   cancelText?: string
 *   onConfirm: () => void
 *   onClose: () => void
 */
const AwardConfirmModal = ({
  open,
  title = "수상을 확정하시겠습니까?",
  description = "수상을 확정하면 당선작에게 보상이 지급되며, 이후 변경이 불가능합니다.",
  confirmText = "수상 확정하기",
  cancelText = "취소하기",
  onConfirm,
  onClose,
}) => {
  // ESC 닫기
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      {/* dim */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* panel */}
      <div
        className="
          relative w-[520px] max-w-[92vw]
          rounded-[12px] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.18)]
          p-6
          animate-[fadeIn_.14s_ease-out]
        "
      >
        {/* Title */}
        <h3 className="text-[18px] font-semibold text-[#212121]">
          {title}
        </h3>

        {/* Description */}
        {description ? (
          <p className="mt-2 text-[14px] leading-[1.5] text-[#8E8E8E]">
            {description}
          </p>
        ) : null}

        {/* Actions (오른쪽 정렬) */}
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="
              h-[36px] px-4 rounded-[8px] text-[14px]
              bg-white text-[#212121] border border-[#E1E1E1]
              hover:bg-[#FAFAFA] active:scale-[0.99] transition
            "
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="
              h-[36px] px-4 rounded-[8px] text-[14px]
              bg-[#212121] text-white
              hover:bg-black active:scale-[0.99] transition
            "
          >
            {confirmText}
          </button>
        </div>
      </div>

      {/* keyframe (로컬 정의) */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px) }
          to   { opacity: 1; transform: translateY(0) }
        }
      `}</style>
    </div>
  );
};

export default AwardConfirmModal;

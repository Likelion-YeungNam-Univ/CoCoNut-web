// components/VoteModal.jsx
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { IoPersonCircle } from "react-icons/io5";

const VoteModal = ({ open, onClose, onConfirm, selectedCount = 0 }) => {
  // 모달 열릴 때 바디 스크롤 잠금
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = original);
  }, [open]);

  // ESC로 닫기
  useEffect(() => {
    if (!open) return;
    const handler = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const modal = (
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-[1000] flex items-center justify-center"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-[476px] h-[640px] rounded-[12px] bg-white shadow-xl font-pretendard">
        <div className="px-[28px] pt-[32px] pb-[31px] flex flex-col">
            <span className="font-semibold text-[20px]">이 작품을 수상작으로 선정하시겠습니까?</span>
            <span className="mt-[8px] text-[#828282] text-[14px]">선정이 완료되면 변경할 수 없습니다. 신중하게 결정해 주세요.</span>
            <div className="mt-[36px] border rounded-[6px] w-[420px] h-[420px] border-[#EBEBEB] bg-[#EBEBEB]">
                <div className="mt-[344px] ml-[22px] flex flex-col ">
                <div className="flex flex-row gap-[8px]">
                <IoPersonCircle size={24} color="#A3A3A3"/>
                <span className="text-[14px] text-[#A3A3A3]">참가자 닉네임</span>
                </div>
                 <span className=" text-black mt-[11px] font-semibold text-[20px]">제목제목제목</span>
                </div>
               
            </div>
        </div>
        <div className="flex justify-center gap-[12px]">
        <button
            className="border w-[180px] h-[45px] rounded-[8px] text-black bg-white border-white"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="border w-[180px] h-[45px] rounded-[8px] text-white bg-black border-black"
            onClick={onConfirm}
          >
            선정하기
          </button>
          </div>
       </div>
       
    </div>
  );

  // 포탈로 body에 붙이기
  return createPortal(modal, document.body);
};

export default VoteModal;

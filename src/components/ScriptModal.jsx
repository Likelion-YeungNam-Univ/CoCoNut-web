// components/ScriptModal.jsx
import React, { useEffect } from "react";
import { IoIosClose } from "react-icons/io";

const ScriptModal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.classList.add("modal-open");

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("modal-open");
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="flex justify-center">
        <div className="relative mt-[91px] mb-[91px]">
          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className="absolute left-[calc(100%+20px)] top-0 border rounded-full border-[#F3F3F3] bg-[#F3F3F3]"
          >
            <IoIosClose size={40} />
          </button>

          {/* 모달 박스 */}
          <div className="bg-white rounded-[12px] w-[840px] h-[800px] overflow-y-auto p-6">
            {title && <h2 className="text-lg font-semibold mb-3">{title}</h2>}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScriptModal;

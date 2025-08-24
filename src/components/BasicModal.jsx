// src/components/BasicModal.jsx
import React, { useEffect } from "react";

const BasicModal = ({ open, title, message, onClose, confirmLabel = "확인" }) => {
  if (!open) return null;

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-left w-[420px]">
        <h3 className="text-[20px] font-semibold mb-2 text-[#212121]">{title}</h3>
        <p className="text-[14px] text-[#828282] mb-6 whitespace-pre-line">
  {message}
</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#212121] text-white text-[12px] rounded-md font-medium hover:bg-[#4C4C4C]"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BasicModal;

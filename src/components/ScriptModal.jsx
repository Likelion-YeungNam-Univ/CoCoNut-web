// components/ScriptModal.jsx
import React, { useEffect } from 'react';
import { IoIosClose } from "react-icons/io";

const ScriptModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

return (
  <div
    className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
    onClick={(e) => e.target === e.currentTarget && onClose()}
  >
    {/* 닫기 버튼 - 모달 박스 밖에 배치 */}
    <div className="relative">
      <button
        onClick={onClose}
        className="absolute left-[850px] border rounded-full border-[#F3F3F3] bg-[#F3F3F3]"
      >
        <IoIosClose size={40}/>
      </button>

      {/* 모달 박스 */}
      <div className="bg-white rounded-[12px] w-[840px] h-[800px] overflow-auto p-6">
        {title && <h2 className="text-lg font-semibold mb-3">{title}</h2>}
        {children}
      </div>
    </div>
  </div>
);

};

export default ScriptModal;

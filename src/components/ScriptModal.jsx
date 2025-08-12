// components/ScriptModal.jsx
import React, { useEffect } from 'react';

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
      <div className="bg-white rounded-[12px] w-[840px] h-[800px] p-6 ">
        <button className="absolute top-3 right-3 text-white hover:text-black" onClick={onClose}>✕</button>
        {title && <h2 className="text-lg font-semibold mb-3">{title}</h2>}
        {children}
      </div>
    </div>
  );
};

export default ScriptModal;

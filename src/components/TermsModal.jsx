import React from "react";

const TermsModal = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-xl max-h-[80vh] overflow-y-auto relative">
        <h1 className="text-xl text-center font-bold mb-4">{title}</h1>
        <pre className="text-gray-700 whitespace-pre-wrap">{content}</pre>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-semibold"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default TermsModal;

import React from "react";
import { IoIosCloseCircle } from "react-icons/io";

const TermsModal = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center font-pretendard p-4">
      <div className="flex items-start">
        <div className="bg-white rounded-lg shadow-xl w-[840px] h-[650px] overflow-hidden flex flex-col relative">
          <div className="p-12 pb-4 flex-shrink-0">
            <h1 className="text-[16px] font-semibold text-[#212121] text-left">
              {title}
            </h1>
          </div>
          <div className="px-12 mt-3 flex-grow overflow-y-auto">
            {content.items ? (
              <div>
                {content.items.map((item, index) => (
                  <div key={index} className="mb-4">
                    <h3 className="font-semibold text-[12px] text-base text-[#212121]">
                      {item.step}
                    </h3>
                    <p className="font-normal text-[12px] text-[#212121] mt-2">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : content.sections ? (
              <div>
                {content.sections.map((section, index) => (
                  <div key={index} className="mb-6">
                    <h3 className="font-semibold text-[12px] text-base text-[#212121]">
                      {section.subtitle}
                    </h3>
                    <ul className="list-inside mt-2 text-[12px] text-[#212121] space-y-1">
                      {section.points.map((point, pointIndex) => (
                        <li key={pointIndex}>- {point}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <p>{content}</p>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="ml-4 flex-shrink-0 text-white transition hover:text-[#A3A3A3]"
        >
          <IoIosCloseCircle size={40} />
        </button>
      </div>
    </div>
  );
};

export default TermsModal;

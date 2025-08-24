import React from "react";
import { IoIosCloseCircle } from "react-icons/io";

const TermsModal = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 overflow-y-auto flex items-center justify-center font-pretendard p-4">
      <div className="flex items-start">
        <div className="bg-white rounded-lg shadow-xl w-[840px] h-[650px] overflow-hidden flex flex-col relative">
          <div className="p-12 pb-4 flex-shrink-0">
            <h1 className="text-[16px] font-semibold text-[#212121] text-center">
              {title}
            </h1>
          </div>
          <div className="px-12 mt-3 flex-grow overflow-y-auto">
            {content.items ? (
              <div className="grid grid-cols-3 gap-y-16 justify-items-center mb-5">
                {content.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center text-center mx-2"
                  >
                    <img
                      src={item.icons}
                      alt={`체크리스트 아이콘 ${index + 1}`}
                      className="w-[140px] h-[140px] mb-2"
                    />
                    <span className="text-[14px] text-[#212121] font-pretendard font-semibold">
                      {item.step}
                    </span>
                    <p className="text-[12px] text-[#828282] mt-1 font-pretendard">
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
          className="ml-4 flex-shrink-0 text-white transition cursor-pointer"
        >
          <IoIosCloseCircle size={40} />
        </button>
      </div>
    </div>
  );
};

export default TermsModal;

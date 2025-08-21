import React, { useState } from "react";

const DropdownSort = ({ sortOption, setSortOption }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptionText, setSelectedOptionText] = useState("최신순");

  const handleSelect = (option) => {
    setSortOption(option);
    setSelectedOptionText(option);
    setIsOpen(false);
  };

  const svgIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className="-mr-1 ml-2 h-5 w-5 text-[#A3A3A3]"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );

  const svgUpIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className="-mr-1 ml-2 h-5 w-5 text-[#A3A3A3]"
    >
      <path
        fillRule="evenodd"
        d="M14.77 12.79a.75.75 0 01-1.06-.02L10 9.06l-3.71 3.71a.75.75 0 11-1.06-1.06l4.25-4.25a.75.75 0 011.06 0l4.25 4.25a.75.75 0 01-.02 1.06z"
        clipRule="evenodd"
      />
    </svg>
  );

  return (
    <div className="relative text-left">
      <div className="rounded-md border border-[#E1E1E1] bg-white">
        <button
          type="button"
          className="w-full h-[40px] inline-flex items-center px-4 py-2 bg-white text-[12px] font-medium text-[#212121] hover:bg-[#E1E1E1] focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex justify-between items-center w-full">
            <span className="text-left">{selectedOptionText}</span>
            {isOpen ? svgUpIcon : svgIcon}
          </div>
        </button>
        {isOpen && (
          <div className="absolute top-[40px] left-0 w-full z-10 py-1 bg-white border border-[#E1E1E1] border-t-0 rounded-b-md">
            <div className="h-px bg-[#E1E1E1] mb-3 w-[75%] mx-auto"></div>
            <div className="flex flex-col">
              <button
                onClick={() => handleSelect("최신순")}
                className="block px-4 py-2 text-[12px] font-medium text-[#212121] w-full text-left hover:bg-[#E1E1E1]"
              >
                최신순
              </button>
              <button
                onClick={() => handleSelect("총상금순")}
                className="block px-4 py-2 text-[12px] font-medium text-[#212121] w-full text-left hover:bg-[#E1E1E1]"
              >
                총상금순
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DropdownSort;

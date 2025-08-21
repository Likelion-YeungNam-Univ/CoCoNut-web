import React, { useState } from "react";

const DropdownSort = ({ sortOption, setSortOption }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    setSortOption(option);
    setIsOpen(false);
  };

  const svgIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className="-mr-1 ml-2 h-5 w-5"
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
      className="-mr-1 ml-2 h-5 w-5"
    >
      <path
        fillRule="evenodd"
        d="M14.77 12.79a.75.75 0 01-1.06-.02L10 9.06l-3.71 3.71a.75.75 0 11-1.06-1.06l4.25-4.25a.75.75 0 011.06 0l4.25 4.25a.75.75 0 01-.02 1.06z"
        clipRule="evenodd"
      />
    </svg>
  );

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => setIsOpen(!isOpen)}
        >
          {sortOption}
          {isOpen ? svgUpIcon : svgIcon}
        </button>
      </div>
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <button
              onClick={() => handleSelect("최신순")}
              className="block px-4 py-2 text-sm text-gray-700 w-full text-left hover:bg-gray-100"
            >
              최신순
            </button>
            <button
              onClick={() => handleSelect("상금순")}
              className="block px-4 py-2 text-sm text-gray-700 w-full text-left hover:bg-gray-100"
            >
              상금순
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownSort;

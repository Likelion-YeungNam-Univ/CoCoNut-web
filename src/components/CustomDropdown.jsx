import React, { useState, useEffect, useRef } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const CustomDropdown = ({
  label,
  options,
  selected,
  onSelect,
  error,
  isSubmitted,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedOption = options.find((opt) => opt.code === selected);
  const displayLabel = selectedOption ? selectedOption.description : label;
  const isPlaceholder = !selectedOption;

  return (
    <div className="relative w-full font-pretendard" ref={dropdownRef}>
      <div
        className={`w-full rounded p-2 h-10 text-xs flex items-center justify-between cursor-pointer border ${
          isSubmitted && error ? "border-red-500" : "border-[#F3F3F3]"
        } ${isPlaceholder ? "text-[#C3C3C3]" : "text-[#212121]"}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{displayLabel}</span>
        {isOpen ? (
          <IoIosArrowUp className="text-[#828282]" />
        ) : (
          <IoIosArrowDown className="text-[#828282]" />
        )}
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-[#E0E0E0] text-[#828282] rounded shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option.code}
              className="p-2 text-xs cursor-pointer hover:bg-gray-100"
              onClick={() => {
                onSelect(option.code);
                setIsOpen(false);
              }}
            >
              {option.description}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default CustomDropdown;

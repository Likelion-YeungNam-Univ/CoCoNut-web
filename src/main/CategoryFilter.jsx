import React, { useState } from "react";
import { GoChevronUp, GoChevronDown } from "react-icons/go";
import checkIcon from "../assets/checkIcon.png";

const categories = [
  "기획/아이디어",
  "광고/마케팅",
  "그래픽/편집",
  "브랜딩/로고",
  "패키지/포장",
  "네이밍/슬로건",
  "캐릭터",
  "사진/영상/UCC",
  "인테리어/건축",
  "IT/모바일/웹",
  "기타",
];

const businesses = [
  "식당/카페/주점",
  "의류/쇼핑몰",
  "뷰티/헬스",
  "교육/학원",
  "병원/약국",
  "문화/여가",
  "서비스/전문직",
  "숙박/관광",
  "기타",
];

const CategoryFilter = ({
  selectedCategories,
  setSelectedCategories,
  selectedBusinesses,
  setSelectedBusinesses,
}) => {
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [businessOpen, setBusinessOpen] = useState(true);

  // 배열에 해당 값이 있으면 제거, 없으면 추가하여 새로운 배열 반환
  const toggleArrayItem = (arr, value) =>
    arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

  return (
    <div className="w-[136px] h-[712px] font-pretendard">
      {/* 카테고리 */}
      <div className="mb-[20px]">
        {/* 카테고리 텍스트 + 토글 기호 */}
        <div className="flex justify-between items-center cursor-pointer">
          <span className="text-[12px] text-[#212121] font-medium">
            카테고리
          </span>
          {categoryOpen ? (
            <GoChevronUp
              onClick={() => setCategoryOpen(!categoryOpen)}
              className="w-[16px] h-[16px] text-[#A3A3A3]"
            />
          ) : (
            <GoChevronDown
              onClick={() => setCategoryOpen(!categoryOpen)}
              className="w-[16px] h-[16px] text-[#A3A3A3]"
            />
          )}
        </div>

        {/* 카테고리 목록 */}
        {categoryOpen && (
          <ul className="mt-3 space-y-[12px]">
            {categories.map((category, index) => {
              const id = `category-${index}`;
              const checked = selectedCategories.includes(category);
              return (
                <li key={id} className="flex items-center gap-2 ml-1.5 ">
                  <input
                    id={id}
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      setSelectedCategories((prev) =>
                        toggleArrayItem(prev, category)
                      )
                    }
                    className="appearance-none w-[16px] h-[16px] rounded-[3px] border border-[#F3F3F3]"
                    style={{
                      backgroundImage: checked ? `url(${checkIcon})` : "none",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "20px 20px",
                      border: checked ? "none" : undefined,
                    }}
                  />
                  <label
                    htmlFor={id}
                    className={`text-[12px] ${
                      checked
                        ? "text-[#212121]"
                        : "text-[#828282] hover:text-[#626262]"
                    }`}
                  >
                    {category}
                  </label>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <hr className="mb-[20px] text-[#F3F3F3]" />

      {/* 업종 */}
      <div>
        {/* 업종 텍스트 + 토글 기호 */}
        <div className="flex justify-between items-center cursor-pointer">
          <span className="text-[12px] text-[#212121] font-medium">업종</span>
          {businessOpen ? (
            <GoChevronUp
              size={16}
              onClick={() => setBusinessOpen(!businessOpen)}
              className="text-[#A3A3A3]"
            />
          ) : (
            <GoChevronDown
              size={16}
              onClick={() => setBusinessOpen(!businessOpen)}
              className="text-[#A3A3A3]"
            />
          )}
        </div>

        {/* 업종 목록 */}
        {businessOpen && (
          <ul className="mt-3 space-y-[12px]">
            {businesses.map((business, index) => {
              const id = `business-${index}`;
              const checked = selectedBusinesses.includes(business);
              return (
                <li key={id} className="flex items-center gap-2 ml-1.5">
                  <input
                    id={id}
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      setSelectedBusinesses((prev) =>
                        toggleArrayItem(prev, business)
                      )
                    }
                    className="appearance-none w-[16px] h-[16px] rounded-[3px] border border-[#F3F3F3]"
                    style={{
                      backgroundImage: checked ? `url(${checkIcon})` : "none",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "20px 20px",
                      border: checked ? "none" : undefined,
                    }}
                  />
                  <label htmlFor={id} className="text-[12px] text-[#828282]">
                    {business}
                  </label>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CategoryFilter;

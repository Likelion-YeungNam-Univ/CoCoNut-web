import React, { useEffect, useState } from "react";
import { GoChevronUp, GoChevronDown } from "react-icons/go";
import checkIcon from "../assets/checkIcon.png";
import { fetchCategories } from "../apis/category";
import { getBusinessTypes } from "../apis/businessTypes";

const CategoryFilter = ({
  categories = [],
  setCategories,
  businessTypes = [],
  setBusinessTypes,
  selectedCategories,
  setSelectedCategories,
  selectedBusinesses,
  setSelectedBusinesses,
}) => {
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [businessOpen, setBusinessOpen] = useState(true);

  // 카테고리 목록 가져오기
  useEffect(() => {
    fetchCategories()
      .then((data) => {
        setCategories(data);
      })
      .catch((err) => console.error(err));
  }, []);

  // 업종 목록 가져오기
  useEffect(() => {
    getBusinessTypes()
      .then((data) => {
        setBusinessTypes(data);
      })
      .catch((err) => console.error(err));
  }, []);

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
            {categories.map((category) => {
              const id = `category-${category.code}`;
              const checked = selectedCategories.includes(category.code);
              return (
                <li key={id} className="flex items-center gap-2 ml-1.5 ">
                  <input
                    id={id}
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      setSelectedCategories((prev) =>
                        toggleArrayItem(prev, category.code)
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
                    {category.description}
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
            {businessTypes.map((business) => {
              const id = `business-${business.code}`;
              const checked = selectedBusinesses.includes(business.code);
              return (
                <li key={id} className="flex items-center gap-2 ml-1.5">
                  <input
                    id={id}
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      setSelectedBusinesses((prev) =>
                        toggleArrayItem(prev, business.code)
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
                    {business.description}
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

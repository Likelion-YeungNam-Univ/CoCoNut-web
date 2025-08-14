// src/modal/PreviewModal.jsx

import React from "react";
import { FaTimes, FaAward, FaUsers, FaCalendarAlt } from "react-icons/fa";

const PreviewModal = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  const STYLES_DATA = [
    { value: "simple", label: "심플한" },
    { value: "modern", label: "모던한" },
    { value: "retro", label: "레트로" },
    { value: "cute", label: "귀여운" },
    { value: "luxurious", label: "고급스러운" },
    { value: "warm", label: "따뜻한" },
    { value: "bold", label: "강렬한" },
    { value: "natural", label: "자연스러운" },
    { value: "traditional", label: "전통적인" },
    { value: "trendy", label: "트렌디한" },
    { value: "emotional", label: "감성적인" },
    { value: "style_free", label: "스타일 자유" },
  ];

  const TARGETS_DATA = [
    { value: "all_ages", label: "전 연령층" },
    { value: "children_family", label: "어린이/가족" },
    { value: "teenagers", label: "청소년" },
    { value: "youth", label: "청년" },
    { value: "middle_aged", label: "중장년층" },
    { value: "elderly", label: "노년층" },
    { value: "tourist", label: "관광객" },
    { value: "office_worker", label: "직장인" },
    { value: "target_free", label: "타겟 자유" },
  ];

  const COLORS_DATA = [
    {
      hex: "linear-gradient(to right, #FF91DC 0%, #FF00AE 100%)",
      code: "pink",
      label: "핑크",
    },
    {
      hex: "linear-gradient(to right, #9FFF98 0%, #4DF041 100%)",
      code: "green",
      label: "초록",
    },
    {
      hex: "linear-gradient(to right, #F0DB64 0%, #BFA200 100%)",
      code: "gold",
      label: "골드",
    },
    {
      hex: "linear-gradient(to right, #FF9E9E 0%, #FF0000 100%)",
      code: "red",
      label: "빨강",
    },
    {
      hex: "linear-gradient(to right, #85C6FF 0%, #0088FF 100%)",
      code: "blue",
      label: "파랑",
    },
    {
      hex: "linear-gradient(to right, #AA8F7E 0%, #6D3615 100%)",
      code: "brown",
      label: "브라운",
    },
    {
      hex: "linear-gradient(to right, #FFC096 0%, #FF6600 100%)",
      code: "orange",
      label: "주황",
    },
    {
      hex: "linear-gradient(to right, #858BD2 0%, #181F7A 100%)",
      code: "navy",
      label: "네이비",
    },
    {
      hex: "linear-gradient(to right, #868686 0%, #212121 100%)",
      code: "black",
      label: "블랙",
    },
    {
      hex: "linear-gradient(to right, #FFF1A2 0%, #FFD900 100%)",
      code: "yellow",
      label: "노랑",
    },
    {
      hex: "linear-gradient(to right, #BE7AFF 0%, #8400FF 100%)",
      code: "purple",
      label: "보라",
    },
    {
      code: "color_free",
      label: "색상 자유",
    },
  ];

  const CATEGORIES_MAP = {
    GRAPHIC_EDITING: "그래픽/편집",
    WEB_APP: "웹/앱",
    BRANDING_LOGO: "브랜딩/로고",
    PHOTO_VIDEO: "사진/영상",
    WRITING_PLANNING: "글쓰기/기획",
    OTHER: "기타",
  };

  const BUSINESSTYPES_MAP = {
    RESTAURANT_CAFE_PUB: "식당/카페/주점",
    LEISURE_SPORTS: "레저/스포츠",
    EDUCATION: "교육",
    BEAUTY_FASHION: "뷰티/패션",
    DISTRIBUTION_SALES: "유통/판매",
    MEDICAL_HEALTH: "의료/건강",
    SERVICE_PROFESSIONAL: "서비스/전문직",
    PUBLIC_ORGANIZATION: "공공기관/단체",
    MANUFACTURE: "제조업",
    CONSTRUCTION: "건설/부동산",
    ETC: "기타",
  };

  const getCategoryLabel = (code) => {
    return CATEGORIES_MAP[code] || "카테고리 없음";
  };

  const getBusinessTypeLabel = (code) => {
    return BUSINESSTYPES_MAP[code] || "업종 없음";
  };

  const daysLeft = data.deadline
    ? Math.ceil(
        (new Date(data.deadline).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
        >
          <FaTimes size={24} />
        </button>

        <div className="p-8">
          <div className="flex items-center justify-between text-gray-500 text-sm mb-4">
            <div className="flex items-center space-x-2 text-[#828282]">
              <span className="text-[#A3A3A3] text-[12px] font-normal">
                {daysLeft === 0 ? "오늘 마감" : `${daysLeft}일 후 마감`}
              </span>

              <span className="text-[#E1E1E1] text-[10px]">|</span>

              <span className="text-[#A3A3A3] text-[12px] font-normal">
                {getCategoryLabel(data.category)}
              </span>

              <span className="text-[#E1E1E1] text-[10px]">•</span>

              <span className="text-[#A3A3A3] text-[12px] font-normal">
                {getBusinessTypeLabel(data.businesstype)}
              </span>
            </div>
          </div>

          <h1 className="text-[28px] font-semibold text-[#212121] mb-2">
            {data.projectTitle || "음식점 메뉴판 3장 디자인 필요해요"}
          </h1>

          <p className="text-sm text-[#828282] mb-6">
            <span className="font-normal text-[#A3A3A3]">
              {data.merchantName || "빌런호프"}
            </span>

            <span className="text-[#E1E1E1] text-[10px] mx-2">|</span>

            <span className="font-normal text-[#A3A3A3]">
              {data.submerchantName || "오뚜기"}
            </span>
          </p>

          <div className="space-y-4 text-[#4C4C4C] mb-8">
            <div className="flex items-center space-x-2">
              <FaAward className="h-4 w-4 text-[#4C4C4C]" />
              <span className="text-[14px] text-[#828282] font-medium w-[80px]">
                상금
              </span>
              <p className="text-[14px] font-medium text-[#212121]">
                {data.prize || "300,000원"}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <FaUsers className="h-4 w-4 text-[#4C4C4C]" />
              <span className="text-[14px] text-[#828282] font-medium w-[80px]">
                참여작
              </span>
              <p className="text-[14px] font-medium text-[#212121]">
                {data.participants || "100개"}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <FaCalendarAlt className="h-4 w-4 text-[#4C4C4C]" />
              <span className="text-[14px] text-[#828282] font-medium w-[80px]">
                기간
              </span>
              <p className="text-[14px] font-medium text-[#212121]">
                {data.deadline
                  ? `${data.createdAt || "2025.08.10"} ~ ${data.deadline}`
                  : "2025.08.10 - 2025.08.20"}
              </p>
            </div>
          </div>
          <hr className="text-[#E1E1E1] border-1" />

          <div className="space-y-4 mb-8">
            <div>
              <h2 className="text-lg font-bold text-[#212121] mb-2">
                한 줄 소개
              </h2>
              <div className="p-4 bg-[#F5F5F5] rounded-md text-[#4C4C4C] whitespace-pre-wrap">
                <p>{data.summary || "한 줄 소개 정보가 없습니다."}</p>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#212121] mb-2">내용</h2>
              <div className="p-4 bg-[#F5F5F5] rounded-md text-[#4C4C4C] whitespace-pre-wrap">
                <p>{data.content || "공모전 내용이 여기에 표시됩니다."}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div>
              <h2 className="text-lg font-bold text-[#212121] mb-2">색상</h2>
              <div className="flex flex-wrap gap-2">
                {COLORS_DATA.map((colorItem) => (
                  <span
                    key={colorItem.code}
                    className={`h-8 w-8 rounded-full border ${
                      data.color === colorItem.code
                        ? "border-2 border-black"
                        : "border-gray-300"
                    }`}
                    style={
                      colorItem.code === "color_free"
                        ? { backgroundColor: "white" }
                        : { background: colorItem.hex }
                    }
                  ></span>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#212121] mb-2">스타일</h2>
              <div className="flex flex-wrap gap-2">
                {STYLES_DATA.map((styleItem) => (
                  <span
                    key={styleItem.value}
                    className={`px-4 py-2 rounded-full text-sm ${
                      data.style === styleItem.value
                        ? "bg-[#2FD8F6] text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {styleItem.label}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#212121] mb-2">타겟</h2>
              <div className="flex flex-wrap gap-2">
                {TARGETS_DATA.map((targetItem) => (
                  <span
                    key={targetItem.value}
                    className={`px-4 py-2 rounded-full text-sm ${
                      data.target === targetItem.value
                        ? "bg-[#2FD8F6] text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {targetItem.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;

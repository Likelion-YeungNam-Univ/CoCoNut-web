import React from "react";
import calendarIcon from "../assets/calendarIcon.png";
import participantIcon from "../assets/participantIcon.png";
import prizeIcon from "../assets/prizeIcon.png";
import { IoPersonCircle } from "react-icons/io5";
import { FaTimes } from "react-icons/fa";
import { STYLES_DATA } from "../utils/stylesData";
import { TARGETS_DATA } from "../utils/targetData";
import { COLORS_DATA } from "../utils/colorData";

const PreviewModal = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

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
      <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl max-h-[85vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
        >
          <FaTimes size={24} />
        </button>

        <div className="p-15">
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
            {data.projectTitle || "공모전 제목 없음"}
          </h1>

          <div className="flex space-x-2">
            <IoPersonCircle className="text-[#B9B9B9] w-[20px] h-[20px]" />
            <p className="text-sm text-[#828282] mb-6">
              <span className="font-normal text-[#A3A3A3]">
                {data.merchantName || "가게명 없음"}
              </span>
              <span className="text-[#E1E1E1] text-[10px] mx-2">|</span>
              <span className="font-normal text-[#A3A3A3]">
                {data.submerchantName || "세부 가게명 없음"}
              </span>
            </p>
          </div>
          <div className="space-y-3 text-[#4C4C4C] mb-8">
            <div className="flex items-center space-x-2">
              <img src={prizeIcon} alt="상금 아이콘" className="h-4 w-4" />
              <span className="text-[14px] text-[#828282] font-medium w-[80px]">
                상금
              </span>
              <p className="text-[14px] font-medium text-[#212121]">
                {data.prize || "가격 없음"}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <img
                src={participantIcon}
                alt="참여작 아이콘"
                className="h-4 w-4"
              />
              <span className="text-[14px] text-[#828282] font-medium w-[80px]">
                참여작
              </span>
              <p className="text-[14px] font-medium text-[#212121]">
                {data.participants || "참여작 없음"}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <img src={calendarIcon} alt="기간 아이콘" className="h-4 w-4" />
              <span className="text-[14px] text-[#828282] font-medium w-[80px]">
                기간
              </span>
              <p className="text-[14px] font-medium text-[#212121]">
                {data.deadline
                  ? `${data.createdAt || "기간 없음"} ~ ${data.deadline}`
                  : "기간 없음"}
              </p>
            </div>
          </div>
          <hr className="text-[#E1E1E1] border-1" />

          <div className="space-y-4 mt-16">
            <div>
              <h2 className="text-[16px] font-semibold text-[#212121] mb-2">
                한 줄 소개
              </h2>
              <p className="text-[16px] font-normal">
                {data.summary || "한 줄 소개 정보가 없습니다."}
              </p>
            </div>

            <div className="flex flex-col space-y-4">
              <h2 className="text-[16px] font-semibold text-[#212121] mt-10">
                내용
              </h2>
              {data.image && (
                <div className="p-4 bg-[#EBEBEB] rounded-md text-[#4C4C4C] whitespace-pre-wrap w-full">
                  <img
                    src={data.image}
                    alt="업로드 이미지 미리보기"
                    className="w-full h-auto object-contain"
                  />
                </div>
              )}
              <div className="text-base font-normal whitespace-pre-wrap">
                {data.content || "공모전 내용이 여기에 표시됩니다."}
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            {/* 색상 - 그리드 3으로 유지하고 위아래 패딩으로 크기 조절 */}
            <div>
              <h2 className="text-[16px] font-semibold text-[#212121] mt-10">
                색상
              </h2>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {data.color && data.color.length > 0 ? (
                  data.color[0] === "color_free" ? (
                    <span className="px-4 py-2 rounded border border-[#F3F3F3] text-sm bg-white text-[#212121] flex items-center justify-center col-span-3">
                      색상 자유
                    </span>
                  ) : (
                    data.color.map((colorCode, index) => {
                      const colorItem = COLORS_DATA.find(
                        (item) => item.code === colorCode
                      );
                      return colorItem ? (
                        <span
                          key={index}
                          className="w-full py-5 rounded border border-[#212121] flex items-center justify-center"
                          style={{ background: colorItem.hex }}
                        ></span>
                      ) : null;
                    })
                  )
                ) : (
                  <span className="text-[#A3A3A3] text-sm col-span-3">
                    선택 안 함
                  </span>
                )}
              </div>
            </div>

            {/* 스타일 - 그리드 6으로 유지하고 패딩으로 크기 조절 */}
            <div>
              <h2 className="text-[16px] font-semibold text-[#212121] mt-10">
                스타일
              </h2>
              <div className="grid grid-cols-6 gap-2 mt-2">
                {data.style && data.style.length > 0 ? (
                  data.style[0] === "style_free" ? (
                    <span className="px-4 py-2 rounded border border-[#F3F3F3] text-sm bg-white text-[#212121] flex items-center justify-center col-span-6">
                      스타일 자유
                    </span>
                  ) : (
                    data.style.map((styleValue, index) => {
                      const styleItem = STYLES_DATA.find(
                        (s) => s.value === styleValue
                      );
                      return styleItem ? (
                        <span
                          key={index}
                          className="px-4 py-2 rounded border border-[#212121] text-sm bg-white text-black flex items-center justify-center text-center"
                        >
                          {styleItem.label}
                        </span>
                      ) : null;
                    })
                  )
                ) : (
                  <span className="text-[#A3A3A3] text-sm col-span-6">
                    선택 안 함
                  </span>
                )}
              </div>
            </div>

            {/* 타겟 - 그리드 6으로 유지하고 패딩으로 크기 조절 */}
            <div>
              <h2 className="text-[16px] font-semibold text-[#212121] mt-10">
                타겟
              </h2>
              <div className="grid grid-cols-6 gap-2 mt-2">
                {data.target && data.target.length > 0 ? (
                  data.target[0] === "target_free" ? (
                    <span className="px-4 py-2 rounded border border-[#F3F3F3] text-sm bg-white text-[#212121] flex items-center justify-center col-span-6">
                      타겟 자유
                    </span>
                  ) : (
                    data.target.map((targetValue, index) => {
                      const targetItem = TARGETS_DATA.find(
                        (t) => t.value === targetValue
                      );
                      return targetItem ? (
                        <span
                          key={index}
                          className="px-4 py-2 rounded border border-[#212121] text-sm bg-white text-black flex items-center justify-center text-center"
                        >
                          {targetItem.label}
                        </span>
                      ) : null;
                    })
                  )
                ) : (
                  <span className="text-[#A3A3A3] text-sm col-span-6">
                    선택 안 함
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;

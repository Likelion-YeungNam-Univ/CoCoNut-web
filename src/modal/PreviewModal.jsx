// src/modal/PreviewModal.jsx

import React from "react";

const PreviewModal = ({ isOpen, onClose, data }) => {
  // 모달이 열려 있지 않으면 아무것도 렌더링하지 않습니다.
  if (!isOpen) return null;

  // 데이터 배열을 미리 정의하거나 prop으로 받아서 사용
  const STYLES_DATA = [
    { value: "simple", label: "심플한" },
    { value: "cute", label: "귀여운" },
    { value: "bold", label: "강렬한" },
    { value: "trendy", label: "트렌디한" },
    { value: "modern", label: "모던한" },
    { value: "luxurious", label: "고급스러운" },
    { value: "natural", label: "자연스러운" },
    { value: "emotional", label: "감성적인" },
    { value: "retro", label: "레트로" },
    { value: "warm", label: "따뜻한" },
    { value: "traditional", label: "전통적인" },
    { value: "style_free", label: "스타일 자유" },
  ];

  const TARGETS_DATA = [
    { value: "all_ages", label: "전 연령층" },
    { value: "youth", label: "청년" },
    { value: "tourist", label: "관광객" },
    { value: "children_family", label: "어린이/가족" },
    { value: "middle_aged", label: "중장년층" },
    { value: "office_worker", label: "직장인" },
    { value: "teenagers", label: "청소년" },
    { value: "elderly", label: "노년층" },
    { value: "target_free", label: "타겟 자유" },
  ];

  const COLORS_DATA = [
    { name: "빨강/분홍", hex: "...", code: "pink-red" },
    { name: "노랑/주황", hex: "...", code: "yellow-orange" },
    { name: "초록/파랑", hex: "...", code: "green-blue" },
    { name: "남색/보라", hex: "...", code: "indigo-purple" },
    { name: "갈색/베이지", hex: "...", code: "brown-beige" },
    { name: "색상 자유", hex: "...", code: "color_free" },
  ];

  // Helper functions to get labels from values
  const getStyleLabel = (value) => {
    const styleItem = STYLES_DATA.find((s) => s.value === value);
    return styleItem ? styleItem.label : "선택된 스타일 없음";
  };

  const getTargetLabel = (value) => {
    const targetItem = TARGETS_DATA.find((t) => t.value === value);
    return targetItem ? targetItem.label : "선택된 타겟 없음";
  };

  const getColorLabel = (value) => {
    const colorItem = COLORS_DATA.find((c) => c.code === value);
    return colorItem ? colorItem.name : "선택된 색상 없음";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
        {/* 모달 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="p-12">
          {/* 상단 헤더: 카테고리 및 업종 */}
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <span className="font-semibold">{data.category || "카테고리"}</span>
            <span className="mx-2">|</span>
            <span>{data.businesstype || "업종"}</span>
          </div>

          {/* 공모전 제목 및 가게명 */}
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {data.projectTitle || "공모전 제목"}
          </h1>
          <p className="text-base text-gray-600 mb-8">
            <span className="font-semibold">
              {data.merchantName || "가게명"}
            </span>
          </p>

          <hr className="border-t border-gray-200 mb-8" />

          {/* 공모전 상세 내용 (상금, 기간, 내용, 한 줄 소개) */}
          <div className="space-y-6 text-gray-700">
            <div>
              <p className="text-sm font-semibold mb-1">상금</p>
              <p>{data.prize || "상금 정보가 없습니다."}</p>
            </div>
            <div>
              <p className="text-sm font-semibold mb-1">기간</p>
              <p>
                {data.createdAt && data.deadline
                  ? `${data.createdAt} ~ ${data.deadline}`
                  : "기간 정보가 없습니다."}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold mb-1">내용</p>
              <p className="whitespace-pre-wrap">
                {data.content ||
                  "공모전 내용이 여기에 표시됩니다. 입력된 내용에 따라 자동으로 채워집니다."}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold mb-1">한 줄 소개</p>
              <p>{data.summary || "한 줄 소개 정보가 없습니다."}</p>
            </div>
          </div>

          <hr className="border-t border-gray-200 my-8" />

          {/* 스타일 상세 내용 */}
          <div className="space-y-6 text-gray-700">
            <div>
              <p className="text-sm font-semibold mb-1">스타일</p>
              <p>{getStyleLabel(data.style)}</p>
            </div>
            <div>
              <p className="text-sm font-semibold mb-1">색상</p>
              <p>{getColorLabel(data.color)}</p>
            </div>
            <div>
              <p className="text-sm font-semibold mb-1">타겟</p>
              <p>{getTargetLabel(data.target)}</p>
            </div>
            <div>
              <p className="text-sm font-semibold mb-1">첨부 이미지</p>
              {data.image ? (
                <img
                  src={data.image}
                  alt="첨부 이미지"
                  className="mt-2 max-w-sm rounded-lg"
                />
              ) : (
                <p>첨부된 이미지 없음</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;

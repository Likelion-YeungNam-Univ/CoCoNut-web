import React, { useState, useEffect } from "react";
import MerchantHeader from "../header/MerchantHeader";

const RegisterResult = () => {
  // API에서 받아온 데이터를 저장할 state
  const [data, setData] = useState(null);

  // 컴포넌트가 처음 마운트될 때 API를 호출하는 useEffect 훅
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        // 실제 API 엔드포인트로 교체해주세요
        const response = await fetch(
          "https://api.example.com/project-details/123"
        );
        if (!response.ok) {
          throw new Error("네트워크 응답이 올바르지 않습니다.");
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error("데이터를 불러오는데 실패했습니다.", err);
      }
    };

    fetchProjectData();
  }, []); // 빈 배열을 넣어 컴포넌트 마운트 시 한 번만 실행

  // 데이터가 성공적으로 로드된 후 보여줄 UI
  return (
    <>
      <MerchantHeader />
      <div className="w-full min-h-screen relative p-12">
        {/* 콘텐츠를 중앙에 정렬하기 위해 max-w-4xl과 mx-auto를 사용 */}
        <div className="max-w-4xl mx-auto">
          {/* 상단 헤더: 카테고리 및 업종 */}
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <span className="font-semibold">
              {data?.category || "카테고리"}
            </span>
            <span className="mx-2">|</span>
            <span>{data?.industry || "업종"}</span>
          </div>

          {/* 공모전 제목 및 가게명 */}
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {data?.projectTitle || "공모전 제목"}
          </h1>
          <p className="text-base text-gray-600 mb-8">
            <span className="font-semibold">
              {data?.merchantName || "가게명"}
            </span>
            <span className="ml-2">|</span>
            <span className="ml-2">{data?.summary || "한 줄 소개"}</span>
          </p>

          <hr className="border-t border-gray-200 mb-8" />

          {/* 공모전 상세 내용 */}
          <div className="space-y-6 text-gray-700">
            <div>
              <p className="text-sm font-semibold mb-1">기간</p>
              <p>{data?.period || "2024.01.01 ~ 2024.01.31"}</p>
            </div>
            <div>
              <p className="text-sm font-semibold mb-1">상금</p>
              <p>{data?.prize || "100만원"}</p>
            </div>
            <div>
              <p className="text-sm font-semibold mb-1">내용</p>
              <p className="whitespace-pre-wrap">
                {data?.content ||
                  "공모전 내용이 여기에 표시됩니다. 입력된 내용에 따라 자동으로 채워집니다."}
              </p>
            </div>
          </div>

          <hr className="border-t border-gray-200 my-8" />

          {/* 스타일 상세 내용 */}
          <div className="space-y-6 text-gray-700">
            <div>
              <p className="text-sm font-semibold mb-1">색상</p>
              <p>{data?.color || "선택된 색상 없음"}</p>
            </div>
            <div>
              <p className="text-sm font-semibold mb-1">스타일</p>
              <p>{data?.style || "선택된 스타일 없음"}</p>
            </div>
            <div>
              <p className="text-sm font-semibold mb-1">타겟</p>
              <p>{data?.target || "선택된 타겟 없음"}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterResult;

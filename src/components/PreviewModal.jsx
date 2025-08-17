import React, { useState } from "react";
import calendarIcon from "../assets/calendarIcon.png";
import participantIcon from "../assets/participantIcon.png";
import prizeIcon from "../assets/prizeIcon.png";
import { CgMenuBoxed } from "react-icons/cg";
import { IoPersonCircle } from "react-icons/io5";
import { IoIosCloseCircle } from "react-icons/io";
import { STYLES_DATA } from "../utils/stylesData";
import { TARGETS_DATA } from "../utils/targetData";
import { COLORS_DATA } from "../utils/colorData";
import ContentSubmissionsTabs from "./ContentSubmissionsTabs";

const PreviewModal = ({ isOpen, onClose, data }) => {
  const [activeTab, setActiveTab] = useState("CONTENT");

  if (!isOpen) return null;

  const CATEGORIES_MAP = {
    PLANNING_IDEA: "기획/아이디어",
    ADVERTISING_MARKETING: "광고/마케팅",
    BRANDING_LOGO: "브랜딩/로고",
    PACKAGE_DESIGN: "패키지/포장",
    NAMING_SLOGAN: "네이밍/슬로건",
    CHARCTER_DESIGN: "캐릭터",
    PHOTO_VIDEO_UCC: "사진/영상/UCC",
    INTERIOR_ARCHITECTURE: "인테리어/건축",
    IT_WEB_MOBILE: "IT/웹/모바일",
    ETC: "기타",
  };

  const BUSINESSTYPES_MAP = {
    FOOD_BEVERAGE: "식당/카페/주점",
    LEISURE_SPORTS: "문화/여가",
    EDUCATION: "교육/학원",
    BEAUTY_HEALTH: "뷰티/헬스",
    RETAIL_COMMERCE: "의류/쇼핑몰",
    MEDICAL: "병원/약국",
    PROFESSIONAL_SERVICE: "서비스/전문직",
    ACCOMMAODATION: "숙박/관광",
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
      {/* ✅ 모달 컨테이너를 하나 더 추가하여 X 버튼을 분리합니다. */}
      <div className="relative w-full max-w-5xl">
        {/* ✅ X 버튼을 모달 창 바깥으로 옮김 */}
        <button
          onClick={onClose}
          className="absolute top-0 right-[-60px] flex items-center justify-center text-white transition hover:text-[#A3A3A3]"
        >
          <IoIosCloseCircle size={40} />
        </button>

        {/* ✅ 기존의 모달 창을 이 div로 만듭니다. */}
        <div className="bg-white rounded-lg shadow-lg w-full max-h-[85vh] overflow-y-auto font-pretendard">
          <div className="p-15">
            <div className="flex items-center justify-between text-gray-500 text-sm mb-4 font-pretendard">
              <div className="flex items-center space-x-2 text-[#828282]">
                <span className="text-[#A3A3A3] text-[12px] font-normal font-pretendard">
                  {daysLeft === 0 ? "오늘 마감" : `${daysLeft}일 후 마감`}
                </span>
                <span className="text-[#E1E1E1] text-[10px] font-pretendard">
                  |
                </span>
                <span className="text-[#A3A3A3] text-[12px] font-normal font-pretendard">
                  {getCategoryLabel(data.category)}
                </span>
                <span className="text-[#E1E1E1] text-[10px] font-pretendard">
                  •
                </span>
                <span className="text-[#A3A3A3] text-[12px] font-normal font-pretendard">
                  {getBusinessTypeLabel(data.businesstype)}
                </span>
              </div>
            </div>

            <h1 className="text-[28px] font-semibold text-[#212121] mb-2 font-pretendard">
              {data.projectTitle || "공모전 제목 없음"}
            </h1>

            <div className="flex space-x-2 mb-3">
              <IoPersonCircle className="text-[#B9B9B9] w-[20px] h-[20px]" />
              <p className="text-sm text-[#828282] mb-6 font-pretendard">
                <span className="font-normal text-[#A3A3A3] font-pretendard">
                  {data.merchantName || "가게명 없음"}
                </span>
                <span className="text-[#E1E1E1] text-[10px] mx-2 font-pretendard">
                  |
                </span>
                <span className="font-normal text-[#A3A3A3] font-pretendard">
                  {data.writerNickname || "닉네임 없음"}
                </span>
              </p>
            </div>
            <div className="space-y-3 text-[#4C4C4C] mb-8 font-pretendard">
              <div className="flex items-center space-x-2">
                <img src={prizeIcon} alt="상금 아이콘" className="h-4 w-4" />
                <span className="text-[14px] text-[#828282] font-medium w-[80px] font-pretendard">
                  상금
                </span>
                <p className="text-[14px] font-medium text-[#212121] font-pretendard">
                  {data.rewardAmount || "가격 없음"}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <img
                  src={participantIcon}
                  alt="상금 아이콘"
                  className="h-4 w-4"
                />
                <span className="text-[14px] text-[#828282] font-medium w-[80px] font-pretendard">
                  참여작
                </span>
                <p className="text-[14px] font-medium text-[#212121] font-pretendard">
                  {data.submissionsCount || "참여작 없음"}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <img src={calendarIcon} alt="기간 아이콘" className="h-4 w-4" />
                <span className="text-[14px] text-[#828282] font-medium w-[80px] font-pretendard">
                  기간
                </span>
                <p className="text-[14px] font-medium text-[#212121] font-pretendard">
                  {data.deadline
                    ? `${data.createdAt || "기간 없음"} ~ ${data.deadline}`
                    : "기간 없음"}
                </p>
              </div>
            </div>

            <div className="pt-5">
              <ContentSubmissionsTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </div>

            {activeTab === "CONTENT" ? (
              <div className="space-y-4 mt-18">
                {data.summary && (
                  <div>
                    <h2 className="text-[16px] font-semibold text-[#212121] mb-2 font-pretendard">
                      한 줄 소개
                    </h2>
                    <p className="text-[16px] font-normal font-pretendard">
                      {data.summary}
                    </p>
                  </div>
                )}
                <div className="flex flex-col space-y-4">
                  <h2
                    className={`text-[16px] font-semibold text-[#212121] font-pretendard ${
                      data.summary ? "mt-16" : ""
                    }`}
                  >
                    내용
                  </h2>
                  {data.image && (
                    <div className="p-4 bg-[#EBEBEB] rounded-md text-[#4C4C4C] whitespace-pre-wrap w-full font-pretendard">
                      <img
                        src={data.image}
                        alt="업로드 이미지 미리보기"
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  )}
                  <div className="text-base font-normal whitespace-pre-wrap font-pretendard">
                    {data.content || "공모전 내용이 여기에 표시됩니다."}
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div>
                    <h2 className="text-[16px] font-semibold text-[#212121] mt-16 font-pretendard">
                      색상
                    </h2>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {data.color && data.color.length > 0 ? (
                        data.color[0] === "color_free" ? (
                          <span className="px-4 py-2 rounded border border-[#F3F3F3] text-sm bg-white text-[#212121] flex items-center justify-center col-span-3 font-pretendard">
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
                                className="w-[280px] h-[88px] rounded flex items-center justify-center font-pretendard"
                                style={{ background: colorItem.hex }}
                              ></span>
                            ) : null;
                          })
                        )
                      ) : (
                        <span className="text-[#A3A3A3] text-sm col-span-3 font-pretendard">
                          선택 안 함
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 스타일  */}
                  <div>
                    <h2 className="text-[16px] font-semibold text-[#212121] mt-16 font-pretendard">
                      스타일
                    </h2>
                    <div className="grid grid-cols-6 gap-2 mt-2">
                      {data.style && data.style.length > 0 ? (
                        data.style[0] === "style_free" ? (
                          <span className="w-[130px] h-[48px] rounded border border-[#F3F3F3] text-sm bg-white text-[#212121] flex items-center justify-center col-span-6 font-pretendard">
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
                                className="w-[130px] h-[48px] rounded border border-[#F3F3F3] text-sm bg-white text-black flex items-center justify-center text-center font-pretendard"
                              >
                                {styleItem.label}
                              </span>
                            ) : null;
                          })
                        )
                      ) : (
                        <span className="text-[#A3A3A3] text-sm col-span-6 font-pretendard">
                          선택 안 함
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 타겟  */}
                  <div>
                    <h2 className="text-[16px] font-semibold text-[#212121] mt-16 font-pretendard">
                      타겟
                    </h2>
                    <div className="grid grid-cols-6 gap-2 mt-2">
                      {data.target && data.target.length > 0 ? (
                        data.target[0] === "target_free" ? (
                          <span className="w-[130px] h-[48px] rounded border border-[#F3F3F3] text-sm bg-white text-[#212121] flex items-center justify-center col-span-6 font-pretendard">
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
                                className="w-[130px] h-[48px] rounded border border-[#F3F3F3] text-sm bg-white text-black flex items-center justify-center text-center font-pretendard"
                              >
                                {targetItem.label}
                              </span>
                            ) : null;
                          })
                        )
                      ) : (
                        <span className="text-[#A3A3A3] text-sm col-span-6 font-pretendard">
                          선택 안 함
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] mt-16">
                <CgMenuBoxed size={120} className="text-[#E1E1E1]" />
                <div className="flex flex-col items-center mt-10">
                  <label className="text-[#A3A3A3] text-[12px] font-medium">
                    조금만 기다려주세요.
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;

import React from "react";
import prizeIcon from "../../assets/prizeIcon.png";
import participantIcon from "../../assets/participantIcon.png";
import calendarIcon from "../../assets/calendarIcon.png";
import { IoPersonCircle } from "react-icons/io5";
import { PiLineVertical } from "react-icons/pi";

const ProjectCardInProgress = ({ project, categories, businessTypes }) => {
  // categories 배열에서 현재 프로젝트 category(code)와 매칭되는 객체 찾기
  const categoryObj = categories.find((c) => c.code === project.category);
  const businessTypeObj = businessTypes.find(
    (b) => b.code === project.business_type
  );

  return (
    <div className="w-[856px] h-[252px] border border-[#E1E1E1] rounded-[12px] pl-[28px] font-pretendard hover:opacity-60 hover:border-[#A3A3A3]">
      {/* 상단 카테고리/마감일 */}
      <div className="flex gap-[4px] text-[12px] text-[#A3A3A3] font-medium mt-[20px]">
        <span>30일 후 마감</span>
        <PiLineVertical className="mt-[3px]" />
        <span>{categoryObj ? categoryObj.description : project.category}</span>
        <span>·</span>
        <span>
          {businessTypeObj
            ? businessTypeObj.description
            : project.business_type}
        </span>
      </div>

      {/* 제목 */}
      <h3 className="text-[20px] text-[#212121] font-semibold mt-[12px]">
        {project.title}
      </h3>

      {/* 설명 */}
      <p className="text-[14px] text-[#828282] mt-[6px]">
        {project.description}
      </p>

      <div className="flex flex-col gap-[8px] mt-[20px]">
        {/* 상금 */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 w-[60px]">
            <img src={prizeIcon} alt="상금" className="w-[16px] h-[16px]" />
            <span className="text-[12px] text-[#828282] font-medium">상금</span>
          </div>
          <span className="text-[12px] text-[#212121] font-medium">
            {project.reward_amount.toLocaleString()}원
          </span>
        </div>

        {/* 참여작 */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 w-[60px]">
            <img
              src={participantIcon}
              alt="참여작"
              className="w-[16px] h-[16px]"
            />
            <span className="text-[12px] text-[#828282] font-medium">
              참여작
            </span>
          </div>
          <span className="text-[12px] text-[#212121] font-medium">100개</span>
        </div>

        {/* 기간 */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 w-[60px]">
            <img src={calendarIcon} alt="기간" className="w-[16px] h-[16px]" />
            <span className="text-[12px] text-[#828282] font-medium">기간</span>
          </div>
          <span className="text-[12px] text-[#212121] font-medium">
            {project.period}
          </span>
        </div>
      </div>

      {/* 하단 작성자 */}
      <div className="flex items-center gap-2 text-[14px] text-[#A3A3A3] mt-[17px]">
        <IoPersonCircle className="w-[16px] h-[16px]" />
        <span className="text-[12px] font-medium">
          {project.merchant_name} | {project.nickname}
        </span>
      </div>
    </div>
  );
};

export default ProjectCardInProgress;

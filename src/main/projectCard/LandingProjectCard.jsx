import React from "react";
import prizeIcon from "../../assets/prizeIcon.png";
import participantIcon from "../../assets/participantIcon.png";
import calendarIcon from "../../assets/calendarIcon.png";
import { IoPersonCircle } from "react-icons/io5";
import { PiLineVertical } from "react-icons/pi";
import { formatDate } from "../../utils/dateUtils";

const LandingProjectCard = ({ project }) => {
  // 남은 일 수 계산
  const getDaysLeft = (deadline) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 오늘 0시 기준
    const endDate = new Date(deadline);
    endDate.setHours(0, 0, 0, 0); // 마감일 0시 기준
    const diffTime = endDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="w-[856px] h-[252px] border border-[#E1E1E1] rounded-[12px] pl-[28px] font-pretendard bg-white">
      {/* 상단 카테고리/마감일 */}
      <div className="flex gap-[4px] text-[12px] text-[#A3A3A3] font-medium mt-[20px]">
        <span>{getDaysLeft(project.deadline)}일 후 마감</span>
        <PiLineVertical className="mt-[3px]" />
        <span>{project.category}</span>
        <span>·</span>
        <span>{project.businessType}</span>
      </div>

      {/* 제목 */}
      <h3 className="text-[20px] text-[#212121] font-semibold mt-[12px]">
        {project.title}
      </h3>

      {/* 설명 */}
      <p className="text-[14px] text-[#828282] mt-[6px]">{project.summary}</p>

      <div className="flex flex-col gap-[8px] mt-[20px]">
        {/* 상금 */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 w-[60px]">
            <img src={prizeIcon} alt="상금" className="w-[16px] h-[16px]" />
            <span className="text-[12px] text-[#828282] font-medium">상금</span>
          </div>
          <span className="text-[12px] text-[#212121] font-medium">
            {project.rewardAmount?.toLocaleString()}원
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
          <span className="text-[12px] text-[#212121] font-medium">
            {project.submissionsCount}개
          </span>
        </div>

        {/* 기간 */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 w-[60px]">
            <img src={calendarIcon} alt="기간" className="w-[16px] h-[16px]" />
            <span className="text-[12px] text-[#828282] font-medium">기간</span>
          </div>
          <span className="text-[12px] text-[#212121] font-medium">
            {`${formatDate(project.createdAt)} - ${formatDate(
              project.deadline
            )}`}
          </span>
        </div>
      </div>

      {/* 하단 작성자 */}
      <div className="flex items-center gap-2 text-[14px] text-[#A3A3A3] mt-[17px]">
        <IoPersonCircle className="w-[16px] h-[16px]" />
        <span className="text-[12px] font-medium">
          {project.merchantName} | {project.writerNickname}
        </span>
      </div>
    </div>
  );
};

export default LandingProjectCard;

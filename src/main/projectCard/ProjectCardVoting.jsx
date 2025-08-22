// src/components/cards/ProjectCardVoting.jsx
import React from "react";
import { Link } from "react-router-dom";
import prizeIcon from "../../assets/prizeIcon.png";
import participantIcon from "../../assets/participantIcon.png";
import calendarIcon from "../../assets/calendarIcon.png";
import { IoPersonCircle } from "react-icons/io5";
import { formatDate } from "../../utils/dateUtils";

const ProjectCardVoting = ({
  project,
  categories = [],
  businessTypes = [],
  role,
  onRequireLogin,
}) => {
  const categoryObj = categories.find((c) => c.code === project.category);
  const businessTypeObj = businessTypes.find((b) => b.code === project.businessType);

  // 투표 종료일 = 공모전 마감일 + 7일
  const getVoteDaysLeft = (deadline) => {
    const today = new Date();
    const end = new Date(deadline);
    end.setDate(end.getDate() + 7);
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfEnd = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    return Math.ceil((startOfEnd - startOfToday) / (1000 * 60 * 60 * 24));
  };

  const daysLeft = getVoteDaysLeft(project.deadline);
  const badgeText = daysLeft === 0 ? "오늘 투표 마감" : `${daysLeft}일 후 투표 마감`;
  const badgeClass =
    daysLeft === 0
      ? "w-[80px] h-[25px] bg-[#2FD8F6] text-white"
      : "w-[89px] h-[25px] bg-[#E0F9FE] text-[#26ADC5]";

  const id = project.projectId ?? project.id;

  // 카드 내용
  const cardContent = (
    <div className="w-[856px] h-[252px] border border-[#E1E1E1] rounded-[12px] pl-[28px] font-pretendard hover:opacity-60 hover:border-[#A3A3A3] cursor-pointer">
      {/* 카테고리/업종 */}
      <div className="flex gap-[4px] text-[12px] text-[#A3A3A3] font-medium mt-[20px]">
        <span>{categoryObj ? categoryObj.description : project.category}</span>
        <span>·</span>
        <span>{businessTypeObj ? businessTypeObj.description : project.businessType}</span>
      </div>

      {/* 제목 + 투표 마감 표시 */}
      <div className="mt-[12px] flex items-center gap-[8px]">
        <h3 className="text-[20px] text-[#212121] font-semibold">{project.title}</h3>
        <span
          className={`px-[12px] py-[6px] rounded-[15px] text-[10px] font-medium leading-[130%] tracking-[-0.02em] ${badgeClass}`}
        >
          {badgeText}
        </span>
      </div>

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

        {/* 참여작 (임시) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 w-[60px]">
            <img src={participantIcon} alt="참여작" className="w-[16px] h-[16px]" />
            <span className="text-[12px] text-[#828282] font-medium">참여작</span>
          </div>
          <span className="text-[12px] text-[#212121] font-medium">
            {project.submissionCount}개
          </span>
        </div>

        {/* 기간 */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 w-[60px]">
            <img src={calendarIcon} alt="기간" className="w-[16px] h-[16px]" />
            <span className="text-[12px] text-[#828282] font-medium">기간</span>
          </div>
          <span className="text-[12px] text-[#212121] font-medium">
            {`${formatDate(project.createdAt)} - ${formatDate(project.deadline)}`}
          </span>
        </div>
      </div>

      {/* 하단 작성자 */}
      <div className="flex gap-2 text-[14px] text-[#A3A3A3] mt-[17px]">
        <IoPersonCircle className="w-[16px] h-[16px]" />
        <span className="text-[12px] font-medium">
          {project.merchantName} | {project.writerNickname}
        </span>
      </div>
    </div>
  );

  // role 분기
  if (role === "guest") {
    return (
      <div onClick={() => onRequireLogin?.()} className="cursor-pointer">
        {cardContent}
      </div>
    );
  }

  return (
    <Link
      to={`/project-detail/${id}`}
      state={{ initialTab: "SUBMISSIONS" }}
      className="block"
    >
      {cardContent}
    </Link>
  );
};

export default ProjectCardVoting;

// src/components/myprojects/MyProjectRow.jsx
import React from "react";
import prizeIcon from "../../assets/prizeIcon.png";
import participantIcon from "../../assets/participantIcon.png";
import calendarIcon from "../../assets/calendarIcon.png";
import { formatDate } from "../../utils/dateUtils";

const MyProjectRow = ({ project, getCategoryLabel, getBusinessTypeLabel }) => {
  const formatCurrency = (amount) => {
    if (amount == null) return "가격 없음";
    const numeric = Number(String(amount).replace(/[^0-9]/g, ""));
    if (Number.isNaN(numeric)) return amount;
    return numeric.toLocaleString() + "원";
  };

  const period =
    project?.createdAt && project?.deadline
      ? `${formatDate(project.createdAt)} - ${formatDate(project.deadline)}`
      : "기간 없음";

  return (
    // ▶ 플랫 스타일: 테두리/라운드 제거, 여백만 최소화
    <div className="w-full px-4 py-3">
      {/* ① 카테고리/업종 */}
      <div className="text-[12px] text-[#8F8F8F]">
        {getCategoryLabel(project?.category) || "카테고리 없음"}
        <span className="mx-1.5">·</span>
        {getBusinessTypeLabel(project?.businessType) || "업종 없음"}
      </div>

      {/* ② 제목 (줄간격 타이트) */}
      <h3 className="mt-[2px] text-[16px] font-semibold text-[#212121] leading-[1.2]">
        {project?.title || "공모전 제목 없음"}
      </h3>

      {/* ③ 요약 (한 줄, 말줄임표) */}
      <p className="mt-[2px] text-[12px] text-[#626262] truncate">
        {project?.summary || "프로젝트 요약 정보가 없습니다."}
      </p>

      {/* ④ 하단 정보 */}
      <div className="mt-[10px] space-y-[6px] text-[13px]">
        <div className="flex items-center gap-[6px]">
          <img className="w-4 h-4" src={prizeIcon} alt="상금" />
          <span className="text-[#828282] w-[36px]">상금</span>
          <span className="font-medium text-[#212121]">
            {formatCurrency(project?.rewardAmount)}
          </span>
        </div>
        <div className="flex items-center gap-[6px]">
          <img className="w-4 h-4" src={participantIcon} alt="참여작" />
          <span className="text-[#828282] w-[36px]">참여작</span>
          <span className="font-medium text-[#212121]">
            {project?.submissionsCount ?? 0}개
          </span>
        </div>
        <div className="flex items-center gap-[6px]">
          <img className="w-4 h-4" src={calendarIcon} alt="기간" />
          <span className="text-[#828282] w-[36px]">기간</span>
          <span className="font-medium text-[#212121]">{period}</span>
        </div>
      </div>
    </div>
  );
};

export default MyProjectRow;

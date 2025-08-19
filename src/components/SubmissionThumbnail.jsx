import React from "react";

const SubmissionThumbnail = ({ submission, onClick, isBlur }) => {
  return (
    <div
      className="w-[240px] h-[306px] rounded-lg cursor-pointer flex flex-col overflow-hidden border border-[#E1E1E1]"
      onClick={() => onClick(submission)}
    >
      <div className="bg-[#EBEBEB] w-[240px] h-[240px] flex items-center justify-center">
        {submission.imageUrl ? (
          <img
            src={submission.imageUrl}
            alt="참여 이미지"
            className={`w-full h-full object-cover ${isBlur ? "blur-xs" : ""}`}
          />
        ) : (
          <div className="text-[#A3A3A3] text-sm">이미지 없음</div>
        )}
      </div>
      <div className="p-5 bg-white font-pretendard">
        <h3 className="text-[#212121] text-[16px] font-semibold truncate hover:text-[#626262]">
          {submission.title || "제목 없음"}
        </h3>
      </div>
    </div>
  );
};

export default SubmissionThumbnail;

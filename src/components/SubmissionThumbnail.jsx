import React from "react";

const SubmissionThumbnail = ({ submission, onClick }) => {
  return (
    <div
      className="w-[240px] rounded-lg cursor-pointer flex flex-col overflow-hidden shadow-md"
      onClick={() => onClick(submission)}
    >
      <div className="bg-[#EBEBEB] h-[200px] w-full flex items-center justify-center">
        {submission.imageUrl ? (
          <img
            src={submission.imageUrl}
            alt="참여 이미지"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-[#A3A3A3] text-sm">이미지 없음</div>
        )}
      </div>
      <div className="p-4 bg-white">
        <h3 className="text-[#212121] text-[14px] font-medium truncate">
          {submission.title || "제목 없음"}
        </h3>
      </div>
    </div>
  );
};

export default SubmissionThumbnail;

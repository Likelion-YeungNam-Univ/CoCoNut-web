import React from "react";

// 프로젝트 상태 탭 - 진행중, 투표중, 완료
const ProjectStatusTabs = ({ activeTab, setActiveTab }) => {
  const tabLabels = {
    in_progress: "진행 중",
    voting: "투표 중",
    closed: "완료",
  };
  const tabs = ["in_progress", "voting", "closed"];

  return (
    <div className="flex gap-4 pl-[416px] pt-[40px] pb-[32px]">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`text-[20px] font-pretendard font-semibold cursor-pointer ${
            activeTab === tab
              ? "text-[#212121] border-b-[4px] border-[#212121]"
              : "text-[#C3C3C3]"
          }`}
        >
          {tabLabels[tab]}
        </button>
      ))}
    </div>
  );
};

export default ProjectStatusTabs;

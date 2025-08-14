import React from "react";

// 프로젝트 상태 탭 - 진행중, 투표중, 완료
const ProjectStatusTabs = ({ activeTab, setActiveTab }) => {
  const tabLabels = {
    IN_PROGRESS: "진행 중",
    VOTING: "투표 중",
    CLOSED: "완료",
  };
  const tabs = ["IN_PROGRESS", "VOTING", "CLOSED"];

  return (
    <div className="flex gap-4 pl-[416px] pt-[40px] pb-[32px]">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`relative text-[20px] font-pretendard font-semibold cursor-pointer ${
            activeTab === tab
              ? "text-[#212121]"
              : "text-[#C3C3C3] hover:text-[#AEAEAE]"
          }`}
        >
          {tabLabels[tab]}
          {activeTab === tab && (
            <span className="absolute left-0 bottom-[-4px] w-full h-[4px] bg-[#212121] rounded-[2px]" />
          )}
        </button>
      ))}
    </div>
  );
};

export default ProjectStatusTabs;

import React from "react";

const tabLabels = {
  in_progress: "진행 중",
  voting: "투표 중",
  closed: "완료",
};
const tabs = ["in_progress", "voting", "closed"];

const SearchStatusTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex gap-[12px] pb-[20px]">
      {tabs.map((k) => {
        const label = tabLabels[k];
        const active = activeTab === k;
        return (
          <button
            key={k}
            onClick={() => setActiveTab((prev) => (prev === k ? null : k))}
            className={`
              w-[74px] h-[40px] px-[20px] rounded-[20px]
              text-[12px] font-medium font-pretendard whitespace-nowrap cursor-pointer
              ${
                active
                  ? "bg-[#4C4C4C] text-[#FFFFFF]"
                  : "bg-[#FFFFFF] text-[#212121] border-[1px] border-[#E1E1E1] hover:bg-[#F3F3F3]"
              }
              leading-[130%] tracking-[-0.02em]`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default SearchStatusTabs;

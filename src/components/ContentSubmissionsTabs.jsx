import React from "react";

const tabLabels = {
  CONTENT: "내용",
  SUBMISSIONS: "참여작",
};
const tabs = ["CONTENT", "SUBMISSIONS"];

const ContentSubmissionsTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="border-b-[1px] border-[#E1E1E1]">
      <div className="flex gap-[15px] pb-[3px]">
        {tabs.map((k) => {
          const label = tabLabels[k];
          const active = activeTab === k;
          return (
            <div
              key={k}
              onClick={() => setActiveTab(k)}
              className="flex flex-col items-center cursor-pointer relative"
            >
              <span
                className={`
                  text-[20px] font-semibold font-pretendard whitespace-nowrap
                  ${active ? "text-[#212121]" : "text-[#C3C3C3]"}
                `}
              >
                {label}
              </span>

              {active && (
                <div
                  className="
                    absolute bottom-[-5px] left-1/2 transform -translate-x-1/2
                    w-full h-[3px] rounded-[1px] bg-[#212121]
                  "
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContentSubmissionsTabs;

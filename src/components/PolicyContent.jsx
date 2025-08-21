import React from "react";
import { TERMS_DATA } from "../utils/termsData";

const PolicyContent = ({ type }) => {
  let data;
  let ListComponent;
  let listStyleClass;

  switch (type) {
    case "terms":
      data = TERMS_DATA.serviceTerms;
      ListComponent = "ol";
      listStyleClass = "list-decimal pl-5";
      break;
    case "privacy":
      data = TERMS_DATA.personalInfo;
      ListComponent = "ul";
      listStyleClass = "list-none";
      break;
    default:
      return null;
  }

  if (!data || !data.sections) {
    return (
      <div className="text-gray-700 p-5">약관 정보를 불러올 수 없습니다.</div>
    );
  }

  const isNumbered = (text) => /^\(\d+\)/.test(text.trim());

  return (
    <div className="pr-20 pb-10 text-[14px] font-pretendard">
      {data.sections.map((section, index) => (
        <div key={index} className="mb-6">
          <h3 className="font-semibold mb-2 text-[12px]">{section.subtitle}</h3>
          <ListComponent className={listStyleClass}>
            {section.points.map((point, pointIndex) => (
              <li
                key={pointIndex}
                className="mb-1 text-[#212121] font-normal text-[12px]"
              >
                {type === "privacy" && !isNumbered(point) && "- "}
                {point}
              </li>
            ))}
          </ListComponent>
        </div>
      ))}
    </div>
  );
};

export default PolicyContent;

import React from "react";
import { TERMS_DATA } from "../termsData";

const PolicyContent = ({ type }) => {
  let data;

  switch (type) {
    case "terms":
      data = TERMS_DATA.terms;
      break;
    case "privacy":
      data = TERMS_DATA.personalInfo;
      break;
    default:
      return null;
  }
  if (!data || !data.sections) {
    return (
      <div className="text-gray-700 p-5">약관 정보를 불러올 수 없습니다.</div>
    );
  }

  return (
    <div className="pl-10 pr-20 pb-10 text-[14px] font-pretendard">
      {data.sections.map((section, index) => (
        <div key={index} className="mb-6">
          <h3 className="font-bold mb-2 text-lg">{section.subtitle}</h3>
          <ul className="list-none p-0">
            {section.points.map((point, pointIndex) => (
              <li key={pointIndex} className="mb-1 text-[#4c4c4c]">
                {point}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default PolicyContent;

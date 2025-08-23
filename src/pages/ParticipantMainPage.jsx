import React, { useEffect, useState } from "react";
import ProjectStatusTabs from "../main/ProjectStatusTabs";
import CategoryFilter from "../main/CategoryFilter";
import ProjectList from "../main/ProjectList";
import Footer from "../components/Footer";
import ParticipantHeader from "../header/ParticipantHeader";
import ParticipantBanner from "../main/ParticipantBanner";

const ParticipantMainPage = () => {
  const [activeTab, setActiveTab] = useState("IN_PROGRESS"); // 진행중, 투표중, 완료 탭 상태 / 참가자 기본값 : 진행중
  const [selectedCategories, setSelectedCategories] = useState([]); // 카테고리 선택 상태
  const [selectedBusinesses, setSelectedBusinesses] = useState([]); // 업종 선택 상태
  const [q, setQ] = useState(""); // 검색어 상태
  const [isSearched, setIsSearched] = useState(false); // 검색 제출 여부
  const [categories, setCategories] = useState([]); // 카테고리 API 상태
  const [businessTypes, setBusinessTypes] = useState([]); // 업종 목록 상태

  useEffect(() => {
    setSelectedCategories([]);
    setSelectedBusinesses([]);
  }, [activeTab]);

  return (
    <div>
      <ParticipantHeader />
      <ParticipantBanner />
      <ProjectStatusTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex px-[240px] gap-[40px]">
        <CategoryFilter
          categories={categories}
          setCategories={setCategories}
          businessTypes={businessTypes}
          setBusinessTypes={setBusinessTypes}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          selectedBusinesses={selectedBusinesses}
          setSelectedBusinesses={setSelectedBusinesses}
        />
        <ProjectList
          q={q}
          isSearched={isSearched}
          activeTab={activeTab}
          categories={categories}
          businessTypes={businessTypes}
          selectedCategories={selectedCategories}
          selectedBusinesses={selectedBusinesses}
          role="participant"
        />
      </div>
      <Footer />
    </div>
  );
};

export default ParticipantMainPage;

import React, { useState } from "react";
import MerchantHeader from "../header/MerchantHeader";
import ProjectStatusTabs from "../main/ProjectStatusTabs";
import CategoryFilter from "../main/CategoryFilter";
import ProjectList from "../main/ProjectList";
import { BiSolidPencil } from "react-icons/bi";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import MerchantBanner from "../main/MerchantBanner";

const MerchantMainPage = () => {
  const [activeTab, setActiveTab] = useState("CLOSED"); // 진행중, 투표중, 완료 탭 상태
  const [selectedCategories, setSelectedCategories] = useState([]); // 카테고리 선택 상태
  const [selectedBusinesses, setSelectedBusinesses] = useState([]); // 업종 선택 상태
  const [q, setQ] = useState(""); // 검색어 상태
  const [isSearched, setIsSearched] = useState(false); // 검색 제출 여부
  const [categories, setCategories] = useState([]); // 카테고리 API 상태
  const [businessTypes, setBusinessTypes] = useState([]); // 업종 목록 상태

  return (
    <div>
      <MerchantHeader />
      <MerchantBanner />
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
        />
      </div>
      <Footer />
      <Link
        to="/project-register"
        className="fixed bottom-[50px] right-[110px] z-[9999]
             flex items-center gap-[6px] pl-[16px] pr-[20px] py-[12px] w-[157px] h-[45px]
             rounded-[8px] bg-[#2FD8F6] text-white hover:bg-[#2AC2DD] cursor-pointer"
      >
        <BiSolidPencil className="w-[16px] h-[16px]" />
        <span className="text-[16px] font-medium font-pretendard leading-[130%] tracking-[-0.02em]">
          공모전 등록하기
        </span>
      </Link>
    </div>
  );
};

export default MerchantMainPage;

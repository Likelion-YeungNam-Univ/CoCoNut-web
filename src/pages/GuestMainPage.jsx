import React, { useState } from "react";
import ProjectStatusTabs from "../main/ProjectStatusTabs";
import CategoryFilter from "../main/CategoryFilter";
import ProjectList from "../main/ProjectList";
import { BiSolidPencil } from "react-icons/bi";
import Footer from "../components/Footer";
import MerchantBanner from "../main/MerchantBanner";
import GuestHeader from "../header/GuestHeader";
import LoginRequiredModal from "../components/LoginRequiredModal";

const GuestMainPage = () => {
  const [activeTab, setActiveTab] = useState("IN_PROGRESS");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBusinesses, setSelectedBusinesses] = useState([]);
  const [q, setQ] = useState("");
  const [isSearched, setIsSearched] = useState(false);
  const [categories, setCategories] = useState([]);
  const [businessTypes, setBusinessTypes] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <div>
      <GuestHeader />
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
          role="guest"
          onRequireLogin={() => setShowLoginModal(true)}
        />
      </div>
      <Footer />

      {/* 공모전 등록하기 버튼 */}
      <button
        onClick={() => setShowLoginModal(true)}
        className="fixed bottom-[50px] right-[110px] z-[9999]
             flex items-center gap-[6px] pl-[16px] pr-[20px] py-[12px] w-[157px] h-[45px]
             rounded-[8px] bg-[#2FD8F6] text-white hover:bg-[#2AC2DD] cursor-pointer"
      >
        <BiSolidPencil className="w-[16px] h-[16px]" />
        <span className="text-[16px] font-medium font-pretendard leading-[130%] tracking-[-0.02em]">
          공모전 등록하기
        </span>
      </button>

      {showLoginModal && (
        <LoginRequiredModal onClose={() => setShowLoginModal(false)} />
      )}
    </div>
  );
};

export default GuestMainPage;

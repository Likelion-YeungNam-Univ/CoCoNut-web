import React, { useEffect, useState } from "react";
import ProjectStatusTabs from "../main/ProjectStatusTabs";
import CategoryFilter from "../main/CategoryFilter";
import ProjectList from "../main/ProjectList";
import { BiSolidPencil } from "react-icons/bi";
import Footer from "../components/Footer";
import MerchantBanner from "../main/MerchantBanner";
import GuestHeader from "../header/GuestHeader";
import LoginRequiredModal from "../components/LoginRequiredModal";
import { fetchUserInfo } from "../apis/userApi";
import { useNavigate } from "react-router-dom";

const GuestMainPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("IN_PROGRESS");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBusinesses, setSelectedBusinesses] = useState([]);
  const [q, setQ] = useState("");
  const [isSearched, setIsSearched] = useState(false);
  const [categories, setCategories] = useState([]);
  const [businessTypes, setBusinessTypes] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    setSelectedCategories([]);
    setSelectedBusinesses([]);
  }, [activeTab]);

  useEffect(() => {
    const checkIfLoggedIn = async () => {
      try {
        const user = await fetchUserInfo();
        if (user?.role === "ROLE_USER") {
          alert(
            "참가자 계정으로 로그인된 상태입니다.\n참가자 메인 페이지로 이동합니다."
          );
          navigate("/participant-main-page");
        } else if (user?.role === "ROLE_BUSINESS") {
          alert(
            "소상공인 계정으로 로그인된 상태입니다.\n소상공인 메인 페이지로 이동합니다."
          );
          navigate("/merchant-main-page");
        }
      } catch (err) {
        console.log("게스트 접근 허용");
      }
    };

    checkIfLoggedIn();
  }, [navigate]);

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

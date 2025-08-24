import React, { useEffect, useState } from "react";
import ProjectStatusTabs from "../main/ProjectStatusTabs";
import CategoryFilter from "../main/CategoryFilter";
import ProjectList from "../main/ProjectList";
import Footer from "../components/Footer";
import ParticipantHeader from "../header/ParticipantHeader";
import ParticipantBanner from "../main/ParticipantBanner";
import { fetchUserInfo } from "../apis/userApi";
import { useNavigate } from "react-router-dom";

const ParticipantMainPage = () => {
  const navigate = useNavigate();
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

  useEffect(() => {
    const checkRole = async () => {
      try {
        const user = await fetchUserInfo();
        if (user.role !== "ROLE_USER") {
          alert("참가자 계정으로 로그인해야 이용할 수 있습니다.");
          navigate("/merchant-main-page");
        }
      } catch (err) {
        alert("참가자 계정으로 로그인해야 이용할 수 있습니다.");
        navigate("/signin");
      }
    };

    checkRole();
  }, [navigate]);

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

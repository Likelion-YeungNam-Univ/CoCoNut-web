import React, { useState } from "react";
import ProjectStatusTabs from "../main/ProjectStatusTabs";
import CategoryFilter from "../main/CategoryFilter";
import ProjectList from "../main/ProjectList";
import Footer from "../components/Footer";
import ParticipantHeader from "../header/ParticipantHeader";
import ParticipantBanner from "../main/ParticipantBanner";

const ParticipantMainPage = () => {
  const [activeTab, setActiveTab] = useState("IN_PROGRESS");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBusinesses, setSelectedBusinesses] = useState([]);
  const [q, setQ] = useState("");
  const [isSearched, setIsSearched] = useState(false);
  const [categories, setCategories] = useState([]);
  const [businessTypes, setBusinessTypes] = useState([]);

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

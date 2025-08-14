import React, { useMemo, useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import MerchantHeader from "../header/MerchantHeader";
import CategoryFilter from "../main/CategoryFilter";
import ProjectList from "../main/ProjectList";
import Footer from "../components/Footer";
import SearchStatusTabs from "../components/SearchStatusTaps";
import MainBanner from "../main/MainBanner";
import { BiSolidPencil } from "react-icons/bi";

const SearchPage = () => {
  const [params, setParams] = useSearchParams();
  const q = (params.get("q") ?? "").trim();

  const [activeTab, setActiveTab] = useState("IN_PROGRESS"); // 초기 미선택 = 전체
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBusinesses, setSelectedBusinesses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [businessTypes, setBusinessTypes] = useState([]);

  // q가 바뀌면 스크롤
  useEffect(() => {
    if (q) {
      document
        .getElementById("search-title")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  }, [q]);

  const onClearSearch = () => {
    params.delete("q");
    setParams(params, { replace: true });
  };

  return (
    <div>
      <MerchantHeader />
      <MainBanner />
      {/* 상단 요약 바 */}
      <div
        id="search-title"
        className="pt-[40px] pb-[28px] pl-[416px] font-pretendard text-[20px] text-[#212121] font-semibold"
      >
        {q ? <>‘{q}’ 검색 결과</> : <>검색어를 입력해 주세요</>}
      </div>

      {/* 상태 탭(검색 전용 디자인) */}
      <div className="flex px-[240px] gap-[40px]" id="search-results">
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
        <div>
          <SearchStatusTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <ProjectList
            q={q}
            isSearched={!!q}
            activeTab={activeTab}
            categories={categories}
            businessTypes={businessTypes}
            selectedCategories={selectedCategories}
            selectedBusinesses={selectedBusinesses}
            searchMode
            onClearSearch={onClearSearch}
            hideHeader
          />
        </div>
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

export default SearchPage;

import React, { useState, useEffect } from "react";
import { SlArrowUpCircle } from "react-icons/sl";
import api from "../apis/api";

import MerchantHeader from "../header/MerchantHeader";
import TermsModal from "../modal/TermsModal";
import PreviewModal from "../modal/PreviewModal";
import ConfirmModal from "../modal/ConfirmModal";
import EasyHelpModal from "../modal/EasyHelpModal";
import ConfirmBackModal from "../modal/ConfirmBackModal";
import PrizeInfoModal from "../modal/PrizeInfoModal";
import FooterRegister from "../components/FooterRegister";
import { TERMS_DATA } from "../utils/termsData";
import { STYLES_DATA } from "../utils/stylesData";
import { TARGETS_DATA } from "../utils/targetData";
import { COLORS_DATA } from "../utils/colorData";

const ProjectRegister = () => {
  // 약관 동의 관련 상태
  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeChecklist, setAgreeChecklist] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeCaution, setAgreeCaution] = useState(false);
  const [isButtonActive, setIsButtonActive] = useState(false);

  // 모달 관련 상태
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");
  const [previewData, setPreviewData] = useState(null);
  const [isEasyHelpModalOpen, setIsEasyHelpModalOpen] = useState(false);
  const [isPrizeInfoModalOpen, setIsPrizeInfoModalOpen] = useState(false);
  const [isBackModalOpen, setIsBackModalOpen] = useState(false);

  // AI 분석 관련 상태
  const [assistanceText, setAssistanceText] = useState("");
  const [loading, setLoading] = useState(false);

  // AI 분석 결과를 통합적으로 관리하는 새로운 상태 변수
  const [aiProjectData, setAiProjectData] = useState({
    rewardAmount: "",
    description: "",
    summary: "",
    createdAt: "",
    deadline: "",
  });

  // 프로젝트 등록 폼 관련 상태
  const [projectTitle, setProjectTitle] = useState("");
  const [merchantName, setMerchantName] = useState("");
  const [category, setCategory] = useState("");
  const [businesstype, setBusinesstype] = useState("");
  const [color, setColor] = useState("");
  const [style, setStyle] = useState("");
  const [target, setTarget] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);

  // API에서 받아올 카테고리 및 업종 상태
  const [categories, setCategories] = useState([]);
  const [businesstypes, setBusinesstypes] = useState([]);

  // 에러 메시지 상태
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 등록하기 버튼 활성화 로직
  useEffect(() => {
    if (agreeChecklist && agreeTerms && agreeCaution) {
      setIsButtonActive(true);
    } else {
      setIsButtonActive(false);
    }
  }, [agreeChecklist, agreeTerms, agreeCaution]);

  // API에서 카테고리 및 업종 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await api.get("enums/categories");
        setCategories(categoriesResponse.data);

        const businessTypesResponse = await api.get("enums/businessTypes");
        setBusinesstypes(businessTypesResponse.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  // 뒤로가기 모달을 위한 useEffect 추가
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const handlePopstate = () => {
      setIsBackModalOpen(true);
    };

    window.addEventListener("popstate", handlePopstate);

    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, []);

  // 모든 약관 동의 핸들러
  const handleAgreeAllChange = (e) => {
    const isChecked = e.target.checked;
    setAgreeAll(isChecked);
    setAgreeChecklist(isChecked);
    setAgreeTerms(isChecked);
    setAgreeCaution(isChecked);
  };

  // 약관 모달 열기 핸들러
  const handleOpenTermsModal = (termType) => {
    const data = TERMS_DATA[termType];
    if (data) {
      setModalTitle(data.title);
      setModalContent(data.content);
      setIsTermsModalOpen(true);
    }
  };

  // AI 분석 핸들러
  const analyzeWithAI = async () => {
    setLoading(true);

    try {
      const response = await api.post("/projects/assist", {
        prompt: assistanceText,
      });
      const aiData = response.data;

      setAiProjectData({
        rewardAmount: aiData.rewardAmount,
        description: aiData.description,
        summary: aiData.summary,
        createdAt: aiData.createdAt,
        deadline: aiData.deadline,
      });
    } catch (error) {
      console.error("AI analysis error:", error);
      if (error.response && error.response.status === 401) {
        alert("인증 오류가 발생했습니다. 로그인 상태를 확인해 주세요.");
      } else {
        alert("AI 분석 중 오류가 발생했습니다. 다시 시도해 주세요.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 미리보기 모달 열기 핸들러
  const handleOpenPreviewModal = () => {
    const data = {
      projectTitle,
      merchantName,
      category,
      businesstype,
      createdAt: aiProjectData.createdAt,
      deadline: aiProjectData.deadline,
      rewardAmount: aiProjectData.rewardAmount,
      content: aiProjectData.description,
      summary: aiProjectData.summary,
      color,
      style,
      target,
      image: uploadedImage ? URL.createObjectURL(uploadedImage) : null,
    };
    setPreviewData(data);
    setIsPreviewModalOpen(true);
  };

  // 확인 모달 열기 핸들러
  const handleOpenConfirmModal = () => {
    setIsConfirmModalOpen(true);
  };

  // 제출 확인 핸들러 (유효성 검사 및 API 전송 로직 추가)
  const handleConfirmSubmit = async () => {
    // 기간 계산
    const startDate = new Date(aiProjectData.createdAt.replace(/\./g, "-"));
    const deadlineDate = new Date(aiProjectData.deadline.replace(/\./g, "-"));
    const timeDiff = deadlineDate.getTime() - startDate.getTime();
    const durationInDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    // FormData 객체 생성
    const formData = new FormData();
    formData.append("title", projectTitle);
    formData.append("merchantName", merchantName);
    formData.append("category", category);
    formData.append("businessType", businesstype);
    formData.append("description", aiProjectData.description);
    formData.append("durationInDays", durationInDays);
    formData.append(
      "rewardAmount",
      parseInt(aiProjectData.rewardAmount.replace(/,/g, ""), 10)
    );
    formData.append("summary", aiProjectData.summary);

    if (color && color !== "color_free") {
      formData.append("colors[]", color);
    }
    if (style && style !== "style_free") {
      formData.append("styles[]", style);
    }
    if (target && target !== "target_free") {
      formData.append("targets[]", target);
    }

    if (uploadedImage) {
      formData.append("image", uploadedImage);
    }

    try {
      const response = await api.post("/projects", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("공모전 등록 완료:", response.data);
      alert("공모전 등록이 완료되었습니다.");
      setIsConfirmModalOpen(false);
    } catch (error) {
      console.error("공모전 등록 실패:", error);
      alert("공모전 등록 중 오류가 발생했습니다. 다시 시도해 주세요.");
      setIsConfirmModalOpen(false);
    }
  };

  // 뒤로가기 모달 관련 핸들러
  const handleOpenBackModal = () => {
    setIsBackModalOpen(true);
  };

  const handleConfirmBack = () => {
    setIsBackModalOpen(false);
    window.history.back();
  };

  // 새로운 등록 버튼 클릭 핸들러: 유효성 검사 후 모달 오픈
  const handleRegisterClick = () => {
    setIsSubmitted(true);
    const newErrors = {};
    if (!projectTitle)
      newErrors.projectTitle = "공모전 제목이 입력되지 않았습니다.";
    if (!merchantName) newErrors.merchantName = "가게명이 입력되지 않았습니다.";
    if (!category) newErrors.category = "카테고리가 선택되지 않았습니다.";
    if (!businesstype) newErrors.businesstype = "업종이 선택되지 않았습니다.";
    if (!aiProjectData.description)
      newErrors.content = "내용이 입력되지 않았습니다.";
    if (!aiProjectData.rewardAmount)
      newErrors.rewardAmount = "상금이 입력되지 않았습니다.";
    if (!aiProjectData.createdAt || !aiProjectData.deadline)
      newErrors.period = "기간이 입력되지 않았습니다.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      handleOpenConfirmModal();
    }
  };

  return (
    <div className="flex flex-col">
      <MerchantHeader />
      <div className="bg-[#F8F8F8] flex justify-center py-12 px-4">
        <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-[1032px] min-h-[2408px]">
          <div className="max-w-2xl mx-auto mt-12">
            <section className="flex flex-col mb-12 items-center">
              <h1 className="text-3xl font-semibold mb-3 text-[#000000]">
                공모전 등록하기
              </h1>
              <p className="text-sm text-[#828282]">
                필요한 홍보물, 메뉴판 등 어떤 요청이든 쉽게 등록하세요.
              </p>
              <p className="text-sm text-[#828282]">
                마음에 드는 수상작을 직접 선택할 수 있습니다.
              </p>
            </section>
            <div className="flex justify-between">
              <h1 className="text-xl font-semibold text-[#000000] mb-2">
                기본정보 입력
              </h1>
              <label className="text-sm font-normal text-[#626262]">
                <span className="text-[#2FD8F6]">*</span>필수입력
              </label>
            </div>
            <div className="w-auto h-[1px] bg-[#A3A3A3] mx-[-0.5rem]" />

            <section className="my-10">
              <div className="space-y-7">
                {/*  "공모전 제목" */}
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <label className="w-44 text-sm font-normal text-[#212121]">
                      공모전 제목<span className="text-[#2FD8F6]">*</span>
                    </label>
                    <div className="flex-grow flex flex-col">
                      <input
                        type="text"
                        className={`w-full rounded p-2 h-10 text-xs text-[#212121] placeholder:text-[#C3C3C3] ${
                          isSubmitted && errors.projectTitle
                            ? "border border-red-500"
                            : "border border-[#F3F3F3]"
                        }`}
                        placeholder="공모전 제목을 지어주세요."
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                      />
                      {isSubmitted && errors.projectTitle && (
                        <p className="text-red-500 text-xs text-left mt-1">
                          {errors.projectTitle}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                {/* "가게명" */}
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <label className="w-44 text-sm font-normal text-[#212121]">
                      가게명<span className="text-[#2FD8F6]">*</span>
                    </label>
                    <div className="flex-grow flex flex-col">
                      <input
                        type="text"
                        className={`w-full rounded p-2 h-10 text-xs text-[#212121] placeholder:text-[#C3C3C3] ${
                          isSubmitted && errors.projectTitle
                            ? "border border-red-500"
                            : "border border-[#F3F3F3]"
                        }`}
                        placeholder="정확한 가게명(상호명)을 입력해 주세요."
                        value={merchantName}
                        onChange={(e) => setMerchantName(e.target.value)}
                      />
                      {isSubmitted && errors.merchantName && (
                        <p className="text-red-500 text-xs text-left mt-1">
                          {errors.merchantName}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                {/* "카테고리" */}
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <label className="w-44 text-sm font-normal text-[#212121]">
                      카테고리<span className="text-[#2FD8F6]">*</span>
                    </label>
                    <div className="flex-grow flex flex-col">
                      <select
                        className={`w-full border border-[#F3F3F3] rounded p-2 h-10 text-xs bg-white ${
                          !category ? "text-[#C3C3C3]" : "text-[#212121]"
                        }`}
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="" disabled>
                          공모전의 카테고리를 선택해 주세요
                        </option>
                        {categories.map((cat) => (
                          <option key={cat.code} value={cat.code}>
                            {cat.description}
                          </option>
                        ))}
                      </select>
                      {isSubmitted && errors.category && (
                        <p className="text-red-500 text-xs text-left mt-1">
                          {errors.category}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                {/* "업종" */}
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <label className="w-44 text-sm font-normal text-[#212121]">
                      업종<span className="text-[#2FD8F6]">*</span>
                    </label>
                    <div className="flex-grow flex flex-col">
                      <select
                        className={`w-full border border-[#F3F3F3] rounded p-2 h-10 text-xs bg-white ${
                          !businesstype ? "text-[#C3C3C3]" : "text-[#212121]"
                        }`}
                        value={businesstype}
                        onChange={(e) => setBusinesstype(e.target.value)}
                      >
                        <option value="" disabled>
                          가게(상호)의 업종을 선택해 주세요
                        </option>
                        {businesstypes.map((bus) => (
                          <option key={bus.code} value={bus.code}>
                            {bus.description}
                          </option>
                        ))}
                      </select>
                      {isSubmitted && errors.businesstype && (
                        <p className="text-red-500 text-xs text-left mt-1">
                          {errors.businesstype}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <h2 className="text-xl font-semibold mb-2 text-[#000000]">
              공모전 내용 입력
            </h2>
            <div className="w-auto h-[1px] bg-[#A3A3A3] mx-[-0.5rem]" />

            <section className="my-10">
              <div className="space-y-7">
                <div className="flex items-start space-x-2">
                  <div className="group w-44 flex flex-col space-y-1 justify-center items-center pr-7 relative">
                    <label className="text-sm font-normal text-[#212121] pt-2">
                      AI로 공모전 쉽게 작성하기
                    </label>
                    <a
                      href="#"
                      className="w-40 text-xs rounded-3xl text-[#2AC2DD] pt-2 pb-2 text-center bg-[#E0F9FE] hover:bg-[#2FD8F6] hover:text-[#FFFFFF]"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      Tip. 도움받는 법 알아보기
                    </a>
                    {/* EasyHelpModal 컴포넌트를 렌더링합니다 */}
                    <EasyHelpModal />
                  </div>

                  <div className="flex-grow justify-between relative">
                    <textarea
                      className="w-full border border-[#F3F3F3] rounded p-2 h-24 text-xs text-[#212121] placeholder:text-[#C3C3C3] pr-10"
                      placeholder="어떤 도움이 필요한지 작성해 주세요. AI가 내용, 기간, 상금 등을 자동으로 생성해줘요."
                      value={assistanceText}
                      onChange={(e) => setAssistanceText(e.target.value)}
                    />
                    <SlArrowUpCircle
                      className="absolute right-2 bottom-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                      size={24}
                      onClick={analyzeWithAI}
                    />
                  </div>
                </div>
                {loading && (
                  <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-50 rounded-xl shadow-lg py-4 px-6 z-50">
                    <p className="text-white text-lg text-center">
                      AI가 내용을 불러오는 중이에요...
                    </p>
                  </div>
                )}
                {/* "내용" */}
                <div className="flex flex-col space-y-1">
                  <div className="flex items-start space-x-2">
                    <label className="w-44 text-sm font-normal text-[#212121] pt-2">
                      내용<span className="text-[#2FD8F6]">*</span>
                    </label>
                    <div className="flex-grow flex flex-col">
                      {" "}
                      <textarea
                        className={`w-full border border-[#F3F3F3] rounded p-2 h-24 text-xs text-[#212121] placeholder:text-[#C3C3C3] pr-10 ${
                          isSubmitted && errors.content
                            ? "border border-red-500"
                            : "border border-[#F3F3F3]"
                        }`}
                        placeholder="어떤 도움이 필요한지 자세히 적을수록 좋아요."
                        value={aiProjectData.description}
                        onChange={(e) =>
                          setAiProjectData({
                            ...aiProjectData,
                            description: e.target.value,
                          })
                        }
                      />
                      {isSubmitted && errors.content && (
                        <p className="text-red-500 text-xs text-left mt-1">
                          {errors.content}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* "상금" */}
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <label className="w-44 text-sm font-normal text-[#212121]">
                      상금<span className="text-[#2FD8F6]">*</span>
                    </label>
                    <div className="flex-grow flex flex-col">
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          className={`flex-grow rounded p-2 h-10 text-xs text-[#212121] placeholder:text-[#C3C3C3] ${
                            isSubmitted && errors.rewardAmount
                              ? "border border-red-500"
                              : "border border-[#F3F3F3]"
                          }`}
                          placeholder="공모전의 상금을 책정해 주세요."
                          value={aiProjectData.rewardAmount}
                          onChange={(e) =>
                            setAiProjectData({
                              ...aiProjectData,
                              rewardAmount: e.target.value,
                            })
                          }
                        />
                        <span className="flex-shrink-0 text-gray-500 text-xs">
                          원
                        </span>
                        {aiProjectData.rewardAmount && (
                          <div className="relative group">
                            {" "}
                            {}
                            <span className="flex-shrink-0 text-xs rounded-3xl text-[#2AC2DD] pt-2 pb-2 px-4 text-center bg-[#E0F9FE] hover:bg-[#2FD8F6] hover:text-[#FFFFFF]">
                              상금의 약 77%인{" "}
                              {(
                                parseInt(
                                  aiProjectData.rewardAmount.replace(/,/g, ""),
                                  10
                                ) * 0.77
                              ).toLocaleString()}
                              원만 내면 돼요.
                            </span>
                            <PrizeInfoModal />{" "}
                          </div>
                        )}
                      </div>
                      {isSubmitted && errors.rewardAmount && (
                        <p className="text-red-500 text-xs text-left mt-1">
                          {errors.rewardAmount}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                {/* "기간" */}
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <label className="w-44 text-sm font-normal text-[#212121]">
                      기간<span className="text-[#2FD8F6]">*</span>
                    </label>
                    <div className="flex-grow flex flex-col">
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          className={`w-full rounded p-2 h-10 text-xs text-[#212121] placeholder:text-[#C3C3C3] ${
                            isSubmitted && errors.period
                              ? "border border-red-500"
                              : "border border-[#F3F3F3]"
                          }`}
                          placeholder="2025.08.08"
                          value={aiProjectData.createdAt}
                          onChange={(e) =>
                            setAiProjectData({
                              ...aiProjectData,
                              createdAt: e.target.value,
                            })
                          }
                        />
                        <span>-</span>
                        <input
                          type="text"
                          className={`w-full rounded p-2 h-10 text-xs text-[#212121] placeholder:text-[#C3C3C3] ${
                            isSubmitted && errors.period
                              ? "border border-red-500"
                              : "border border-[#F3F3F3]"
                          }`}
                          placeholder="2025.08.08"
                          value={aiProjectData.deadline}
                          onChange={(e) =>
                            setAiProjectData({
                              ...aiProjectData,
                              deadline: e.target.value,
                            })
                          }
                        />
                      </div>
                      {isSubmitted && errors.period && (
                        <p className="text-red-500 text-xs text-left mt-1">
                          {errors.period}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* "한 줄 소개" */}
                <div className="flex items-center justify-between space-x-2">
                  <label className="w-44 text-sm font-normal text-[#212121]">
                    한 줄 소개
                  </label>
                  <input
                    type="text"
                    className="flex-grow border border-[#F3F3F3] rounded p-2 h-10 text-xs text-[#212121] placeholder:text-[#C3C3C3]"
                    placeholder="공모전의 한 줄 소개를 작성해 주세요."
                    value={aiProjectData.summary}
                    onChange={(e) =>
                      setAiProjectData({
                        ...aiProjectData,
                        summary: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </section>
            <h2 className="text-xl font-semibold mb-4 text-[#000000]">
              선호하는 스타일 선택
            </h2>
            <div className="w-auto h-[1px] bg-[#A3A3A3] mx-[-0.5rem]" />
            {/* Style Section */}
            <section className="my-10">
              <div className="space-y-7">
                {/* "색상" */}
                <div className="flex items-center justify-between space-x-2">
                  <label className="w-44 text-sm font-normal text-[#212121]">
                    색상
                  </label>
                  <div className="flex-grow">
                    <div className="grid grid-cols-3 gap-x-6 gap-y-2 justify-center">
                      {COLORS_DATA.map((c) => (
                        <button
                          key={c.code}
                          className={`w-full h-12 rounded transition flex items-center justify-center
                            ${
                              color === c.code
                                ? "border-2 border-[#212121]"
                                : "border border-[#F3F3F3]"
                            }
                            ${c.code === "color_free" ? "bg-white" : ""}`}
                          style={
                            c.code !== "color_free" ? { background: c.hex } : {}
                          }
                          onClick={() => setColor(c.code)}
                        >
                          {c.code === "color_free" && (
                            <span
                              className={`text-xs font-normal text-[#A3A3A3]`}
                            >
                              {c.label}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* "스타일" */}
                <div className="flex items-center justify-between space-x-2">
                  <label className="w-44 text-sm font-normal text-[#212121]">
                    스타일
                  </label>
                  <div className="flex-grow">
                    <div className="grid grid-cols-3 gap-x-6 gap-y-2 justify-center">
                      {STYLES_DATA.map((s) => (
                        <button
                          key={s.value}
                          className={`w-full py-4 text-xs rounded bg-white transition flex items-center justify-center ${
                            style === s.value
                              ? "border-2 border-[#212121]"
                              : "border border-[#F3F3F3]"
                          } ${
                            s.value === "style_free"
                              ? "text-[#A3A3A3]"
                              : "text-black"
                          }`}
                          onClick={() => setStyle(s.value)}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* "타겟" */}
                <div className="flex items-center justify-between space-x-2">
                  <label className="w-44 text-sm font-normal text-[#212121]">
                    타겟
                  </label>
                  <div className="flex-grow">
                    <div className="grid grid-cols-3 gap-x-6 gap-y-2 justify-center">
                      {TARGETS_DATA.map((t) => (
                        <button
                          key={t.value}
                          className={`w-full py-4 text-xs rounded bg-white transition flex items-center justify-center ${
                            target === t.value
                              ? "border-2 border-[#212121]"
                              : "border border-[#F3F3F3]"
                          } ${
                            t.value === "target_free"
                              ? "text-[#A3A3A3]"
                              : "text-black"
                          }`}
                          onClick={() => setTarget(t.value)}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <div className="flex flex-col">
              <h2 className="text-xl font-semibold text-[#000000]">
                공모전 등록 약관 동의
              </h2>
              <label className="text-xs text-[#828282] mb-4">
                공모전 등록을 위해 아래 내용을 꼭 확인해 주세요.
              </label>
            </div>
            <div className="w-auto h-[1px] bg-[#A3A3A3] mx-[-0.5rem]" />
            <section className="my-10">
              <div className="flex flex-col space-y-3 text-sm text-gray-600">
                <label className="flex items-center text-[#000000] gap-2">
                  {/* 커스텀 체크박스 */}
                  <div
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 cursor-pointer ${
                      agreeAll
                        ? "bg-[#2FD8F6] border-[#2FD8F6]"
                        : "bg-white border-[#E0E0E0]"
                    }`}
                    onClick={() =>
                      handleAgreeAllChange({ target: { checked: !agreeAll } })
                    }
                  >
                    {agreeAll && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-3 h-3"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </div>
                  약관 전체에 동의합니다.
                </label>
                <hr className="border border-gray-200" />
                <div className="space-y-3">
                  {/* 체크리스트 */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center text-[#000000] gap-2">
                      <div
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 cursor-pointer ${
                          agreeChecklist
                            ? "bg-[#2FD8F6] border-[#2FD8F6]"
                            : "bg-white border-[#E0E0E0]"
                        }`}
                        onClick={() => setAgreeChecklist(!agreeChecklist)}
                      >
                        {agreeChecklist && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-3 h-3"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        )}
                      </div>
                      (필수) 공모전 등록 체크리스트
                    </label>
                    <a
                      href="#"
                      className="text-sm text-[#A3A3A3] underline hover:text-[#828282]"
                      onClick={(e) => {
                        e.preventDefault();
                        handleOpenTermsModal("checklist");
                      }}
                    >
                      자세히 보기
                    </a>
                  </div>
                  {/* 이용 약관 */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center text-[#000000] gap-2">
                      <div
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 cursor-pointer ${
                          agreeTerms
                            ? "bg-[#2FD8F6] border-[#2FD8F6]"
                            : "bg-white border-[#E0E0E0]"
                        }`}
                        onClick={() => setAgreeTerms(!agreeTerms)}
                      >
                        {agreeTerms && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-3 h-3"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        )}
                      </div>
                      (필수) 공모전 이용 약관
                    </label>
                    <a
                      href="#"
                      className="text-sm text-[#A3A3A3] underline hover:text-[#828282]"
                      onClick={(e) => {
                        e.preventDefault();
                        handleOpenTermsModal("terms");
                      }}
                    >
                      자세히 보기
                    </a>
                  </div>
                  {/* 주의사항 */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center text-[#000000] gap-2">
                      <div
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 cursor-pointer ${
                          agreeCaution
                            ? "bg-[#2FD8F6] border-[#2FD8F6]"
                            : "bg-white border-[#E0E0E0]"
                        }`}
                        onClick={() => setAgreeCaution(!agreeCaution)}
                      >
                        {agreeCaution && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-3 h-3"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        )}
                      </div>
                      (필수) 공모전 이용 주의사항
                    </label>
                    <a
                      href="#"
                      className="text-sm text-[#A3A3A3] underline hover:text-[#828282]"
                      onClick={(e) => {
                        e.preventDefault();
                        handleOpenTermsModal("caution");
                      }}
                    >
                      자세히 보기
                    </a>
                  </div>
                </div>
              </div>
            </section>

            <div className="flex justify-center gap-4 pt-4">
              <button
                className="w-56 py-3 border border-[#2FD8F6] rounded-md transition hover:font-bold text-[#2FD8F6] font-medium"
                onClick={handleOpenPreviewModal}
              >
                미리보기
              </button>
              <button
                className={`w-56 py-3 rounded-md transition font-medium ${
                  isButtonActive
                    ? "bg-[#2FD8F6] text-white hover:font-bold"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                onClick={handleRegisterClick}
                disabled={!isButtonActive}
              >
                등록하기
              </button>
            </div>
          </div>
        </div>
      </div>
      <FooterRegister />

      {/* 모달 컴포넌트들 */}
      {isTermsModalOpen && (
        <TermsModal
          isOpen={isTermsModalOpen}
          title={modalTitle}
          content={modalContent}
          onClose={() => setIsTermsModalOpen(false)}
        />
      )}
      {isPreviewModalOpen && (
        <PreviewModal
          isOpen={isPreviewModalOpen}
          data={previewData}
          onClose={() => setIsPreviewModalOpen(false)}
        />
      )}
      {isConfirmModalOpen && (
        <ConfirmModal
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={handleConfirmSubmit}
        />
      )}
      {isEasyHelpModalOpen && (
        <EasyHelpModal onClose={() => setIsEasyHelpModalOpen(false)} />
      )}
      {isPrizeInfoModalOpen && (
        <PrizeInfoModal onClose={() => setIsPrizeInfoModalOpen(false)} />
      )}
      {isBackModalOpen && (
        <ConfirmBackModal
          onClose={() => setIsBackModalOpen(false)}
          onConfirm={handleConfirmBack}
        />
      )}
    </div>
  );
};

export default ProjectRegister;

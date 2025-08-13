import React, { useState, useEffect } from "react";
import { SlArrowUpCircle } from "react-icons/sl";

import MerchantHeader from "../header/MerchantHeader";
import Footer from "../components/Footer";
import TermsModal from "../modal/TermsModal";
import PreviewModal from "../modal/PreviewModal";
import ConfirmModal from "../modal/ConfirmModal";
import EasyHelpModal from "../modal/EasyHelpModal";

import axios from "axios";
const api = axios.create({
  baseURL: "http://13.209.41.51:8080/api/v1/",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// 약관 데이터 (Terms Data)
const TERMS_DATA = {
  checklist: {
    title: "공모전 등록 체크리스트",
    content: `
      공모전 등록 체크리스트 내용입니다.
      `,
  },
  terms: {
    title: "공모전 이용 약관",
    content: `
      공모전 이용 약관 내용입니다.
      `,
  },
  caution: {
    title: "공모전 이용 주의사항",
    content: `
      공모전 이용 주의사항 내용입니다.
      `,
  },
  easyhelp: {
    title: "쉽게 도움 받는 법",
    content: `
      AI 도움을 받는 방법에 대한 내용입니다.
      `,
  },
};

const ProjectRegister = () => {
  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeChecklist, setAgreeChecklist] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeCaution, setAgreeCaution] = useState(false);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");
  const [previewData, setPreviewData] = useState(null);
  const [isEasyHelpModalOpen, setIsEasyHelpModalOpen] = useState(false);

  // AI analysis-related states
  const [assistanceText, setAssistanceText] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState({
    prize: "",
    content: "",
    summary: "",
  });

  // 프로젝트 등록 폼 관련 상태
  const [projectTitle, setProjectTitle] = useState("");
  const [merchantName, setMerchantName] = useState("");
  const [category, setCategory] = useState("");
  const [businesstype, setBusinesstype] = useState("");
  const [color, setColor] = useState("");
  // style과 target 상태 초기값을 빈 문자열로 설정
  const [style, setStyle] = useState("");
  const [target, setTarget] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);

  // 기간 입력 필드에 사용할 상태 변수
  const [createdAt, setCreatedAt] = useState("");
  const [deadline, setDeadline] = useState("");

  // API에서 받아올 카테고리 및 업종 상태
  const [categories, setCategories] = useState([]);
  const [businesstypes, setBusinesstypes] = useState([]);

  // 에러 메시지 상태
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 이미지에 나타난 스타일 및 타겟 데이터
  const STYLES_DATA = [
    { value: "simple", label: "심플한" },
    { value: "modern", label: "모던한" },
    { value: "retro", label: "레트로" },
    { value: "cute", label: "귀여운" },
    { value: "luxurious", label: "고급스러운" },
    { value: "warm", label: "따뜻한" },
    { value: "bold", label: "강렬한" },
    { value: "natural", label: "자연스러운" },
    { value: "traditional", label: "전통적인" },
    { value: "trendy", label: "트렌디한" },
    { value: "emotional", label: "감성적인" },
    { value: "style_free", label: "스타일 자유" },
  ];

  const TARGETS_DATA = [
    { value: "all_ages", label: "전 연령층" },
    { value: "children_family", label: "어린이/가족" },
    { value: "teenagers", label: "청소년" },
    { value: "youth", label: "청년" },
    { value: "middle_aged", label: "중장년층" },
    { value: "elderly", label: "노년층" },
    { value: "tourist", label: "관광객" },
    { value: "office_worker", label: "직장인" },
    { value: "target_free", label: "타겟 자유" },
  ];

  // COLORS_DATA의 color_free에 '색상 자유' label 추가
  const COLORS_DATA = [
    {
      hex: "linear-gradient(to right, #FF91DC 0%, #FF00AE 100%)",
      code: "pink",
      label: "핑크",
    },
    {
      hex: "linear-gradient(to right, #9FFF98 0%, #4DF041 100%)",
      code: "green",
      label: "초록",
    },
    {
      hex: "linear-gradient(to right, #F0DB64 0%, #BFA200 100%)",
      code: "gold",
      label: "골드",
    },
    {
      hex: "linear-gradient(to right, #FF9E9E 0%, #FF0000 100%)",
      code: "red",
      label: "빨강",
    },
    {
      hex: "linear-gradient(to right, #85C6FF 0%, #0088FF 100%)",
      code: "blue",
      label: "파랑",
    },
    {
      hex: "linear-gradient(to right, #AA8F7E 0%, #6D3615 100%)",
      code: "brown",
      label: "브라운",
    },
    {
      hex: "linear-gradient(to right, #FFC096 0%, #FF6600 100%)",
      code: "orange",
      label: "주황",
    },
    {
      hex: "linear-gradient(to right, #858BD2 0%, #181F7A 100%)",
      code: "navy",
      label: "네이비",
    },
    {
      hex: "linear-gradient(to right, #868686 0%, #212121 100%)",
      code: "black",
      label: "블랙",
    },
    {
      hex: "linear-gradient(to right, #FFF1A2 0%, #FFD900 100%)",
      code: "yellow",
      label: "노랑",
    },
    {
      hex: "linear-gradient(to right, #BE7AFF 0%, #8400FF 100%)",
      code: "purple",
      label: "보라",
    },
    {
      code: "color_free",
      label: "색상 자유",
    },
  ];

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
        // api.js 인스턴스를 사용하여 GET 요청
        const categoriesResponse = await api.get("enums/categories");
        setCategories(categoriesResponse.data);

        const businessTypesResponse = await api.get("enums/businessTypes");
        setBusinesstypes(businessTypesResponse.data);
      } catch (error) {
        // 오류 처리 로직 추가
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
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
      const aiData = {
        created_at: "2024.08.01",
        deadline: "2024.09.30",
        prize: "총 상금 1000만원 (대상 500만원)",
        content:
          "새로운 로고 디자인 공모전입니다. 혁신적이고 창의적인 아이디어를 기다립니다.",
        summary: "새로운 로고를 위한 창의적인 디자인 공모전",
      };
      setAiResult({
        prize: aiData.prize,
        content: aiData.content,
        summary: aiData.summary,
      });
      setCreatedAt(aiData.created_at);
      setDeadline(aiData.deadline);
    } catch (error) {
      console.error("AI analysis error:", error);
      alert("AI 분석 중 오류가 발생했습니다. 다시 시도해 주세요.");
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
      createdAt,
      deadline,
      prize: aiResult.prize,
      content: aiResult.content,
      summary: aiResult.summary,
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

  // 제출 확인 핸들러 (유효성 검사 추가)
  const handleConfirmSubmit = () => {
    setIsSubmitted(true);

    const newErrors = {};
    if (!projectTitle)
      newErrors.projectTitle = "공모전 제목이 입력되지 않았습니다.";
    if (!merchantName) newErrors.merchantName = "가게명이 입력되지 않았습니다.";
    if (!category) newErrors.category = "카테고리가 선택되지 않았습니다.";
    if (!businesstype) newErrors.businesstype = "업종이 선택되지 않았습니다.";
    if (!aiResult.content) newErrors.content = "내용이 입력되지 않았습니다.";
    if (!aiResult.prize) newErrors.prize = "상금이 입력되지 않았습니다.";
    if (!createdAt || !deadline)
      newErrors.period = "기간이 입력되지 않았습니다.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("공모전 등록이 완료되었습니다.");
      setIsConfirmModalOpen(false);
    } else {
      console.log("필수 입력 필드가 비어있습니다.");
      setIsConfirmModalOpen(false);
    }
  };

  return (
    <div className="flex flex-col">
      <MerchantHeader />
      <div className="bg-[#F8F8F8] flex justify-center py-12 px-4">
        <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-[1032px] min-h-[2408px]">
          <div className="max-w-2xl mx-auto mt-12">
            {/* Title Section */}
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
            {/* Basic Info Section */}
            <section className="my-10">
              <div className="space-y-7">
                {/* ProjectFormInput for "공모전 제목" */}
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center justify-between space-x-2">
                    <label className="w-44 text-sm font-normal text-[#212121]">
                      공모전 제목<span className="text-[#2FD8F6]">*</span>
                    </label>
                    <input
                      type="text"
                      className="flex-grow border border-[#F3F3F3] rounded p-2 h-10 text-xs text-[#212121] placeholder:text-gray-400"
                      placeholder="공모전 제목을 지어주세요."
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                    />
                  </div>
                  {isSubmitted && errors.projectTitle && (
                    <p className="text-red-500 text-xs text-right mt-1">
                      {errors.projectTitle}
                    </p>
                  )}
                </div>
                {/* ProjectFormInput for "가게명" */}
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center justify-between space-x-2">
                    <label className="w-44 text-sm font-normal text-[#212121]">
                      가게명<span className="text-[#2FD8F6]">*</span>
                    </label>
                    <input
                      type="text"
                      className="flex-grow border border-[#F3F3F3] rounded p-2 h-10 text-xs text-[#212121] placeholder:text-gray-400"
                      placeholder="정확한 가게명(상호명)을 입력해 주세요."
                      value={merchantName}
                      onChange={(e) => setMerchantName(e.target.value)}
                    />
                  </div>
                  {isSubmitted && errors.merchantName && (
                    <p className="text-red-500 text-xs text-right mt-1">
                      {errors.merchantName}
                    </p>
                  )}
                </div>
                {/* ProjectFormInput for "카테고리" */}
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center justify-between space-x-2">
                    <label className="w-44 text-sm font-normal text-[#212121]">
                      카테고리<span className="text-[#2FD8F6]">*</span>
                    </label>
                    <select
                      className="flex-grow border border-[#F3F3F3] rounded p-2 h-10 text-xs text-[#212121] bg-white"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option className="" value="" disabled>
                        공모전의 카테고리를 선택해 주세요
                      </option>
                      {categories.map((cat) => (
                        <option key={cat.code} value={cat.code}>
                          {cat.description}
                        </option>
                      ))}
                    </select>
                  </div>
                  {isSubmitted && errors.category && (
                    <p className="text-red-500 text-xs text-right mt-1">
                      {errors.category}
                    </p>
                  )}
                </div>
                {/* ProjectFormInput for "업종" */}
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center justify-between space-x-2">
                    <label className="w-44 text-sm font-normal text-[#212121]">
                      업종<span className="text-[#2FD8F6]">*</span>
                    </label>
                    <select
                      className="flex-grow border border-[#F3F3F3] rounded p-2 h-10 text-xs text-[#212121] bg-white"
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
                  </div>
                  {isSubmitted && errors.businesstype && (
                    <p className="text-red-500 text-xs text-right mt-1">
                      {errors.businesstype}
                    </p>
                  )}
                </div>
              </div>
            </section>

            <h2 className="text-xl font-semibold mb-2 text-[#000000]">
              공모전 내용 입력
            </h2>
            <div className="w-auto h-[1px] bg-[#A3A3A3] mx-[-0.5rem]" />

            {/* Contest Content Section */}
            <section className="my-10">
              <div className="space-y-7">
                <div className="flex items-start space-x-2">
                  <div className="group w-44 flex flex-col space-y-1 justify-center items-center pr-7 relative">
                    <label className="text-sm font-normal text-[#212121] pt-2">
                      AI로 공모전 쉽게 작성하기
                    </label>
                    <a
                      href="#"
                      className="w-40 text-xs rounded-3xl text-[#FFFFFF] pt-2 pb-2 text-center bg-[#2FD8F6]"
                      onClick={(e) => {
                        e.preventDefault(); // 링크 이동 방지
                      }}
                    >
                      Tip. 도움받는 법 알아보기
                    </a>
                    {/* EasyHelpModal 컴포넌트를 렌더링합니다 */}
                    <EasyHelpModal />
                  </div>

                  <div className="flex-grow justify-between relative">
                    <textarea
                      className="w-full border border-[#F3F3F3] rounded p-2 h-24 text-xs text-[#212121] placeholder:text-gray-400 pr-10"
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
                  <p className="text-center text-gray-500">
                    AI가 내용을 분석 중입니다...
                  </p>
                )}
                {/* Textarea for "내용" */}
                <div className="flex flex-col space-y-1">
                  <div className="flex items-start justify-between space-x-2">
                    <label className="w-44 text-sm font-normal text-[#212121] pt-2">
                      내용<span className="text-[#2FD8F6]">*</span>
                    </label>
                    <textarea
                      className="flex-grow border border-[#F3F3F3] rounded p-2 h-24 text-xs text-[#212121] placeholder:text-gray-400"
                      placeholder="어떤 도움이 필요한지 자세히 적을수록 좋아요."
                      value={aiResult.content}
                      onChange={(e) =>
                        setAiResult({ ...aiResult, content: e.target.value })
                      }
                    />
                  </div>
                  {isSubmitted && errors.content && (
                    <p className="text-red-500 text-xs text-right mt-1">
                      {errors.content}
                    </p>
                  )}
                </div>
                {/* ProjectFormInput for "상금" */}
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <label className="w-44 text-sm font-normal text-[#212121]">
                      상금<span className="text-[#2FD8F6]">*</span>
                    </label>
                    <div className="flex items-center space-x-2 w-[247px]">
                      <input
                        type="text"
                        className="flex-grow border border-[#F3F3F3] rounded p-2 h-10 text-xs text-[#212121] placeholder:text-gray-400"
                        placeholder="공모전의 상금을 책정해 주세요."
                        value={aiResult.prize}
                        onChange={(e) =>
                          setAiResult({ ...aiResult, prize: e.target.value })
                        }
                      />
                      <span className="text-gray-500 text-xs">원</span>
                    </div>
                  </div>
                  {isSubmitted && errors.prize && (
                    <p className="text-red-500 text-xs text-right mt-1">
                      {errors.prize}
                    </p>
                  )}
                </div>
                {/* ProjectFormInput for "기간" */}
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <label className="w-44 text-sm font-normal text-[#212121]">
                      기간<span className="text-[#2FD8F6]">*</span>
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        className="flex-grow border border-[#F3F3F3] rounded p-2 h-10 text-xs text-[#212121] placeholder:text-gray-400"
                        placeholder="2025.08.08"
                        value={createdAt}
                        onChange={(e) => setCreatedAt(e.target.value)}
                      />
                      <span>-</span>
                      <input
                        type="text"
                        className="flex-grow border border-[#F3F3F3] rounded p-2 h-10 text-xs text-[#212121] placeholder:text-gray-400"
                        placeholder="2025.08.08"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                      />
                    </div>
                  </div>
                  {isSubmitted && errors.period && (
                    <p className="text-red-500 text-xs text-right mt-1">
                      {errors.period}
                    </p>
                  )}
                </div>

                {/* ProjectFormInput for "한 줄 소개" */}
                <div className="flex items-center justify-between space-x-2">
                  <label className="w-44 text-sm font-normal text-[#212121]">
                    한 줄 소개
                  </label>
                  <input
                    type="text"
                    className="flex-grow border border-[#F3F3F3] rounded p-2 h-10 text-xs text-[#212121] placeholder:text-gray-400"
                    placeholder="공모전의 한 줄 소개를 작성해 주세요."
                    value={aiResult.summary}
                    onChange={(e) =>
                      setAiResult({ ...aiResult, summary: e.target.value })
                    }
                  />
                </div>
                {/* Image Upload Input */}
                <div className="flex items-center space-x-2 justify-between">
                  <label className="w-44 text-sm font-medium text-[#000000]">
                    이미지 첨부하기
                  </label>
                  <div className="flex-grow flex items-center space-x-2">
                    <label
                      htmlFor="file-upload"
                      className="flex-grow cursor-pointer p-2 h-10 border border-[#F3F3F3] rounded bg-[#F3F3F3] text-xs text-gray-500 hover:bg-gray-50 placeholder:text-gray-400"
                    ></label>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      onChange={(e) => setUploadedImage(e.target.files[0])}
                    />
                    {uploadedImage && (
                      <span className="text-xs text-gray-600">
                        {uploadedImage.name}
                      </span>
                    )}
                  </div>
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
                              className={`text-xs font-normal text-gray-400`}
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
                              ? "text-gray-200"
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
                              ? "text-gray-200"
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

            {/* Terms Agreement Section */}
            <section className="my-10">
              <div className="flex flex-col space-y-3 text-sm text-gray-600">
                <label className="flex items-center text-[#000000] gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-[#000000] rounded"
                    checked={agreeAll}
                    onChange={handleAgreeAllChange}
                  />
                  약관 전체에 동의합니다.
                </label>
                <hr className="border border-gray-200" />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center text-[#000000] gap-2">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-[#000000] rounded"
                        checked={agreeChecklist}
                        onChange={(e) => setAgreeChecklist(e.target.checked)}
                      />
                      (필수) 공모전 등록 체크리스트
                    </label>
                    <a
                      href="#"
                      className="text-sm text-[#A3A3A3] underline hover:text-[#828282]"
                      onClick={() => handleOpenTermsModal("checklist")}
                    >
                      자세히 보기
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center text-[#000000] gap-2">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-[#000000] rounded"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                      />
                      (필수) 공모전 이용 약관
                    </label>
                    <a
                      href="#"
                      className="text-sm text-[#A3A3A3] underline hover:text-[#828282]"
                      onClick={() => handleOpenTermsModal("terms")}
                    >
                      자세히 보기
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center text-[#000000] gap-2">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-[#000000] rounded"
                        checked={agreeCaution}
                        onChange={(e) => setAgreeCaution(e.target.checked)}
                      />
                      (필수) 공모전 이용 주의사항
                    </label>
                    <a
                      href="#"
                      className="text-sm text-[#A3A3A3] underline hover:text-[#828282]"
                      onClick={() => handleOpenTermsModal("caution")}
                    >
                      자세히 보기
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* Button Section */}
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
                onClick={handleOpenConfirmModal}
                disabled={!isButtonActive}
              >
                공모전 등록하기
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Modal Components */}
      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        title={modalTitle}
        content={modalContent}
      />
      <PreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        data={previewData}
      />
      {/* ConfirmModal에 props 전달 */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmSubmit}
      />
    </div>
  );
};

export default ProjectRegister;

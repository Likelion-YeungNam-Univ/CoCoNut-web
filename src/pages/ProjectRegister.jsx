import React, { useState, useEffect, useRef } from "react";
import { SlArrowUpCircle } from "react-icons/sl";
import { useNavigate } from "react-router-dom";

// API 함수들
import { analyzeProjectWithAI } from "../apis/analyzeWithAI";
import { registerProject } from "../apis/registerProject";
import { fetchCategories } from "../apis/category";
import { getBusinessTypes } from "../apis/businessTypes";
import fetchUserNickname from "../apis/fetchUserNickname";

// 컴포넌트들
import MerchantHeader from "../header/MerchantHeader";
import CustomDropdown from "../components/CustomDropdown";
import TermsModal from "../components/TermsModal";
import PreviewModal from "../components/PreviewModal";
import ConfirmModal from "../components/ConfirmModal";
import EasyHelpModal from "../components/EasyHelpModal";
import ConfirmBackModal from "../components/ConfirmBackModal";
import PrizeInfoModal from "../components/PrizeInfoModal";
import FooterRegister from "../components/FooterRegister";

// 상수 데이터
import { TERMS_DATA } from "../utils/termsData";
import { STYLES_DATA } from "../utils/stylesData";
import { TARGETS_DATA } from "../utils/targetData";
import { COLORS_DATA } from "../utils/colorData";

const ProjectRegister = () => {
  const navigate = useNavigate();

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
  const [userName, setUserName] = useState("");
  const [category, setCategory] = useState("");
  const [businesstype, setBusinesstype] = useState("");

  // 색상, 스타일, 타겟을 여러 개 선택 가능하도록 상태를 배열로 변경
  const [colors, setColors] = useState([]);
  const [styles, setStyles] = useState([]);
  const [targets, setTargets] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);

  // ✨ 참여작 개수 상태 추가
  const [submissionsCount, setSubmissionsCount] = useState(0);

  // API에서 받아올 카테고리, 업종, 닉네임
  const [categories, setCategories] = useState([]);
  const [businesstypes, setBusinesstypes] = useState([]);

  // 에러 메시지 상태
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // ✅ 폼 내용이 변경되었는지 추적하는 상태 및 Ref
  const [isFormDirty, setIsFormDirty] = useState(false);
  const isFormDirtyRef = useRef(false); // 폼 변경 상태를 추적하는 Ref
  const isBackModalOpenRef = useRef(false); // 모달 상태를 추적하는 Ref
  const initialFormState = useRef({
    projectTitle: "",
    userName: "",
    category: "",
    businesstype: "",
    description: "",
    rewardAmount: "",
    createdAt: "",
    deadline: "",
  });

  // API 데이터 로딩 상태
  const [isLoading, setIsLoading] = useState(true);

  // ✅ 유효성 검사 로직을 별도 함수로 분리
  const validateForm = () => {
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
    return newErrors;
  };

  useEffect(() => {
    if (agreeChecklist && agreeTerms && agreeCaution) {
      setIsButtonActive(true);
    } else {
      setIsButtonActive(false);
    }
  }, [agreeChecklist, agreeTerms, agreeCaution]);

  useEffect(() => {
    console.log("isConfirmModalOpen 상태 변경:", isConfirmModalOpen);
  }, [isConfirmModalOpen]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
        const businesstypesData = await getBusinessTypes();
        setBusinesstypes(businesstypesData);
        const userNickname = await fetchUserNickname();
        if (userNickname) {
          setUserName(userNickname);
          initialFormState.current.userName = userNickname;
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ 폼 변경 상태를 isFormDirtyRef에 업데이트하는 useEffect (기존 코드 유지)
  useEffect(() => {
    const currentFormState = {
      projectTitle,
      userName,
      category,
      businesstype,
      description: aiProjectData.description,
      rewardAmount: aiProjectData.rewardAmount,
      createdAt: aiProjectData.createdAt,
      deadline: aiProjectData.deadline,
    };
    const isAnyFieldChanged = Object.keys(currentFormState).some(
      (key) => currentFormState[key] !== initialFormState.current[key]
    );
    setIsFormDirty(isAnyFieldChanged);
    isFormDirtyRef.current = isAnyFieldChanged; // Ref에 최신 상태 저장
  }, [projectTitle, userName, category, businesstype, aiProjectData]);

  // ✅ 뒤로가기 모달을 위한 useEffect
  useEffect(() => {
    // 폼이 변경될 때만 히스토리 스택에 가상의 항목을 추가합니다.
    if (isFormDirty) {
      window.history.pushState(null, "", window.location.href);
    }

    const handlePopstate = (e) => {
      // 폼이 변경된 상태에서 뒤로가기 이벤트가 발생하면 모달을 띄웁니다.
      if (isFormDirtyRef.current) {
        setIsBackModalOpen(true);
      } else {
        // 폼이 변경되지 않았으면 기본 뒤로가기 동작을 수행합니다.
        navigate(-1);
      }
    };

    window.addEventListener("popstate", handlePopstate);
    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, [isFormDirty]);

  // 모달이 열릴 때 body에 클래스 추가, 닫힐 때 제거
  useEffect(() => {
    if (isBackModalOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
  }, [isBackModalOpen]);

  const handleAgreeAllChange = (e) => {
    const isChecked = e.target.checked;
    setAgreeAll(isChecked);
    setAgreeChecklist(isChecked);
    setAgreeTerms(isChecked);
    setAgreeCaution(isChecked);
  };

  const handleOpenTermsModal = (termType) => {
    const data = TERMS_DATA[termType];
    if (data) {
      setModalTitle(data.title);
      setModalContent(data.content);
      setIsTermsModalOpen(true);
    }
  };

  const analyzeWithAI = async () => {
    setLoading(true);
    try {
      const aiData = await analyzeProjectWithAI(assistanceText);
      setAiProjectData({
        rewardAmount: aiData.rewardAmount,
        description: aiData.description,
        summary: aiData.summary,
        createdAt: aiData.createdAt,
        deadline: aiData.deadline,
      });
    } catch (error) {
      console.error("AI analysis error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleColorClick = (code) => {
    if (code === "color_free") {
      setColors((prev) => (prev.includes("color_free") ? [] : ["color_free"]));
    } else {
      setColors((prev) => {
        if (prev.includes("color_free")) {
          return [code];
        }
        if (prev.includes(code)) {
          return prev.filter((c) => c !== code);
        } else {
          return [...prev, code];
        }
      });
    }
  };

  const handleStyleClick = (value) => {
    if (value === "style_free") {
      setStyles((prev) => (prev.includes("style_free") ? [] : ["style_free"]));
    } else {
      setStyles((prev) => {
        if (prev.includes("style_free")) {
          return [value];
        }
        if (prev.includes(value)) {
          return prev.filter((s) => s !== value);
        } else {
          return [...prev, value];
        }
      });
    }
  };

  const handleTargetClick = (value) => {
    if (value === "target_free") {
      setTargets((prev) =>
        prev.includes("target_free") ? [] : ["target_free"]
      );
    } else {
      setTargets((prev) => {
        if (prev.includes("target_free")) {
          return [value];
        }
        if (prev.includes(value)) {
          return prev.filter((t) => t !== value);
        } else {
          return [...prev, value];
        }
      });
    }
  };

  // ✅ 유효성 검사 로직을 분리하여 간소화된 미리보기 핸들러
  const handleOpenPreviewModal = () => {
    setIsSubmitted(true);
    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
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
        color: colors,
        style: styles,
        target: targets,
        image: uploadedImage ? URL.createObjectURL(uploadedImage) : null,
        writerNickname: userName,
        submissionsCount: submissionsCount,
      };
      setPreviewData(data);
      setIsPreviewModalOpen(true);
    }
  };

  const handleConfirmSubmit = async () => {
    // 1. FormData 대신 JavaScript 객체(JSON) 생성
    const projectData = {
      title: projectTitle,
      merchantName: merchantName,
      category: category,
      businessType: businesstype,
      description: aiProjectData.description,

      deadline: aiProjectData.deadline,
      rewardAmount: parseInt(aiProjectData.rewardAmount.replace(/,/g, ""), 10),

      summary: aiProjectData.summary,
      colors: colors.length > 0 && !colors.includes("color_free") ? colors : [],
      styles: styles.length > 0 && !styles.includes("style_free") ? styles : [],
      targets:
        targets.length > 0 && !targets.includes("target_free") ? targets : [],
      // ✅ 이미지 파일은 FormData를 사용해야 하므로, 이 API로는 직접 보낼 수 없습니다.
      // 백엔드에 이미지 파일 업로드용 별도 API가 있는지 확인해야 합니다.
    };

    try {
      // 2. Axios 요청 시 JSON 객체를 직접 전달
      const response = await registerProject(projectData);
      console.log("공모전 등록 완료:", response);

      setIsConfirmModalOpen(false);
      setIsFormDirty(false);
      navigate("/project-detail");
    } catch (error) {
      console.error("Failed to register project:", error);
      setIsConfirmModalOpen(false);
    }
  };
  // ✅ 유효성 검사 로직을 분리하여 간소화된 등록 핸들러
  const handleRegisterClick = () => {
    setIsSubmitted(true);
    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0 && isButtonActive) {
      setModalTitle("등록 확인");
      setModalContent("입력하신 내용으로 공모전을 등록하시겠습니까?");
      setIsConfirmModalOpen(true);
    }
  };

  // ✅ 변경된 뒤로가기 모달 핸들러
  const handleConfirmBack = () => {
    setIsBackModalOpen(false); // 모달 닫기
    setIsFormDirty(false); // 폼 상태 초기화
    navigate(-1); // 이전 페이지로 이동
  };
  return (
    <div className="flex flex-col">
      <MerchantHeader />
      <div className="bg-[#F8F8F8] flex justify-center py-12 px-4">
        <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-[1032px] min-h-[2408px]">
          <div className="max-w-2xl mx-auto mt-12">
            <section className="flex flex-col mb-12 items-center">
              <h1 className="text-3xl font-pretendard font-semibold mb-3 text-[#000000]">
                공모전 등록하기
              </h1>
              <p className="text-sm font-pretendard text-[#828282]">
                필요한 홍보물, 메뉴판 등 어떤 요청이든 쉽게 등록하세요.
              </p>
              <p className="text-sm font-pretendard text-[#828282]">
                마음에 드는 수상작을 직접 선택할 수 있습니다.
              </p>
            </section>
            <div className="flex justify-between">
              <h1 className="text-xl font-pretendard font-semibold text-[#000000] mb-2">
                기본정보 입력
              </h1>
              <label className="text-sm font-normal text-[#626262]">
                <span className="font-pretendard text-[#2FD8F6]">*</span>
                필수입력
              </label>
            </div>
            <div className="w-auto h-[1px] bg-[#A3A3A3] mx-[-0.5rem]" />

            <section className="my-10">
              <div className="space-y-7">
                {/* "공모전 제목" */}
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <label className="w-44 text-sm font-pretendard font-normal text-[#212121]">
                      공모전 제목<span className="text-[#2FD8F6]">*</span>
                    </label>
                    <div className="flex-grow flex flex-col">
                      <input
                        type="text"
                        className={`w-full rounded p-2 h-10 text-xs font-pretendard text-[#212121] placeholder:text-[#C3C3C3] ${
                          isSubmitted && errors.projectTitle
                            ? "border border-red-500"
                            : "border border-[#F3F3F3]"
                        }`}
                        placeholder="공모전 제목을 지어주세요."
                        value={projectTitle}
                        onChange={(e) => {
                          setProjectTitle(e.target.value);
                          if (isSubmitted) {
                            setErrors((prev) => ({
                              ...prev,
                              projectTitle: "",
                            }));
                          }
                        }}
                      />
                      {isSubmitted && errors.projectTitle && (
                        <p className="text-red-500 text-xs font-pretendard text-left mt-1">
                          {errors.projectTitle}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                {/* "가게명" */}
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <label className="w-44 text-sm font-pretendard font-normal text-[#212121]">
                      가게명<span className="text-[#2FD8F6]">*</span>
                    </label>
                    <div className="flex-grow flex flex-col">
                      <input
                        type="text"
                        className={`w-full rounded p-2 h-10 text-xs font-pretendard text-[#212121] placeholder:text-[#C3C3C3] ${
                          isSubmitted && errors.merchantName
                            ? "border border-red-500"
                            : "border border-[#F3F3F3]"
                        }`}
                        placeholder="정확한 가게명(상호명)을 입력해 주세요."
                        value={merchantName}
                        onChange={(e) => {
                          setMerchantName(e.target.value);
                          if (isSubmitted) {
                            setErrors((prev) => ({
                              ...prev,
                              merchantName: "",
                            }));
                          }
                        }}
                      />
                      {isSubmitted && errors.merchantName && (
                        <p className="text-red-500  text-xs font-pretendard text-left mt-1">
                          {errors.merchantName}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                {/* "카테고리" */}
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <label className="w-44 text-sm font-pretendard font-normal text-[#212121]">
                      카테고리<span className="text-[#2FD8F6]">*</span>
                    </label>
                    <div className="flex-grow flex flex-col">
                      <CustomDropdown
                        label="공모전의 카테고리를 선택해 주세요"
                        options={categories}
                        selected={category}
                        onSelect={(value) => {
                          setCategory(value);
                          if (isSubmitted) {
                            setErrors((prev) => ({ ...prev, category: "" }));
                          }
                        }}
                        error={errors.category}
                        isSubmitted={isSubmitted}
                      />
                      {isSubmitted && errors.category && (
                        <p className="text-red-500 text-xs font-pretendard text-left mt-1">
                          {errors.category}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                {/* "업종" */}
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <label className="w-44 text-sm font-pretendard font-normal text-[#212121]">
                      업종<span className="text-[#2FD8F6]">*</span>
                    </label>
                    <div className="flex-grow flex flex-col">
                      <CustomDropdown
                        label="가게(상호)의 업종을 선택해 주세요"
                        options={businesstypes}
                        selected={businesstype}
                        onSelect={(value) => {
                          setBusinesstype(value);
                          if (isSubmitted) {
                            setErrors((prev) => ({
                              ...prev,
                              businesstype: "",
                            }));
                          }
                        }}
                        error={errors.businesstype}
                        isSubmitted={isSubmitted}
                      />
                      {isSubmitted && errors.businesstype && (
                        <p className="text-red-500 text-xs font-pretendard text-left mt-1">
                          {errors.businesstype}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <h2 className="text-xl font-pretendard font-semibold mb-2 text-[#000000]">
              공모전 내용 입력
            </h2>
            <div className="w-auto h-[1px] bg-[#A3A3A3] mx-[-0.5rem]" />

            <section className="my-10">
              <div className="space-y-7">
                <div className="flex items-start space-x-2">
                  <div className="group w-44 flex flex-col space-y-1 justify-center items-center pr-7 relative">
                    <label className="text-sm font-pretendard font-normal text-[#212121] pt-2">
                      AI로 공모전 쉽게 작성하기
                    </label>
                    <a
                      href="#"
                      className="w-40 text-xs rounded-3xl text-[#2AC2DD] font-pretendard pt-2 pb-2 text-center bg-[#E0F9FE] hover:bg-[#2FD8F6] hover:text-[#FFFFFF]"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      Tip. 도움받는 법 알아보기
                    </a>

                    <EasyHelpModal />
                  </div>

                  <div className="flex-grow justify-between relative">
                    <textarea
                      className="w-full border border-[#F3F3F3] rounded p-2 h-24 text-xs font-pretendard text-[#212121] placeholder:text-[#C3C3C3] pr-10"
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
                    <p className="text-white font-pretendard text-lg text-center">
                      AI가 내용을 불러오는 중이에요...
                    </p>
                  </div>
                )}
                {/* "내용" */}
                <div className="flex flex-col space-y-1">
                  <div className="flex items-start space-x-2">
                    <label className="w-44 text-sm font-pretendard font-normal text-[#212121] pt-2">
                      내용<span className="text-[#2FD8F6]">*</span>
                    </label>
                    <div className="flex-grow flex flex-col">
                      {" "}
                      <textarea
                        className={`w-full border border-[#F3F3F3] rounded p-2 h-24 text-xs font-pretendard text-[#212121] placeholder:text-[#C3C3C3] pr-10 ${
                          isSubmitted && errors.content
                            ? "border border-red-500"
                            : "border border-[#F3F3F3]"
                        }`}
                        placeholder="어떤 도움이 필요한지 자세히 적을수록 좋아요."
                        value={aiProjectData.description}
                        onChange={(e) => {
                          setAiProjectData({
                            ...aiProjectData,
                            description: e.target.value,
                          });
                          if (isSubmitted) {
                            setErrors((prev) => ({ ...prev, content: "" }));
                          }
                        }}
                      />
                      {isSubmitted && errors.content && (
                        <p className="text-red-500 text-xs font-pretendard text-left mt-1">
                          {errors.content}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                {/* "상금" */}
                <div className="flex-grow flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <label className="w-44 text-sm font-pretendard font-normal text-[#212121]">
                      상금<span className="text-[#2FD8F6]">*</span>
                    </label>
                    <div className="flex-grow flex items-center space-x-2">
                      <div className="w-[231px] flex flex-col space-y-1">
                        {" "}
                        {/* ✅ Flexbox 방향을 column으로 변경 */}
                        <div className="flex items-center space-x-2">
                          {" "}
                          {/* ✅ 기존 Input 필드를 감싸는 div 추가 */}
                          <input
                            type="text"
                            className={`rounded p-2 h-10 text-xs font-pretendard text-[#212121] placeholder:text-[#C3C3C3] flex-grow ${
                              isSubmitted && errors.rewardAmount
                                ? "border border-red-500"
                                : "border border-[#F3F3F3]"
                            }`}
                            placeholder="공모전의 상금을 책정해 주세요."
                            value={aiProjectData.rewardAmount}
                            onChange={(e) => {
                              setAiProjectData({
                                ...aiProjectData,
                                rewardAmount: e.target.value,
                              });
                              if (isSubmitted) {
                                setErrors((prev) => ({
                                  ...prev,
                                  rewardAmount: "",
                                }));
                              }
                            }}
                          />
                          <span className="flex-shrink-0 text-gray-500 text-xs font-pretendard">
                            원
                          </span>
                        </div>
                        {/* ✅ 에러 메시지 렌더링 로직 추가 */}
                        {isSubmitted && errors.rewardAmount && (
                          <p className="text-red-500 text-xs font-pretendard text-left mt-1">
                            {errors.rewardAmount}
                          </p>
                        )}
                      </div>
                      {aiProjectData.rewardAmount && (
                        <div className="relative group flex items-center">
                          <span
                            className="flex-shrink-0 rounded-3xl text-[#2AC2DD] font-pretendard pt-2 pb-2 px-4 text-center bg-[#E0F9FE] hover:bg-[#2FD8F6] hover:text-[#FFFFFF] max-w-[300px] overflow-hidden whitespace-nowrap overflow-ellipsis"
                            style={{
                              fontSize:
                                (
                                  parseInt(
                                    aiProjectData.rewardAmount.replace(
                                      /,/g,
                                      ""
                                    ),
                                    10
                                  ) * 0.77
                                ).toLocaleString().length > 15
                                  ? "8px"
                                  : "12px",
                            }}
                          >
                            상금의 약 77%인{" "}
                            {(
                              parseInt(
                                aiProjectData.rewardAmount.replace(/,/g, ""),
                                10
                              ) * 0.77
                            ).toLocaleString()}
                            원만 내면 돼요.
                          </span>
                          <PrizeInfoModal />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* "기간" */}
                <div className="flex-grow flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <label className="w-44 text-sm font-pretendard font-normal text-[#212121]">
                      기간<span className="text-[#2FD8F6]">*</span>
                    </label>
                    <div className="flex-grow flex flex-col">
                      <div className="flex items-center space-x-4">
                        <input
                          type="text"
                          className={`w-[87px] rounded p-2 h-10 text-xs font-pretendard text-[#212121] placeholder:text-[#C3C3C3] ${
                            isSubmitted && errors.period
                              ? "border border-red-500"
                              : "border border-[#F3F3F3]"
                          }`}
                          placeholder="2025.08.08"
                          value={aiProjectData.createdAt}
                          onChange={(e) => {
                            setAiProjectData({
                              ...aiProjectData,
                              createdAt: e.target.value,
                            });
                            if (isSubmitted) {
                              setErrors((prev) => ({ ...prev, period: "" }));
                            }
                          }}
                        />
                        <span>-</span>
                        <input
                          type="text"
                          className={`w-[87px] rounded p-2 h-10 text-xs font-pretendard text-[#212121] placeholder:text-[#C3C3C3] ${
                            isSubmitted && errors.period
                              ? "border border-red-500"
                              : "border border-[#F3F3F3]"
                          }`}
                          placeholder="2025.08.08"
                          value={aiProjectData.deadline}
                          onChange={(e) => {
                            setAiProjectData({
                              ...aiProjectData,
                              deadline: e.target.value,
                            });
                            if (isSubmitted) {
                              setErrors((prev) => ({ ...prev, period: "" }));
                            }
                          }}
                        />
                      </div>
                      {isSubmitted && errors.period && (
                        <p className="text-red-500 text-xs font-pretendard text-left mt-1">
                          {errors.period}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-7">
                  {/* "한 줄 소개" */}
                  <div className="flex items-center justify-between space-x-2">
                    <label className="w-44 text-sm font-pretendard font-normal text-[#212121]">
                      한 줄 소개
                    </label>
                    <input
                      type="text"
                      className="flex-grow border border-[#F3F3F3] rounded p-2 h-10 text-xs font-pretendard text-[#212121] placeholder:text-[#C3C3C3]"
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

                  {/* 이미지 첨부하기 */}
                  <div className="flex items-center justify-between space-x-2">
                    <label className="w-44 text-sm font-pretendard font-normal text-[#212121]">
                      이미지 첨부하기
                    </label>
                    <div className="flex-grow">
                      <label
                        htmlFor="image-upload"
                        className={`flex-grow border border-[#F3F3F3] rounded p-2 h-10 text-xs font-pretendard ${
                          uploadedImage ? "text-[#212121]" : "text-[#C3C3C3]"
                        } cursor-pointer flex items-center bg-[#F3F3F3]`}
                      >
                        {uploadedImage
                          ? uploadedImage.name
                          : "클릭하여 파일을 첨부하거나 드래그하세요."}
                      </label>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          setUploadedImage(
                            e.target.files && e.target.files.length > 0
                              ? e.target.files[0]
                              : null
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <h2 className="text-xl font-pretendard font-semibold mb-4 text-[#000000]">
              선호하는 스타일 선택
            </h2>
            <div className="w-auto h-[1px] bg-[#A3A3A3] mx-[-0.5rem]" />
            {/* Style Section */}
            <section className="my-10">
              <div className="space-y-7">
                {/* "색상" */}
                <div className="flex items-center justify-between space-x-2">
                  <label className="w-44 text-sm font-pretendard font-normal text-[#212121]">
                    색상
                  </label>
                  <div className="flex-grow">
                    <div className="grid grid-cols-3 gap-x-6 gap-y-2 justify-center">
                      {COLORS_DATA.map((c) => (
                        <button
                          key={c.code}
                          className={`w-full h-12 rounded transition flex items-center justify-center
                            ${
                              // 선택된 색상이 배열에 포함되어 있는지 확인
                              colors.includes(c.code)
                                ? "border-2 border-[#212121]"
                                : "border border-[#F3F3F3]"
                            }
                            ${c.code === "color_free" ? "bg-white" : ""}`}
                          style={
                            c.code !== "color_free" ? { background: c.hex } : {}
                          }
                          onClick={() => handleColorClick(c.code)}
                        >
                          {c.code === "color_free" && (
                            <span
                              className={`text-xs font-pretendard font-normal text-[#A3A3A3]`}
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
                  <label className="w-44 text-sm font-pretendard font-normal text-[#212121]">
                    스타일
                  </label>
                  <div className="flex-grow">
                    <div className="grid grid-cols-3 gap-x-6 gap-y-2 justify-center">
                      {STYLES_DATA.map((s) => (
                        <button
                          key={s.value}
                          className={`w-full py-4 text-xs font-pretendard rounded bg-white transition flex items-center justify-center ${
                            // 선택된 스타일이 배열에 포함되어 있는지 확인
                            styles.includes(s.value)
                              ? "border-2 border-[#212121]"
                              : "border border-[#F3F3F3]"
                          } ${
                            s.value === "style_free"
                              ? "font-pretendard text-[#A3A3A3]"
                              : "font-pretendard text-black"
                          }`}
                          onClick={() => handleStyleClick(s.value)}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* "타겟" */}
                <div className="flex items-center justify-between space-x-2">
                  <label className="w-44 text-sm font-pretendard font-normal text-[#212121]">
                    타겟
                  </label>
                  <div className="flex-grow">
                    <div className="grid grid-cols-3 gap-x-6 gap-y-2 justify-center">
                      {TARGETS_DATA.map((t) => (
                        <button
                          key={t.value}
                          className={`w-full py-4 text-xs font-pretendard rounded bg-white transition flex items-center justify-center ${
                            // 선택된 타겟이 배열에 포함되어 있는지 확인
                            targets.includes(t.value)
                              ? "border-2 border-[#212121]"
                              : "border border-[#F3F3F3]"
                          } ${
                            t.value === "target_free"
                              ? "font-pretendard text-[#A3A3A3]"
                              : "font-pretendard text-black"
                          }`}
                          onClick={() => handleTargetClick(t.value)}
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
              <h2 className="text-xl font-pretendard font-semibold text-[#000000]">
                공모전 등록 약관 동의
              </h2>
              <label className="text-xs font-pretendard text-[#828282] mb-4">
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
                className={`w-[180px] h-[45px] rounded-md transition font-medium ${
                  isButtonActive
                    ? "bg-white text-[#2FD8F6] border boreder-bg-[#2FD8F6] hover:font-bold"
                    : "bg-white text-[#E1E1E1] border border-bg-[#E1E1E1] cursor-not-allowed"
                }`}
                onClick={handleOpenPreviewModal}
                disabled={!isButtonActive}
              >
                미리보기
              </button>
              <button
                className={`w-[180px] h-[45px] rounded-md transition font-medium ${
                  isButtonActive
                    ? "bg-[#2FD8F6] text-white hover:font-bold"
                    : "bg-[#E1E1E1] text-white cursor-not-allowed"
                }`}
                // ✅ 여기에 onClick 이벤트 핸들러를 추가했습니다.
                onClick={handleRegisterClick}
                disabled={!isButtonActive}
              >
                공모전 등록하기
              </button>
            </div>
          </div>
        </div>
      </div>
      <FooterRegister />
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
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        title={modalTitle}
        content={modalContent}
        onConfirm={handleConfirmSubmit}
        onClose={() => setIsConfirmModalOpen(false)}
      />
      {isEasyHelpModalOpen && (
        <EasyHelpModal onClose={() => setIsEasyHelpModalOpen(false)} />
      )}
      {isPrizeInfoModalOpen && (
        <PrizeInfoModal onClose={() => setIsPrizeInfoModalOpen(false)} />
      )}
      {isBackModalOpen && (
        <ConfirmBackModal
          isOpen={isBackModalOpen}
          onClose={() => setIsBackModalOpen(false)}
          onConfirm={handleConfirmBack}
        />
      )}
    </div>
  );
};

export default ProjectRegister;

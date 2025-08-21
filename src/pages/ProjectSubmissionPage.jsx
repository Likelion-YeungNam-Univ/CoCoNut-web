import React, { useRef, useState, useEffect } from "react";
import ParticipantHeader from "../header/ParticipantHeader";
import Footer from "../components/Footer";
import { BiSolidImage } from "react-icons/bi";
import { IoArrowUp } from "react-icons/io5";
import checkIcon from "../assets/checkIcon.png";
import { fetchAiDescription } from "../apis/submissionAssistApi";
import ScriptModal from "../components/ScriptModal";
import xIcon from "../assets/xIcon.png";
import SubmissionPreviewModal from "../components/SubmissionPreviewModal";
import ConfirmSubmissionModal from "../components/ConfirmSubmissionModal";
import { submitProject } from "../apis/projectSubmissionApi";
import { updateSubmission } from "../apis/updateSubmissionApi";
import checklistIcon1 from "../assets/checklistIcon1.png";
import checklistIcon2 from "../assets/checklistIcon2.png";
import checklistIcon3 from "../assets/checklistIcon3.png";
import checklistIcon4 from "../assets/checklistIcon4.png";
import checklistIcon5 from "../assets/checklistIcon5.png";
import checklistIcon6 from "../assets/checklistIcon6.png";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import SubEasyHelpModal from "../components/SubEasyHelpModal";
import { checkSubmissionValid } from "../apis/submissionValidApi";

const ProjectSubmissionPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const location = useLocation();

  // 수정 모드 여부
  const submission = location.state?.submission || null;
  const isEditMode = !!submission;

  const [allChecked, setAllChecked] = useState(false);
  const [checkList, setCheckList] = useState({
    checklist: false,
    terms: false,
    caution: false,
  });

  // 제목, 설명, 링크 상태
  const [projectTitle, setProjectTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");

  const [loadingAi, setLoadingAi] = useState(false);

  // 모달창 상태 관리
  const [openModal, setOpenModal] = useState(null);
  const handleOpen = (type) => setOpenModal(type);
  const handleClose = () => setOpenModal(null);

  // 미리보기 모달 상태
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // 제출 확인 모달 상태
  const [isConfirmSubmissionOpen, setIsConfirmSubmissionOpen] = useState(false);

  // 이미지 업로드 상태
  const [uploadedImage, setUploadedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [errors, setErrors] = useState({});
  const titleRef = useRef(null);
  const imageRef = useRef(null);

  // 수정 모드일 경우 기존 데이터 세팅
  useEffect(() => {
    if (isEditMode) {
      setProjectTitle(submission.title || "");
      setDescription(submission.description || "");
      setLink(submission.relatedUrl || "");
      if (submission.imageUrl) {
        setPreviewUrl(submission.imageUrl);
      }
    }
  }, [isEditMode, submission]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(file);
      setPreviewUrl(URL.createObjectURL(file));

      if (errors.image) {
        setErrors((prev) => ({ ...prev, image: null }));
      }
    }
  };

  // 공통 에러 핸들링
  const handleApiError = (error, context) => {
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 400:
          if (context === "ai") {
            alert(
              data.message ||
                "AI Assistance 응답 생성에 실패하였습니다. 입력한 정보가 정확한지 확인해주세요."
            );
          } else if (context === "update") {
            alert(data.message || "제출 기한이 이미 지났습니다.");
          } else {
            alert(data.message || "작품제목은 필수 입력입니다.");
          }
          break;
        case 401:
          alert(data.message || "토큰이 없거나 만료되었습니다.");
          navigate("/signin");
          break;
        case 403:
          if (context === "submit") {
            alert(
              data.message ||
                "로그인된 계정이 해당 작업을 수행할 수 있는 역할이 아닙니다."
            );
          } else {
            alert(
              data.message ||
                "작품의 유저정보와 로그인 정보가 일치하지 않습니다."
            );
          }
          break;
        case 404:
          if (context === "submit") {
            alert(data.message || "해당 공모전을 찾을 수 없습니다.");
          } else {
            alert(data.message || "해당 작품은 존재하지 않습니다.");
          }
          navigate("/");
          break;
        default:
          alert("알 수 없는 오류가 발생했습니다.");
      }
    } else {
      alert("서버와 연결할 수 없습니다.");
    }
  };

  // 신규 제출
  const handleSubmitNewProject = async () => {
    try {
      await submitProject(projectId, {
        title: projectTitle,
        description,
        link,
        image: uploadedImage,
      });
      alert("작품이 성공적으로 제출되었습니다!");
      navigate(`/project-detail-participant/${projectId}`, {
        state: { initialTab: "SUBMISSIONS", refresh: true },
      });
    } catch (error) {
      handleApiError(error, "submit");
    }
  };

  // 수정
  const handleUpdateProject = async () => {
    try {
      await updateSubmission(submission.submissionId, {
        title: projectTitle,
        description,
        link,
        image: uploadedImage,
      });

      alert("작품이 성공적으로 수정되었습니다!");
      navigate(`/project-detail-participant/${projectId}`, {
        state: { initialTab: "SUBMISSIONS", refresh: true },
      });
    } catch (error) {
      handleApiError(error, "update");
    }
  };

  // 제출/수정 통합 함수
  const handleSubmitProject = async () => {
    if (!projectTitle.trim()) {
      setErrors({ title: "작품 제목을 입력해 주세요." });
      return;
    }
    setErrors({});

    if (isEditMode) {
      handleUpdateProject();
    } else {
      handleSubmitNewProject();
    }
  };

  const toggleAll = () => {
    const newValue = !allChecked;
    setAllChecked(newValue);
    setCheckList({
      checklist: newValue,
      terms: newValue,
      caution: newValue,
    });
  };

  const toggleSingle = (name) => {
    const newValue = !checkList[name];
    const newList = { ...checkList, [name]: newValue };
    setCheckList(newList);
    setAllChecked(Object.values(newList).every((v) => v));
  };

  const checkboxStyle = (checked) => ({
    backgroundImage: checked ? `url(${checkIcon})` : "none",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "20px 20px",
    border: checked ? "none" : undefined,
  });

  const isAllRequiredChecked =
    checkList.checklist && checkList.terms && checkList.caution;

  // AI 설명 생성 요청
  const handleAiGenerate = async () => {
    try {
      setLoadingAi(true);
      const result = await fetchAiDescription(aiPrompt);
      setDescription(result.description || result);
    } catch (error) {
      handleApiError(error, "ai");
    } finally {
      setLoadingAi(false);
    }
  };

  const handleOpenSubmitModal = async () => {
    if (!validateForm()) return;

    try {
      await checkSubmissionValid(projectId);
      setIsConfirmSubmissionOpen(true); // 검증 성공 시 모달 열기
    } catch (error) {
      const backendMessage = error.response?.data?.message;
      if (backendMessage) {
        alert(backendMessage);
      } else {
        alert("제출 자격 확인 중 알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  const handleOpenPreviewModal = () => {
    if (!validateForm()) return;
    setIsPreviewOpen(true);
  };

  const handleTitleChange = (e) => {
    setProjectTitle(e.target.value);
    if (errors.title && e.target.value.trim() !== "") {
      setErrors((prev) => ({ ...prev, title: null }));
    }
  };

  const validateForm = () => {
    let newErrors = {};

    if (!projectTitle.trim()) {
      newErrors.title = "작품 제목을 입력해 주세요.";
    }
    if (!previewUrl) {
      newErrors.image = "작품 이미지를 업로드해 주세요.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      if (newErrors.title) {
        titleRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      } else if (newErrors.image) {
        imageRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      return false;
    }

    setErrors({});
    return true;
  };

  const AiLoadingToast = () => (
    <div
      className="
      fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
      w-[215px] h-[50px] 
      bg-[#212121] text-white text-[14px] 
      pl-[20px] pr-[24px] py-[16px]
      rounded-[8px] flex items-center justify-center
      z-[9999] leading-[130%] tracking-[-0.02em]
    "
    >
      AI가 내용을 불러오는 중이에요..
    </div>
  );

  return (
    <div className="bg-[#F3F3F3] font-pretendard relative">
      <ParticipantHeader />
      <div className="flex justify-center">
        <div className="w-[1032px] min-h-[1700px] mt-[60px] bg-white rounded-[12px]">
          <div className="text-center font-pretendard">
            <h2 className="pt-[60px] text-[24px] font-semibold text-[#212121]">
              공모전 참가하기
            </h2>
            <p className="pt-[12px] text-[#828282] text-[12px]">
              작품 제목과 설명, 이미지를 첨부하여 제출해 주세요.
              <br />
              제출한 작품은 마감일까지 수정할 수 있습니다.
            </p>
          </div>

          {/* 작품 정보 입력 */}
          <div className="flex justify-between items-center w-[680px] mt-[60px] mx-[176px]">
            <h3 className="text-[16px] font-semibold text-[#212121]">
              작품 정보 입력
            </h3>
            <div className="flex space-x-0.5 text-[12px]">
              <p className=" text-[#2FD8F6]">*</p>
              <p className="text-[#626262]">필수입력</p>
            </div>
          </div>
          <hr className="w-[700px] border-[1px] border-[#A3A3A3] mt-[16px] mb-[40px] ml-[166px]" />

          {/* 작품 제목 */}
          <div className="grid grid-cols-[176px_1fr] items-start gap-4 ml-[176px] mb-[24px]">
            <label className="text-[#212121] text-[14px]">
              작품 제목 <span className="text-[#2FD8F6]">*</span>
            </label>

            <div className="flex flex-col">
              <input
                ref={titleRef}
                type="text"
                value={projectTitle}
                onChange={handleTitleChange}
                placeholder="작품의 제목을 지어주세요."
                className={`w-[504px] h-[48px] rounded-[6px] px-[16px] py-[15px] text-[14px] text-[#212121] placeholder:text-[#C3C3C3] outline-none
        ${
          errors.title
            ? "border border-red-500"
            : "border border-[#F3F3F3] focus:border-[#E1E1E1]"
        }`}
              />
              {errors.title && (
                <p className="text-red-500 text-[12px] mt-2 ml-1">
                  {errors.title}
                </p>
              )}
            </div>
          </div>

          {/* 이미지 첨부 */}
          <div className="grid grid-cols-[176px_1fr] items-start gap-4 ml-[176px] mb-[24px]">
            <label className="text-[#212121] text-[14px]">
              이미지 첨부하기 <span className="text-[#2FD8F6]">*</span>
            </label>
            <div className="flex flex-col">
              <div
                ref={imageRef}
                className={`relative w-[504px] h-[504px] rounded-[6px] flex flex-col items-center justify-center cursor-pointer overflow-hidden
        ${
          errors.image
            ? "border border-red-500"
            : "border border-[#F3F3F3] hover:bg-[#F3F3F3] hover:border-[#E1E1E1]"
        }`}
              >
                {previewUrl ? (
                  <div className="relative w-full h-full">
                    <img
                      src={previewUrl}
                      alt="업로드된 이미지"
                      className="w-full h-full object-cover rounded-[6px] cursor-default"
                    />
                    {/* X 버튼 */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadedImage(null);
                        setPreviewUrl(null); // 기존 미리보기도 제거
                        setErrors((prev) => ({
                          ...prev,
                          image: "작품 이미지를 업로드해 주세요.",
                        }));
                      }}
                      className="absolute top-[16px] right-[16px] p-[10.04px] bg-black/20 rounded-full w-[32px] h-[32px] flex items-center justify-center cursor-pointer"
                    >
                      <img src={xIcon} className="w-[11.93px] h-[11.93px]" />
                    </button>
                  </div>
                ) : (
                  <>
                    <BiSolidImage className="w-[40px] h-[40px] text-[#C3C3C3] mb-[8px]" />
                    <span className="text-[#C3C3C3] text-[14px]">
                      파일 업로드
                    </span>
                  </>
                )}

                <input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {!previewUrl && (
                  <label
                    htmlFor="imageUpload"
                    className="absolute inset-0 cursor-pointer"
                  ></label>
                )}
              </div>

              {errors.image && (
                <p className="text-red-500 text-[12px] mt-2 ml-1">
                  {errors.image}
                </p>
              )}
            </div>
          </div>

          {/* AI 작성 */}
          <div className="grid grid-cols-[184px_1fr] items-start gap-4 ml-[168px] mb-[24px]">
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

              <SubEasyHelpModal />
            </div>
            <div className="relative w-[504px] h-[93px]">
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="작품 설명을 간단하게 작성해 주세요. AI가 자세한 내용을 자동으로 생성해줘요."
                className="w-full h-full border border-[#F3F3F3] rounded-[6px] px-[16px] py-[15px] pr-[40px] text-[14px] text-[#212121] placeholder:text-[#C3C3C3] focus:border-[#E1E1E1] outline-none resize-none"
              />
              <button
                type="button"
                onClick={handleAiGenerate}
                disabled={!aiPrompt.trim()}
                className={`absolute bottom-[12px] right-[12px] text-white ${
                  aiPrompt.trim()
                    ? "bg-[#4C4C4C] hover:bg-[#636161] cursor-pointer"
                    : "bg-[#E1E1E1] cursor-not-allowed"
                } rounded-full w-[24px] h-[24px] flex items-center justify-center`}
              >
                <IoArrowUp className="w-[16px] h-[16px]" />
              </button>
            </div>
          </div>

          {/* 설명 */}
          <div className="grid grid-cols-[176px_1fr] items-start gap-4 ml-[176px] mb-[24px]">
            <label className="text-[#212121] text-[14px]">설명</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="작품의 의미, 목적 등을 자유롭게 작성해 주세요."
              className="w-[504px] h-[93px] border border-[#F3F3F3] rounded-[6px] px-[16px] py-[15px] pr-[40px] text-[14px] text-[#212121] placeholder:text-[#C3C3C3] focus:border-[#E1E1E1] outline-none resize-none"
            />
          </div>

          {/* 링크 */}
          <div className="grid grid-cols-[176px_1fr] items-start gap-4 ml-[176px]">
            <label className="text-[#212121] text-[14px]">링크 첨부하기</label>
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="주소를 입력해 주세요."
              className="w-[504px] h-[48px] border border-[#F3F3F3] rounded-[6px] px-[16px] py-[15px] text-[14px] text-[#212121] placeholder:text-[#C3C3C3] focus:border-[#E1E1E1] outline-none"
            />
          </div>

          {/* 약관 동의 */}
          <div>
            <div className="mx-[176px] mt-[60px]">
              <h3 className="text-[#212121] text-[16px] font-semibold">
                공모전 참가 약관 동의
              </h3>
              <span className="text-[12px] text-[#828282]">
                공모전 참가를 위해 아래 내용을 꼭 확인해 주세요.
              </span>
            </div>
            <hr className="w-[700px] border-[1px] border-[#A3A3A3] mt-[16px] mb-[40px] ml-[166px]" />

            <div className="flex items-center w-[678px] mx-[178px] text-[14px] text-[#212121] gap-[8px] pb-[30px]">
              <input
                type="checkbox"
                checked={allChecked}
                onChange={toggleAll}
                className="appearance-none w-[16px] h-[16px] rounded-[3px] border border-[#F3F3F3]"
                style={checkboxStyle(allChecked)}
              />
              약관 전체에 동의합니다.
            </div>

            <hr className="w-[678px] border-[1px] border-[#E1E1E1] mb-[27px] ml-[178px]" />
            <div className="w-[678px] mx-[178px] text-[14px] text-[#212121]">
              {[
                { key: "checklist", label: "(필수) 공모전 참가 체크리스트" },
                { key: "terms", label: "(필수) 공모전 이용 약관" },
                { key: "caution", label: "(필수) 공모전 이용 주의사항" },
              ].map(({ key, label }) => (
                <div
                  key={key}
                  className="flex items-center justify-between mb-[22px]"
                >
                  <div className="flex items-center gap-[8px]">
                    <input
                      type="checkbox"
                      checked={checkList[key]}
                      onChange={() => toggleSingle(key)}
                      className="appearance-none w-[16px] h-[16px] rounded-[2px] border border-[#F3F3F3]"
                      style={checkboxStyle(checkList[key])}
                    />
                    {label}
                  </div>
                  <span
                    className="text-[12px] text-[#A3A3A3] cursor-pointer underline"
                    onClick={() => handleOpen(key)}
                  >
                    자세히 보기
                  </span>
                </div>
              ))}
            </div>

            <div className="flex space-x-[20px] mx-[326px] mt-[62px]">
              <button
                disabled={!isAllRequiredChecked}
                onClick={handleOpenPreviewModal}
                className={`w-[180px] h-[45px] px-[20px] py-[12px] border-[1px] rounded-[8px] text-[16px] font-medium ${
                  isAllRequiredChecked
                    ? "border-[#2FD8F6] text-[#2FD8F6] cursor-pointer hover:bg-[#EAFBFE]"
                    : "border-[#E1E1E1] text-[#E1E1E1] cursor-not-allowed"
                }`}
              >
                미리보기
              </button>

              <button
                disabled={!isAllRequiredChecked}
                onClick={handleOpenSubmitModal}
                className={`w-[180px] h-[45px] px-[20px] py-[12px] rounded-[8px] text-[16px] font-medium ${
                  isAllRequiredChecked
                    ? "bg-[#2FD8F6] text-white cursor-pointer hover:bg-[#2AC2DD]"
                    : "bg-[#E1E1E1] text-white cursor-not-allowed"
                }`}
              >
                {isEditMode ? "수정하기" : "제출하기"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* 로딩 토스트 */}
      {loadingAi && <AiLoadingToast />}

      {/* 약관 모달 */}
      <ScriptModal
        isOpen={!!openModal}
        onClose={handleClose}
        title={
          openModal === "checklist"
            ? ""
            : openModal === "terms"
            ? "공모전 이용 약관"
            : openModal === "caution"
            ? "공모전 이용 주의사항"
            : ""
        }
      >
        {openModal === "checklist" && (
          <div className="text-[#212121]">
            <h2 className="text-[16px]  ml-[289px] font-semibold mb-[80px] ">
              공모전 참가 체크리스트
            </h2>
            <div className="grid grid-cols-3 gap-y-[80px] gap-x-[8px] ml-[20px] mr-[80px]">
              <div className="flex flex-col items-center text-center">
                <img
                  src={checklistIcon1}
                  className="w-[120px] h-[120px] mb-[12px]"
                />
                <div className="text-[14px] font-semibold mb-2">
                  참가 대상 확인
                </div>
                <div className="text-[12px]">
                  공모전 참여 조건(참가 대상, 제출 형식,
                  <br />
                  제한 사항 등)을 확인하세요.
                </div>
              </div>
              <div className="flex flex-col items-center text-center">
                <img
                  src={checklistIcon2}
                  className="w-[120px] h-[120px] mb-[12px]"
                />
                <div className="text-[14px] font-semibold mb-2">
                  작품 규격 확인
                </div>
                <div className="text-[12px]">
                  제출할 작품 형식, 해상도, 크기 등 <br />
                  규격을 준수했는지 확인합니다.
                </div>
              </div>
              <div className="flex flex-col items-center text-center">
                <img
                  src={checklistIcon3}
                  className="w-[120px] h-[120px] mb-[12px]"
                />
                <div className="text-[14px] font-semibold mb-2">
                  저작권 확인
                </div>
                <div className="text-[12px]">
                  작품에 사용된 이미지, 텍스트, 음원 등의 <br />
                  권리 침해가 없는지 확인하세요.
                </div>
              </div>
              <div className="flex flex-col items-center text-center">
                <img
                  src={checklistIcon4}
                  className="w-[120px] h-[120px] mb-[12px]"
                />
                <div className="text-[14px] font-semibold mb-2">내용 확인</div>
                <div className="text-[12px]">
                  작품 제목, 이미지, 작품 설명 등 모든 내용을
                  <br /> 올바르게 작성했는지 확인합니다.
                </div>
              </div>
              <div className="flex flex-col items-center text-center">
                <img
                  src={checklistIcon5}
                  className="w-[120px] h-[120px] mb-[12px]"
                />
                <div className="text-[14px] font-semibold mb-2">
                  제출 기한 확인
                </div>
                <div className="w-[212px] h-[40px] text-[12px]">
                  공모전 마감일을 확인하고,
                  <br /> 늦지 않게 제출하세요.
                </div>
              </div>
              <div className="flex flex-col items-center text-center">
                <img
                  src={checklistIcon6}
                  className="w-[120px] h-[120px] mb-[12px]"
                />
                <div className="text-[14px] font-semibold mb-2">
                  약관 및 주의사항 동의 확인
                </div>
                <div className="w-[212px] h-[40px] text-[12px]">
                  공모전 이용약관 및 주의사항에 대해 <br />
                  동의 여부를 확인합니다.
                </div>
              </div>
            </div>
          </div>
        )}
        {openModal === "terms" && (
          <div className="text-[#212121] text-[12px] mt-[28px]">
            <h4 className="font-semibold mb-2">1. 공모전 등록 및 참가</h4>
            <p>
              - 소상공인은 디자인, 메뉴판, 홍보물 등 가게에 필요한 도움을 공모
              형식으로 등록할 수 있습니다. <br />- 참가자는 공모 주제, 제출
              기한, 작품 형식에 맞게 작품을 제출해야 합니다. <br />- 제출 작품은
              등록된 목적 외에는 무단 사용, 복제, 배포, 상업적 이용이
              금지됩니다.
            </p>
            <h4 className="font-semibold mt-6 mb-2">2. 작품 제출 및 관리</h4>
            <p>
              - 제출 작품의 저작권은 참가자에게 있습니다. <br />- 플랫폼과
              소상공인은 제출된 작품을 검토, 홍보, 공모전 진행 목적에 한해
              사용할 수 있습니다. <br />- 참가자는 타인의 저작권, 상표권, 초상권
              등을 침해하지 않아야 하며, 위반 시 발생하는 모든 책임은 참가자에게
              있습니다. <br />- 소상공인은 수상작을 가게 홍보, 인테리어, 디자인
              등 운영 목적에 한해 사용할 수 있습니다.
            </p>
            <h4 className="font-semibold mt-6 mb-2">3. 수상 및 보상</h4>
            <p>
              - 소상공인은 공모전 마감 후 제출 작품을 확인하고 수상작을
              선정합니다. <br />- 수상작 선정과 상금 지급은 소상공인이 최종 확정
              버튼을 누른 후 완료됩니다. <br />- 수상작은 소상공인이 요청한
              목적에 맞게 활용할 수 있습니다.
            </p>
            <h4 className="font-semibold mt-6 mb-2">4. 공모전 삭제 및 환불</h4>
            <p>
              - 공모전 삭제 시 환불 규정: <br />
              (1) 진행 중이고 작품 제출이 없는 경우: 100%(지역화폐 제외) 환불{" "}
              <br />
              (2) 진행 중이고 작품이 제출된 경우: 50% 차감 후 환불(50%는
              참가자에 1/N 지급) <br />
              (3) 마감 후 작품 제출이 없는 경우: 수수료 12% 차감 후 환불 <br />
              (4) 마감 후 작품이 제출되어 있는 경우: 환불 불가 <br />- 삭제 및
              환불 관련 문의는 고객센터를 통해 이용할 수 있습니다.
            </p>
            <h4 className="font-semibold mt-6 mb-2">5. 이용자 의무</h4>
            <p>
              - 소상공인과 참가자는 정확한 정보를 제공해야 합니다. <br />-
              소상공인은 허위 정보 등록, 부적절한 주제 등록을 금지합니다. <br />
              - 작품 제출 및 공모전 진행 중 발생하는 분쟁은 참가자와 소상공인이
              상호 협의하여 해결해야 합니다.
            </p>
            <h4 className="font-semibold mt-6 mb-2">6. 주의사항</h4>
            <p>
              - 제출 전 작품 제목, 이미지, 설명을 반드시 확인하세요. <br />-
              타인 비방, 과도한 광고, 저작권 침해 작품은 제출할 수 없습니다.{" "}
              <br />- 플랫폼은 작품 품질, 결과물에 대한 책임, 분쟁에 대해
              책임지지 않습니다.
            </p>
          </div>
        )}
        {openModal === "caution" && (
          <div className="text-[#212121] text-[12px] mt-[28px]">
            <h4 className="font-semibold mb-2">1. 소상공인 주의사항</h4>
            <p>
              - 공모전 등록 시 정확한 정보와 목적을 기재해주세요.
              <br />- 부적절한 내용이나 타인을 비방하는 공모전은 등록할 수
              없습니다. <br />- 제출된 작품은 공모 목적 외 사용을 금지하며, 상금
              지급 전 반드시 수상작을 확정해야 합니다. <br />- 환불 규정을
              확인하고, 삭제 전 상황에 따른 환불 가능 여부를 숙지하세요.
            </p>
            <h4 className="font-semibold mt-6 mb-2">2. 참가자 주의사항</h4>
            <p>
              - 작품 제출 전 주제, 형식, 기한을 반드시 확인하세요. <br />-
              타인의 저작권, 초상권, 상표권을 침해하지 않아야 합니다. <br />-
              비방, 과도한 광고, 불법 콘텐츠는 제출할 수 없습니다. <br />-
              수상작이 선정되면, 상금 지급 및 거래는 소상공인과 직접 진행됩니다.
            </p>
            <h4 className="font-semibold mt-6 mb-2">3. 기타 주의사항</h4>
            <p>
              - 폭력적, 선정적, 혐오적, 정치적, 종교적 내용을 담은 공모전 또는
              작품은 등록할 수 없습니다. <br />- 수상작이 선정되면 공모전
              작성자가 상금 및 지역화폐 지급을 확정해야 참여자가 보상을 받을 수
              있습니다. <br />
              - 공모전 진행 중 발생하는 분쟁은 소상공인과 참가자가 상호 협의하여
              해결합니다. <br />- 플랫폼은 작품 품질, 결과물, 분쟁에 대한 책임을
              지지 않습니다. <br />- 공모전 관련 문의는 고객센터를 통해 진행해
              주세요. <br />- 안전하고 즐거운 공모전 경험을 위해 규칙과 안내를
              꼭 확인해주세요.
            </p>
          </div>
        )}
      </ScriptModal>

      {/* 미리보기 모달 */}
      <SubmissionPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        projectTitle={projectTitle}
        uploadedImage={previewUrl}
        description={description}
        link={link}
      />

      {/* 제출/수정 확인 모달 */}
      {isConfirmSubmissionOpen && (
        <ConfirmSubmissionModal
          onClose={() => setIsConfirmSubmissionOpen(false)}
          onSubmit={handleSubmitProject}
          mode={isEditMode ? "edit" : "submit"}
        />
      )}
    </div>
  );
};

export default ProjectSubmissionPage;

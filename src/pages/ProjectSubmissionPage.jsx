import React, { useState } from "react";
import ParticipantHeader from "../header/ParticipantHeader";
import Footer from "../components/Footer";
import { BiSolidImage } from "react-icons/bi";
import { IoArrowUp } from "react-icons/io5";
import checkIcon from "../assets/checkIcon.png";
import { fetchAiDescription } from "../apis/submissionAssistApi";
import ScriptModal from "../components/ScriptModal";

const ProjectSubmissionPage = () => {
  const [allChecked, setAllChecked] = useState(false);
  const [checkList, setCheckList] = useState({
    checklist: false,
    terms: false,
    caution: false,
  });

  const [aiPrompt, setAiPrompt] = useState("");
  const [description, setDescription] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  // 모달창 상태 관리
  const [openModal, setOpenModal] = useState(null);
  const handleOpen = (type) => setOpenModal(type);
  const handleClose = () => setOpenModal(null);

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
      alert("AI 설명 생성 중 오류가 발생했습니다.");
    } finally {
      setLoadingAi(false);
    }
  };

  // 로딩 토스트
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
            <input
              type="text"
              placeholder="작품의 제목을 지어주세요."
              className="w-[504px] h-[48px] border border-[#F3F3F3] rounded-[6px] px-[16px] py-[15px] text-[14px] text-[#212121] placeholder:text-[#C3C3C3] focus:border-[#E1E1E1] outline-none"
            />
          </div>

          {/* 이미지 첨부 */}
          <div className="grid grid-cols-[176px_1fr] items-start gap-4 ml-[176px] mb-[24px]">
            <label className="text-[#212121] text-[14px]">
              이미지 첨부하기 <span className="text-[#2FD8F6]">*</span>
            </label>
            <label
              htmlFor="imageUpload"
              className="w-[504px] h-[504px] border border-[#F3F3F3] rounded-[6px] flex flex-col items-center justify-center"
            >
              <BiSolidImage className="w-[40px] h-[40px] text-[#C3C3C3] mb-[8px]" />
              <span className="text-[#C3C3C3] text-[14px]">파일 업로드</span>
            </label>
          </div>

          {/* AI 작성 */}
          <div className="grid grid-cols-[184px_1fr] items-start gap-4 ml-[168px] mb-[24px]">
            <div>
              <label className="ml-[8px] text-[#212121] text-[14px]">
                AI로 설명 빠르게 작성하기
              </label>
              <div className="w-[153px] h-[32px] mt-[8px] bg-[#E0F9FE] px-[16px] py-[8px] text-[12px] text-[#2AC2DD] font-medium rounded-[16px] leading-[130%] tracking-[-0.01em]">
                Tip. 도움받는 법 알아보기
              </div>
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
                disabled={!aiPrompt.trim()} // 텍스트 없을 땐 비활성화
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
            <label className="text-[#212121] text-[14px]">
              설명 <span className="text-[#2FD8F6]">*</span>
            </label>
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
                className={`w-[180px] h-[45px] px-[20px] py-[12px] border-[1px] rounded-[8px] text-[16px] font-medium hover:bg-[#EAFBFE] ${
                  isAllRequiredChecked
                    ? "border-[#2FD8F6] text-[#2FD8F6] cursor-pointer"
                    : "border-[#E1E1E1] text-[#E1E1E1] cursor-not-allowed"
                }`}
              >
                미리보기
              </button>

              <button
                disabled={!isAllRequiredChecked}
                className={`w-[180px] h-[45px] px-[20px] py-[12px] rounded-[8px] text-[16px] font-medium hover:bg-[#2AC2DD] ${
                  isAllRequiredChecked
                    ? "bg-[#2FD8F6] text-white cursor-pointer"
                    : "bg-[#E1E1E1] text-white cursor-not-allowed"
                }`}
              >
                제출하기
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
            ? "공모전 참가 체크리스트"
            : openModal === "terms"
            ? "공모전 이용 약관"
            : openModal === "caution"
            ? "공모전 이용 주의사항"
            : ""
        }
      >
        {openModal === "checklist" && (
          <p>공모전 참가 체크리스트 약관 동의 내용....</p>
        )}
        {openModal === "terms" && <p>공모전 이용 약관 동의 내용....</p>}
        {openModal === "caution" && <p>공모전 이용 주의사항 동의 내용....</p>}
      </ScriptModal>
    </div>
  );
};

export default ProjectSubmissionPage;

import React, { useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";
import { fetchUserInfo } from "../apis/userApi";
import { IoPersonCircle } from "react-icons/io5";

const SubmissionPreviewModal = ({
  isOpen,
  onClose,
  projectTitle,
  uploadedImage,
  description,
  link,
}) => {
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const user = await fetchUserInfo();
        setNickname(user.nickname);
      } catch (error) {
        console.error(error);
      }
    };
    getUserInfo();
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.classList.add("modal-open");

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("modal-open");
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 overflow-y-auto font-pretendard"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="flex justify-center">
        <div className="relative mt-[91px] mb-[91px]">
          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className="absolute left-[calc(100%+20px)] top-0 border rounded-full border-[#F3F3F3] bg-[#F3F3F3]"
          >
            <IoIosClose size={40} />
          </button>

          {/* 모달 박스 */}
          <div className="bg-white rounded-[12px] max-w-[1032px] max-h-[1550px] overflow-y-auto px-[64px] py-[63px]">
            <div>
              {/* 사용자 닉네임 */}
              <div className="flex space-x-[8px] mb-[11px]">
                <IoPersonCircle className="text-[#A3A3A3] w-[19.5px] h-[19.5px]" />
                <p className="text-[#A3A3A3] text-[14px] font-medium">
                  {nickname}
                </p>
              </div>

              {/* 제목 */}
              <h2 className="text-[28px] font-semibold text-black">
                {projectTitle}
              </h2>
              <hr className="w-[904px] border-[1px] border-[#E1E1E1] mt-[40px] mb-[60px]" />

              {/* 이미지 */}
              <img
                src={uploadedImage}
                alt="작품 이미지"
                className="max-w-[904px] max-h-[904px] rounded-[6px] mb-[16px]"
              />

              {/* 설명 */}
              <p className="text-[#212121] text-[16px] whitespace-pre-line mb-[24px]">
                {description}
              </p>

              {/* 링크 */}
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#212121] underline"
              >
                {link}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionPreviewModal;

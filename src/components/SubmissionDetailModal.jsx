import React, { useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";
import { IoPersonCircle } from "react-icons/io5";
import { fetchSubmissionDetail } from "../apis/submissionApi";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import { useNavigate, useParams } from "react-router-dom";
import { BiSolidPencil } from "react-icons/bi";

const SubmissionDetailModal = ({ isOpen, onClose, submissionId, role }) => {
  const [submission, setSubmission] = useState(null);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const navigate = useNavigate();
  const { projectId } = useParams();

  useEffect(() => {
    if (!isOpen || !submissionId) return;

    const getSubmission = async () => {
      try {
        const data = await fetchSubmissionDetail(submissionId);
        setSubmission(data);
      } catch (error) {
        console.error("작품 상세 조회 실패:", error);
      }
    };

    getSubmission();
  }, [isOpen, submissionId]);

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

  const handleEdit = () => {
    // 수정하기 함수
    setIsOptionsOpen(false);
    navigate(`/projects/${projectId}/submission`, {
      state: { submission },
    });
  };

  if (!isOpen || !submission) return null;

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
              {/* 작성자 */}
              <div className="flex space-x-[8px] mb-[11px]">
                <IoPersonCircle className="text-[#A3A3A3] w-[19.5px] h-[19.5px]" />
                <p className="text-[#A3A3A3] text-[14px] font-medium">
                  {submission.writer}
                </p>
              </div>

              {/* 제목 */}
              <div className="flex justify-between items-start">
                <h2 className="text-[28px] font-semibold text-black">
                  {submission.title}
                </h2>

                {/* 참가자일 때만 수정 아이콘 */}
                {role === "participant" && (
                  <div className="relative">
                    <button onClick={() => setIsOptionsOpen(!isOptionsOpen)}>
                      <PiDotsThreeVerticalBold className="w-[24px] h-[24px] text-black" />
                    </button>
                    {isOptionsOpen && (
                      <div className="absolute right-0 mt-2 w-[176px] h-[60px] bg-white rounded-[6px] shadow-[0px_1px_12px_rgba(0,0,0,0.1)] z-10">
                        <button
                          onClick={handleEdit}
                          className="flex items-center gap-2 h-full px-3 text-[12px] text-[#828282] hover:bg-gray-100 w-full text-left"
                        >
                          <BiSolidPencil className="text-[14px] text-[#C3C3C3]" />
                          수정하기
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <hr className="w-[904px] border-[1px] border-[#E1E1E1] mt-[40px] mb-[60px]" />

              {/* 이미지 */}
              <img
                src={submission.imageUrl}
                alt="작품 이미지"
                className="max-w-[904px] max-h-[904px] rounded-[6px] mb-[16px]"
              />

              {/* 설명 */}
              <p className="text-[#212121] text-[16px] whitespace-pre-line mb-[24px]">
                {submission.description}
              </p>

              {/* 링크 */}
              {submission.relatedUrl && (
                <a
                  href={submission.relatedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#212121] underline"
                >
                  {submission.relatedUrl}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionDetailModal;

const SuccessSubmissionModal = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 overflow-y-auto font-pretendard"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="flex justify-center">
        <div className="relative mt-[120px]">
          {/* 모달 박스 */}
          <div className="bg-white rounded-[12px] w-[420px] h-[200px] flex flex-col items-center justify-center text-center">
            <h3 className="text-[#212121] text-[20px] font-semibold mt-2 mb-2">
              제출이 완료되었습니다!
            </h3>
            <span className="text-[#828282] text-[14px] mb-6">
              작품이 성공적으로 제출되었습니다. <br />
              확인을 누르면 작품 목록으로 이동합니다.
            </span>
            <button
              onClick={onClose}
              className="w-[99px] h-[32px] text-[12px] bg-[#4C4C4C] text-white rounded-[6px] hover:bg-[#212121] cursor-pointer"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessSubmissionModal;

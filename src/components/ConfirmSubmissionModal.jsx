const ConfirmSubmissionModal = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 overflow-y-auto font-pretendard"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="flex justify-center">
        <div className="relative mt-[120px]">
          {/* 모달 박스 */}
          <div className="bg-white rounded-[12px] w-[420px] h-[200px] pt-[32px] pb-[24px] pl-[28px]">
            <h3 className="text-[#212121] text-[20px] font-semibold">
              작품을 제출하시겠습니까?
            </h3>
            <span className="text-[#828282] text-[14px]">
              제출 후에도 마감일까지 작품을 수정할 수 있습니다.
            </span>
            <div className="flex gap-[12px] text-[12px] font-medium ml-[184px] mt-[60px]">
              <button
                onClick={onClose}
                className="w-[73px] h-[32px] text-[#4C4C4C] border-[1px] border-[#E1E1E1] rounded-[6px] hover:bg-[#F3F3F3] hover:border-[#E1E1E1] cursor-pointer"
              >
                취소하기
              </button>
              <button className="w-[99px] h-[32px] bg-[#4C4C4C] text-white rounded-[6px] hover:bg-[#212121] cursor-pointer">
                네, 제출할게요
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmSubmissionModal;

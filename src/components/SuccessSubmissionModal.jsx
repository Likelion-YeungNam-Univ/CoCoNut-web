const SuccessSubmissionModal = ({ onClose, mode = "submit" }) => {
  const isEdit = mode === "edit";
  const isRegister = mode === "register";

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 overflow-y-auto font-pretendard" // Confirm과 동일
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="flex justify-center">
        <div className="relative mt-[120px]">
          {/* 모달 박스 */}
          <div className="bg-white rounded-[12px] w-[420px] h-[200px] pt-[32px] pb-[24px] pl-[28px] pr-[28px]">
            <h3 className="text-[#212121] text-[20px] font-semibold">
              {isRegister
                ? "공모전 등록이 완료되었습니다!"
                : isEdit
                ? "수정이 완료되었습니다!"
                : "제출이 완료되었습니다!"}
            </h3>
            <span className="text-[#828282] text-[14px] block mt-[4px] leading-[1.5]">
              {isRegister ? (
                <>
                  공모전이 성공적으로 등록되었습니다. <br />
                  확인을 누르면 공모전 상세 페이지로 이동합니다.
                </>
              ) : isEdit ? (
                <>
                  작품이 성공적으로 수정되었습니다. <br />
                  확인을 누르면 작품 목록으로 이동합니다.
                </>
              ) : (
                <>
                  작품이 성공적으로 제출되었습니다. <br />
                  확인을 누르면 작품 목록으로 이동합니다.
                </>
              )}
            </span>
            {/* 버튼 영역 */}
            <div className="flex justify-end mt-[38px]">
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
    </div>
  );
};

export default SuccessSubmissionModal;

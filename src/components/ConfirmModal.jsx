import React from "react";

// Modal is no longer using the Link component to prevent premature navigation.
const ConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 p-18 font-pretendard">
      {/* 모달 콘텐츠를 Flexbox 컨테이너로 만들어 상하 정렬 */}
      <div className="bg-white rounded-xl max-w-md w-full m-4 mt-10 p-4 flex flex-col justify-between min-h-[200px]">
        {/* 텍스트를 왼쪽 정렬 */}
        <div className="space-y-2 mt-4 ml-5">
          <h1 className="text-[20px] font-semibold text-[#212121] text-left">
            공모전을 등록하시겠습니까?
          </h1>
          <h1 className="text-[14px] text-[#828282] text-left">
            등록 이후에는 수정할 수 없습니다. 꼭 다시 한 번 확인해주세요.
          </h1>
        </div>
        {/* 버튼을 오른쪽 하단에 배치 */}
        <div className="flex justify-end gap-4 mb-3 mr-3">
          <button
            onClick={onClose}
            className="py-2 px-4 border border-[#E1E1E1] rounded-lg text-[12px] text-gray-700 hover:bg-gray-100 transition"
          >
            취소하기
          </button>
          <button
            onClick={onConfirm}
            className="py-2 px-4 bg-[#4C4C4C] text-[12px] text-white rounded-lg hover:bg-gray-800 transition"
          >
            네, 등록할게요
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

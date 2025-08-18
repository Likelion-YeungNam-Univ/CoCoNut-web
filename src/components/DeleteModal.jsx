import React from "react";

const ProjectDeleteModal = ({
  onClose,
  onConfirm,
  projectStatus,
  hasSubmissions,
}) => {
  const getRefundAmount = () => {
    if (projectStatus === "ongoing") {
      return hasSubmissions ? "50% 차감(참가자에 1/N 지급)" : "전액 환불";
    } else {
      return hasSubmissions ? "환불 불가" : "수수료 12% 차감 후 환불";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-[480px] h-[480px] flex flex-col justify-between">
        <div className="flex-grow flex flex-col">
          <h2 className="text-[20px] font-semibold text-left">
            공모전을 정말 삭제하시겠습니까?
          </h2>
          <p className="text-[14px] text-[#828282] mt-2 mb-6 text-left">
            삭제 시점에 따라 환불 금액이 다르게 적용됩니다.
          </p>

          <table className="w-full text-sm text-left text-[#A3A3A3] border-collapse">
            <thead>
              <tr className="border-t-[2px] border-[#A3A3A3]">
                <th
                  scope="col"
                  className="px-4 py-2 bg-[#F3F3F3] text-[#212121] font-normal text-[12px] border border-[#E1E1E1] border-l-0"
                >
                  삭제 시점
                </th>
                <th
                  scope="col"
                  className="px-4 py-2 bg-[#F3F3F3] text-[#212121] font-normal text-[12px] border border-[#E1E1E1]"
                >
                  참여작 유무
                </th>
                <th
                  scope="col"
                  className="px-4 py-2 bg-[#F3F3F3] text-[#212121] font-normal text-[12px] border border-[#E1E1E1] border-r-0"
                >
                  환불 금액
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  rowSpan="2"
                  className="px-4 py-3 border border-[#E1E1E1] border-l-0 text-[#828282] font-normal text-[12px]"
                >
                  공모전 진행 중
                </td>
                <td className="px-4 py-3 border border-[#E1E1E1] text-[#828282] font-normal text-[12px]">
                  참여작 없음
                </td>
                <td className="px-4 py-3 border border-[#E1E1E1] border-r-0 text-[#212121] font-normal text-[12px]">
                  전액 환불
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 border border-[#E1E1E1] border-l-0 text-[#828282] font-normal text-[12px]">
                  참여작 있음
                </td>
                <td className="px-4 py-3 border border-[#E1E1E1] border-r-0 text-[#212121] font-normal text-[12px]">
                  50% 차감(참가자에 1/N 지급)
                </td>
              </tr>
              <tr>
                <td
                  rowSpan="2"
                  className="px-4 py-3 border border-[#E1E1E1] border-l-0 text-[#828282] font-normal text-[12px]"
                >
                  공모전 마감 이후
                </td>
                <td className="px-4 py-3 border border-[#E1E1E1] text-[#828282] font-normal text-[12px]">
                  참여작 없음
                </td>
                <td className="px-4 py-3 border border-[#E1E1E1] border-r-0 text-[#212121] font-normal text-[12px]">
                  수수료 12% 차감 후 환불
                </td>
              </tr>
              <tr className="border-b-[2px] border-[#A3A3A3]">
                <td className="px-4 py-3 border border-[#E1E1E1] border-l-0 text-[#828282] font-normal text-[12px]">
                  참여작 있음
                </td>
                <td className="px-4 py-3 border border-[#E1E1E1] border-r-0 text-[#212121] font-normal text-[12px]">
                  환불 불가
                </td>
              </tr>
            </tbody>
          </table>
          <div className="text-[10px] text-[#AEAEAE] mt-4 text-left">
            * 삭제 및 환불에 대해 궁금한 점이 있다면 고객센터를 통해 문의
            부탁드립니다.
          </div>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-5 py-2 border border-[#E1E1E1] rounded-md text-[#4C4C4C] font-medium text-[12px] bg-white hover:bg-gray-100 transition-colors"
          >
            취소하기
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-md text-[#FFFFFF] font-medium text-[12px] bg-[#EE4343] hover:bg-red-600 transition-colors"
          >
            삭제하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDeleteModal;

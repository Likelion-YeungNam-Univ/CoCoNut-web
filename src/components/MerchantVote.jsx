import React, { useState } from 'react';
import vote1 from "../assets/vote1.png";
import vote2 from "../assets/vote2.png";
import vote3 from "../assets/vote3.png";
import { BsCheckCircleFill } from "react-icons/bs";
import Footer from "./Footer";
import VoteModal from "./VoteModal";
import VoteTitle from './VoteTitle';
import { useNavigate } from "react-router-dom"; 

const MerchantVote = () => {

  const navigate = useNavigate();

  // 선택 모드/선택 상태
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState(new Set());
  const [showModal, setShowModal] = useState(false);
  

  // 16개 카드 더미 데이터 (상위 3개만 뱃지)
  const cards = Array.from({ length: 16 }, (_, i) => {
    const id = i + 1;
    const rank = id <= 3 ? id : null; // 1,2,3위만 표시
    const votes = rank === 1 ? 60 : rank === 2 ? 30 : rank === 3 ? 10 : null;
    return { id, rank, votes, title: "제목제목제목제목제목..." };
  });
  


  // 모달에서 최종 확정
  const handleModalConfirm = async () => {
    // TODO: 실제 확정 API 호출/후처리
    console.log("FINAL CONFIRM ids:", Array.from(selected));

    // 예시: 확정 완료 후 선택모드 종료 + 선택 해제 + 모달 닫기
    setSelectMode(false);
    setSelected(new Set());
    setShowModal(false);

     navigate("/vote-success");
  };

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  
const handleConfirm = () => {
  if (selected.size === 0) return;
  setShowModal(true);          // ✅ 모달 오픈
};

  const RankBadge = ({ rank, votes }) => {
    if (!rank) return null;
    const icon = rank === 1 ? vote1 : rank === 2 ? vote2 : vote3;
    return (
      <div className="flex flex-row border rounded-[20px] bg-[#212121] border-[#212121] pt-[8px] pb-[8px] pl-[12px] mt-[12px] ml-[12px] w-[94px] h-[40px] font-semibold text-[16px] text-[#2FD8F6]">
        <img className="mr-[8px]" src={icon} alt={`${rank}등`} />
        {votes}표
      </div>
    );
  };

  return (
    <div className="font-pretendard flex flex-col items-center">
      {/* 카드 그리드 */}
      {/* <VoteTitle/> */}
      <div className="mt-[60px] grid grid-cols-4 grid-rows-4 gap-[24px]">
        {cards.map(({ id, rank, votes, title }) => (
          <div
            key={id}
            onClick={() => selectMode && toggleSelect(id)}
            className={`border border-[#E1E1E1] rounded-[12px] w-[240px] h-[306px] 
              ${selectMode ? 'cursor-pointer hover:ring-2 hover:ring-[#2FD8F6]' : ''} 
              ${selected.has(id) ? 'ring-2 ring-[#2FD8F6]' : ''}`}
          >
            <div className="relative border border-[#EBEBEB] w-[240px] h-[240px] rounded-[12px] bg-[#EBEBEB]">
              {/* 상단 순위 뱃지 (상위 3개만) */}
              <RankBadge rank={rank} votes={votes} />

              {/* 선택 모드 선택 표시 */}
              {selectMode && selected.has(id) && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <BsCheckCircleFill size={56} color='#2FD8F6' />
                </div>
              )}
            </div>
            <span className="block mt-[8px] px-[8px] truncate">{title}</span>
          </div>
        ))}
      </div>

      {/* 하단 버튼 */}
      {!selectMode ? (
        <button
          className="mb-[330px] mt-[80px] border w-[180px] h-[45px] rounded-[8px] pt-[12px] pr-[20px] pb-[12px] pl-[20px] text-white bg-[#212121] text-[16px] flex items-center justify-center"
          onClick={() => setSelectMode(true)}
        >
          수상작 선정하기
        </button>
      ) : (
        <div className="flex items-center gap-[12px] mt-[80px] mb-[330px]">
          <button
            className="flex justify-center items-center border w-[180px] h-[45px] rounded-[8px] bg-white text-[#212121] border-[#E1E1E1]"
            onClick={() => { setSelectMode(false); setSelected(new Set()); }}
          >
            취소
          </button>
          <button
            className={`w-[180px] h-[45px] rounded-[8px] text-white flex justify-center items-center
              ${selected.size === 0 ? 'bg-[#A3A3A3] cursor-not-allowed' : 'bg-[#212121]'}`}
            disabled={selected.size === 0}
            onClick={handleConfirm}
          >
            선정하기
          </button>
        </div>
      )}
     <VoteModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleModalConfirm}
        selectedCount={selected.size}
      />
      {/* <Footer /> */}
    </div>
  );
};

export default MerchantVote;

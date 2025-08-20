// src/components/ParticipantVoteGrid.jsx
import React, { useEffect, useMemo, useState } from "react";
import { BsCheckCircleFill } from "react-icons/bs";
import VoteConfirmModal from "./VoteConfirmModal";

// 상위 1/2/3위 뱃지 이미지
import vote1 from "../assets/vote1.png";
import vote2 from "../assets/vote2.png";
import vote3 from "../assets/vote3.png";

/**
 * 참여자 투표 그리드
 * props:
 * - submissions: [{ id|submissionId, title, writerNickname, imageUrl, voteCount? }]
 * - voteStartDate, voteEndDate?: string
 * - onVote?: (submission) => void   // 모달 확정 시 콜백 (선택)
 * - initialTotalVotes?: number      // 전체 투표 수 초기값(옵션, 기본 0)
 */
const ParticipantVoteGrid = ({
  submissions = [],
  voteStartDate,
  voteEndDate,
  onVote,
  initialTotalVotes = 0,
}) => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selected, setSelected] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  // 카드별 투표수는 로컬 상태로 관리 (백엔드 연동 전 단계)
  const [items, setItems] = useState(
    submissions.map((s) => ({
      ...s,
      // 서버가 주지 않으면 0으로 시작
      voteCount: typeof s.voteCount === "number" ? s.voteCount : 0,
    }))
  );

  // 전체 투표수
  const [totalVotes, setTotalVotes] = useState(initialTotalVotes);

  // submissions 변경 시 상태 동기화
  useEffect(() => {
    setItems(
      submissions.map((s) => ({
        ...s,
        voteCount: typeof s.voteCount === "number" ? s.voteCount : 0,
      }))
    );
  }, [submissions]);

  const votePeriodLabel =
    voteStartDate && voteEndDate ? `${voteStartDate} - ${voteEndDate}` : null;

  const keyOf = (s) => s?.submissionId ?? s?.id;

  const handleCardClick = (s) => {
    if (!isSelecting || hasVoted) return;
    const cur = keyOf(selected);
    const next = keyOf(s);
    setSelected(cur === next ? null : s);
  };

  /** 모달에서 "투표하기" 확정 */
  const handleConfirm = () => {
    if (!selected) return;

    // 1) 선택한 항목의 투표수 +1
    const selKey = keyOf(selected);
    setItems((prev) =>
      prev.map((it) =>
        keyOf(it) === selKey ? { ...it, voteCount: (it.voteCount ?? 0) + 1 } : it
      )
    );

    // 2) 전체 투표수 +1
    setTotalVotes((v) => v + 1);

    // 3) 상태 업데이트
    setHasVoted(true);
    setIsSelecting(false);
    setOpenConfirm(false);

    // 4) 외부 콜백 (선택)
    if (typeof onVote === "function") onVote(selected);
  };

  /** 상위 3개 아이템(동점은 index 순)을 계산해서 id->rank 매핑 */
  const top3Map = useMemo(() => {
    // 투표 후에만 뱃지 노출
    if (!hasVoted) return new Map();

    const sorted = [...items].sort(
      (a, b) => (b.voteCount ?? 0) - (a.voteCount ?? 0)
    );
    const map = new Map();
    if (sorted[0]) map.set(keyOf(sorted[0]), { rank: 1, votes: sorted[0].voteCount ?? 0 });
    if (sorted[1]) map.set(keyOf(sorted[1]), { rank: 2, votes: sorted[1].voteCount ?? 0 });
    if (sorted[2]) map.set(keyOf(sorted[2]), { rank: 3, votes: sorted[2].voteCount ?? 0 });
    return map;
  }, [items, hasVoted]);

  const RankBadge = ({ rank, votes }) => {
    if (!rank) return null;
    const icon = rank === 1 ? vote1 : rank === 2 ? vote2 : vote3;
    return (
      <div className="flex justify-center items-center rounded-[20px] bg-[#212121] border border-[#212121] w-[94px] h-[40px] mt-[12px] ml-[12px]">
        <img className="mr-[8px]" src={icon} alt={`${rank}위`} />
        <span className="font-semibold text-[16px] text-[#2FD8F6]">{votes}표</span>
      </div>
    );
  };

  return (
    <div className="font-pretendard flex flex-col items-center">
      {/* 상단 안내 */}
      {votePeriodLabel && (
        <span className="border border-[#E0F9FE] bg-[#E0F9FE] text-[#26ADC5] font-semibold text-[14px] pt-[8px] pb-[8px] rounded-[24px] w-[255px] h-[34px] mt-[80px] flex gap-[8px] items-center justify-center">
          <span className="font-medium">투표 기간</span>
          {votePeriodLabel}
        </span>
      )}

      {/* 제목/설명: 투표 전/후 문구 전환 */}
      {!hasVoted ? (
        <>
          <span className="text-[24px] font-semibold mt-[20px]">
            마음에 드는 작품에 투표해 주세요!
          </span>
          <span className="mt-[8px] text-[14px] text-[#A3A3A3]">
            한 작품만 선택할 수 있어요. 선택 후 하단의 투표하기 버튼을 눌러주세요.
          </span>
        </>
      ) : (
        <>
          <span className="text-[24px] font-semibold mt-[20px]">
            지금까지 <b>{totalVotes}</b>명이 투표에 참여했어요!
          </span>
          <span className="mt-[8px] text-[14px] text-[#A3A3A3]">
            투표를 통해 지역의 목소리가 반영된 순위를 확인할 수 있어요.
          </span>
        </>
      )}

      {/* 카드 그리드 */}
      <div className="mt-[60px] grid grid-cols-4 gap-[24px]">
        {items.map((s, idx) => {
          const key = keyOf(s) ?? idx;
          const isSelected = keyOf(selected) === key;

          // 상위 3위 뱃지 정보 (투표 후에만 표시)
          const rankInfo = top3Map.get(key);

          return (
            <div
              key={key}
              onClick={() => handleCardClick(s)}
              className={`border border-[#E1E1E1] rounded-[12px] w-[240px] h-[306px] ${
                isSelecting && !hasVoted
                  ? "cursor-pointer hover:ring-2 hover:ring-[#2FD8F6]"
                  : "cursor-default"
              } ${isSelected && !hasVoted ? "ring-2 ring-[#2FD8F6]" : ""}`}
            >
              {/* 이미지 영역 */}
              <div className="relative border border-[#EBEBEB] w-[240px] h-[240px] rounded-[12px] bg-[#EBEBEB] overflow-hidden">
                {/* (투표 후) 상위 3개 투표수 뱃지 */}
                {rankInfo && <RankBadge rank={rankInfo.rank} votes={rankInfo.votes} />}

                {/* (투표 전 선택모드) 선택 체크 아이콘 */}
                {isSelecting && !hasVoted && isSelected && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BsCheckCircleFill size={56} color="#2FD8F6" />
                  </div>
                )}

                {s?.imageUrl ? (
                  <img
                    src={s.imageUrl}
                    alt={s.title || "submission"}
                    className="absolute inset-0 w-full h-full object-cover rounded-[12px]"
                  />
                ) : null}
              </div>

              {/* 제목 */}
              <span className="block mt-[20px] ml-[16px] pr-[8px] truncate font-semibold">
                {s.title || "제목 없음"}
              </span>
            </div>
          );
        })}
      </div>

      {/* 하단 버튼 영역 */}
      {!hasVoted ? (
        !isSelecting ? (
          <button
            className="mb-[80px] mt-[80px] border w-[180px] h-[45px] rounded-[8px] px-[20px] text-white bg-[#212121] text-[16px] flex items-center justify-center"
            onClick={() => setIsSelecting(true)}
            disabled={items.length === 0}
          >
            투표 시작하기
          </button>
        ) : (
          <div className="flex items-center gap-[12px] mt-[80px] mb-[80px]">
            <button
              className="flex justify-center items-center border w-[180px] h-[45px] rounded-[8px] bg-white text-[#212121] border-[#E1E1E1] px-[20px]"
              onClick={() => {
                setIsSelecting(false);
                setSelected(null);
              }}
            >
              취소
            </button>
            <button
              className={`w-[180px] h-[45px] rounded-[8px] text-white flex justify-center items-center px-[20px] ${
                !selected ? "bg-[#A3A3A3] cursor-not-allowed" : "bg-[#212121]"
              }`}
              disabled={!selected}
              onClick={() => setOpenConfirm(true)}
            >
              투표하기
            </button>
          </div>
        )
      ) : (
        <button
          className="mb-[80px] mt-[80px] w-[180px] h-[45px] rounded-[8px] px-[20px] text-white bg-[#E1E1E1] text-[16px] cursor-not-allowed"
          disabled
        >
          이미 투표했어요
        </button>
      )}

      {/* 확인 모달 */}
      <VoteConfirmModal
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleConfirm}
        submission={selected}
      />
    </div>
  );
};

export default ParticipantVoteGrid;

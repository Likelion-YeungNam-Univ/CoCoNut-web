import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BsCheckCircleFill } from "react-icons/bs";
import { IoPersonCircle } from "react-icons/io5";
import vote1 from "../assets/vote1.png";
import vote2 from "../assets/vote2.png";
import vote3 from "../assets/vote3.png";
import VoteConfirmModal from "./VoteConfirmModal";
import { getProjectVotes } from "../apis/votesApi";
import { selectWinner } from "../apis/rewardsApi";
import { Link } from "react-router-dom";

const REFRESH_MS = 10000;

const fmtYMD = (s) => {
  if (!s) return "-";
  try {
    const d = new Date(s);
    if (isNaN(d)) return s;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}.${m}.${dd}`;
  } catch {
    return s;
  }
};

const RankBadge = ({ rank, votes }) => {
  if (!rank) return null;
  const icon = rank === 1 ? vote1 : rank === 2 ? vote2 : vote3;

  return (
    <div
      className="
        absolute top-2 left-2 z-10
        flex items-center gap-[8px]
        rounded-[20px] px-[10px] h-[28px]
        bg-[#212121] text-[#2FD8F6] font-semibold text-[14px]
        shadow-[0_2px_6px_rgba(0,0,0,0.25)]
      "
    >
      <img src={icon} alt={`${rank}등`} className="w-[16px] h-[16px]" />
      <span>{votes}표</span>
    </div>
  );
};
export default function MerchantVoteManage({
  projectId,
  submissions = [], // [{submissionId, title, writerNickname, imageUrl}]
  voteStartDate,
  voteEndDate,
  winnerSubmissionId: winnerFromServer = null,
  onWinnerSelected, // (winnerId)=>void
}) {
  // 서버 투표수 섞어 넣은 목록
  const [items, setItems] = useState(
    submissions.map((s) => ({
      ...s,
      voteCount: typeof s.voteCount === "number" ? s.voteCount : 0,
    }))
  );
  const [totalVotes, setTotalVotes] = useState(0);

  // 선택/확정 흐름
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);

  // 우승작 상태(서버값 우선)
  const [winnerId, setWinnerId] = useState(winnerFromServer);

  // 투표수 로딩
 const loadVotes = useCallback(async () => {
  try {
     const data = await getProjectVotes(projectId);

     // 응답을 배열/객체/래핑(data) 모두 지원
     const toArray = (d) => {
       if (Array.isArray(d)) return d;
       if (Array.isArray(d?.results)) return d.results;
       if (Array.isArray(d?.data)) return d.data;
       return [];
     };
     const rows = toArray(data);

     // 🔑 voteCount / votes / count 모두 지원
     const counts = new Map(
       rows.map((r) => [
         r.submissionId ?? r.id,
         Number(r.voteCount ?? r.votes ?? r.count ?? 0),
       ])
     );

     // 🔁 최신 submissions 기준으로 재구성 (prev.map 쓰지 않음)
     setItems(
       submissions.map((s) => ({
         ...s,
         voteCount: counts.get(s.submissionId ?? s.id) ?? 0,
       }))
     );

     const total =
       typeof data?.totalVotes === "number"
         ? data.totalVotes
         : rows.reduce(
             (sum, r) =>
               sum + Number(r.voteCount ?? r.votes ?? r.count ?? 0),
             0
           );
     setTotalVotes(total);
   } catch (e) {
     console.error("getProjectVotes failed:", e);
   }
 // ⬅ submissions도 의존성에 포함 (비동기 로딩 후 재계산)
 }, [projectId, submissions]);

  useEffect(() => {
    loadVotes();
    const t = setInterval(loadVotes, REFRESH_MS);
    return () => clearInterval(t);
  }, [loadVotes]);

  // top3 표시
  const top3ById = useMemo(() => {
    const ranked = [...items].sort(
      (a, b) => (b.voteCount || 0) - (a.voteCount || 0)
    );
    const map = new Map();
    ranked
      .slice(0, 3)
      .forEach((it, idx) =>
        map.set(it.submissionId, { rank: idx + 1, votes: it.voteCount || 0 })
      );
    return map;
  }, [items]);

  const onCardClick = (id) => {
    if (!isSelecting) return;
    setSelectedId((prev) => (prev === id ? null : id)); // 단일선택
  };

  const confirmWinner = async () => {
    if (!selectedId) return;
    try {
      await selectWinner(projectId, selectedId); // 서버 확정
      setWinnerId(selectedId); // 로컬 우승 모드
      setIsSelecting(false);
      setOpenConfirm(false);
      onWinnerSelected?.(selectedId);   // 부모에 우승작 id만 전달
  window.scrollTo({ top: 0, behavior: "smooth" }); // 선택사항: 화면 상단으로 스크롤
    } catch (e) {
      console.error("selectWinner failed:", e);
      alert("수상작 선정에 실패했어요. 잠시 후 다시 시도해 주세요.");
    }
  };

  // ⬇️ 우승작 뷰 (4번째 이미지)
  if (winnerId) {
  const winner =
    items.find((it) => it.submissionId === winnerId) ||
    submissions.find((it) => it.submissionId === winnerId);
  const others = items.filter((it) => it.submissionId !== winnerId);

  return (
    <div className="font-pretendard flex flex-col items-center">
      {/* 상단 안내 */}
      <div className="flex flex-col mt-[80px] items-center text-center gap-[8px]">
        <div className="text-[20px] font-semibold">수상작 선정이 완료되었습니다.🎉</div>
        <div className="text-[14px] text-[#A3A3A3]">선정하신 수상작은 모든 사용자에게 공개됩니다</div>

        <div className="flex flex-row items-center gap-[16px] border bg-[#E0F9FE] border-[#E0F9FE] rounded-[24px] justify-center text-[16px] text-[#26ADC5] px-[16px] py-[10px]">
          <div>닉네임 님의 작품이 수상작으로 선정되었습니다. 프로필 내 연락처를 통해 거래를 완료해주세요</div>
          {/*  경로는 실제 라우트로 바꿔야함 */}
          <Link className="font-semibold underline" to="/profile">프로필로 가기</Link>
        </div>
      </div>

      {/* 우승작 크게 */}
      <div className="w-[720px] max-w-[90vw] mt-[24px]">
        <div className="relative rounded-[12px] bg-[#EBEBEB] border border-[#EDEDED] overflow-hidden h-[420px]">
          {winner?.imageUrl ? (
            <img
              src={winner.imageUrl}
              alt={winner?.title ?? "winner"}
              className="w-full h-full object-cover"
            />
          ) : null}
          <div className="absolute left-4 bottom-4 right-4">
            <div className="flex items-center gap-2 text-[14px] text-white/80">
              <IoPersonCircle size={24} />
              <span>{winner?.writerNickname || "참가자 닉네임"}</span>
            </div>
            <div className="mt-[6px] text-[18px] font-semibold text-white truncate">
              {winner?.title || "제목 없음"}
            </div>
          </div>
        </div>
      </div>

      {/* 나머지 썸네일 */}
      <div className="grid grid-cols-4 gap-[24px] mt-[32px]">
        {others.map((it) => (
          <div
            key={it.submissionId}
            className="border border-[#E1E1E1] rounded-[12px] w-[240px] h-[306px]"
          >
            <div className="relative border border-[#EBEBEB] w-[240px] h-[240px] rounded-[12px] bg-[#EBEBEB] overflow-hidden">
              {it.imageUrl ? (
                <img
                  src={it.imageUrl}
                  className="w-full h-full object-cover"
                  alt={it.title}
                />
              ) : null}
            </div>
            <span className="block mt-[20px] ml-[16px] font-semibold truncate">
              {it.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}


  // ⬇️ 기본/선택 모드 (1~3번째 이미지)
  return (
    <div className="font-pretendard flex flex-col items-center ">
     <div className="mt-2 text-center w-full">
    {/* ⬇️ 고정폭 + 가운데 정렬 */}
    <div className="flex flex-row justify-center border rounded-[24px] bg-[#E0F9FE] text-[#26ADC5] border-[#E0F9FE] px-[5px] py-[8px] text-[14px] gap-[8px] w-[255px] mx-auto">
      <div className="font-semibold">투표 기간</div>
      <div>{fmtYMD(voteStartDate)} - {fmtYMD(voteEndDate)}</div>
    </div>
        <div className="mt-[20px] flex justify-center items-center text-[24px] font-semibold text-[#212121]">지금까지 {totalVotes?.toLocaleString()}명이 투표에 참여했어요!</div>
        <div className="mt-[8px] text-[14px] text-[#A3A3A3]">투표를 통해 지역의 목소리가 반영된 순위를 확인할 수 있어요.</div>
        
      </div>

      <div className="mt-[28px] grid grid-cols-4 gap-[24px]">
        {items.map((it) => {
          const badge = top3ById.get(it.submissionId);
          const selected = selectedId === it.submissionId;
          return (
            <div
              key={it.submissionId}
              onClick={() => onCardClick(it.submissionId)}
              className={`border border-[#E1E1E1] rounded-[12px] w-[240px] h-[306px]
                ${isSelecting ? "cursor-pointer hover:ring-2 hover:ring-[#2FD8F6]" : ""}
                ${selected ? "ring-2 ring-[#2FD8F6]" : ""}`}
            >
              <div className="relative border border-[#EBEBEB] w-[240px] h-[240px] rounded-[12px] bg-[#EBEBEB] overflow-hidden">
                {badge ? (
                  <RankBadge rank={badge.rank} votes={badge.votes} />
                ) : null}
                {it.imageUrl ? (
                  <img
                    src={it.imageUrl}
                    className="w-full h-full object-cover"
                    alt={it.title}
                  />
                ) : null}

                {isSelecting && selected && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BsCheckCircleFill size={56} color="#2FD8F6" />
                  </div>
                )}
              </div>
              <span className="block mt-[20px] ml-[16px] font-semibold truncate">
                {it.title}
              </span>
            </div>
          );
        })}
      </div>

      {!isSelecting ? (
        <button
          className="mb-[60px] mt-[32px] border w-[180px] h-[45px] rounded-[8px] text-white bg-[#212121] text-[16px] flex items-center justify-center"
          onClick={() => setIsSelecting(true)}
        >
          수상작 선정하기
        </button>
      ) : (
        <div className="flex items-center gap-[12px] mt-[32px] mb-[60px]">
          <button
            className="flex justify-center items-center border w-[180px] h-[45px] rounded-[8px] bg-white text-[#212121] border-[#E1E1E1]"
            onClick={() => {
              setIsSelecting(false);
              setSelectedId(null);
            }}
          >
            취소
          </button>
          <button
            className={`w-[180px] h-[45px] rounded-[8px] text-white flex justify-center items-center
              ${!selectedId ? "bg-[#A3A3A3] cursor-not-allowed" : "bg-[#212121]"}`}
            disabled={!selectedId}
            onClick={() => setOpenConfirm(true)}
          >
            선정하기
          </button>
        </div>
      )}

      <VoteConfirmModal
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={confirmWinner}
        submission={items.find((it) => it.submissionId === selectedId)}
        title="이 작품을 수상작으로 선정하시겠습니까?"
        description="선정하신 이후에는 변경할 수 없어요."
        confirmText="선정하기"
        cancelText="취소"
      />
    </div>
  );
}

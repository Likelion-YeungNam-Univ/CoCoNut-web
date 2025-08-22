// src/components/ParticipantVoteManage.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { IoPersonCircle } from "react-icons/io5";
import vote1 from "../assets/vote1.png";
import vote2 from "../assets/vote2.png";
import vote3 from "../assets/vote3.png";
 import { getProjectVotes, normalizeProjectVotes } from "../apis/votesApi";

const REFRESH_MS = 10000;

const toKey = (v) => {
  if (v === null || v === undefined) return "";
  const n = Number(v);
  return Number.isFinite(n) ? String(n) : String(v);
};

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

const RankBadge = ({ rank, votes, variant = "voting" }) => {
  if (!rank) return null;
  const icon = rank === 1 ? vote1 : rank === 2 ? vote2 : vote3;
  const isResult = variant === "result";
  return (
    <div
      className={`absolute top-2 left-2 z-10 flex items-center gap-[8px] rounded-[20px]
        ${isResult ? "px-[12px] h-[40px] w-[91px] text-[16px]" : "px-[10px] h-[28px] text-[14px]"}
        bg-[#212121] text-[#2FD8F6] font-semibold`}
    >
      <img
        src={icon}
        alt={`${rank}등`}
        className={isResult ? "w-[24px] h-[24px]" : "w-[16px] h-[16px]"}
      />
      <span>{votes}표</span>
    </div>
  );
};

export default function ParticipantVoteManage({
  projectId,
  submissions = [], // [{submissionId, title, writerNickname, imageUrl, voteCount?}]
  voteStartDate,
  voteEndDate,
  winnerSubmissionId: winnerFromServer = null,
  projectStatus, // "IN_PROGRESS" | "VOTING" | "CLOSED"
}) {
  // 기본 아이템 (표수 0으로 시작)
  const [items, setItems] = useState(
    submissions.map((s) => ({
      ...s,
      submissionId: toKey(s.submissionId),
      voteCount: typeof s.voteCount === "number" ? s.voteCount : 0,
    }))
  );
  const [totalVotes, setTotalVotes] = useState(0);

  // submissions 변경 시 동기화
  useEffect(() => {
    setItems(
      submissions.map((s) => ({
        ...s,
        submissionId: toKey(s.submissionId),
        voteCount: typeof s.voteCount === "number" ? s.voteCount : 0,
      }))
    );
  }, [submissions]);

  // 서버 우선 수상작 ID
  const [winnerId, setWinnerId] = useState(
    winnerFromServer != null ? toKey(winnerFromServer) : null
  );
  useEffect(() => {
    setWinnerId(winnerFromServer != null ? toKey(winnerFromServer) : null);
  }, [winnerFromServer]);

  // 마감 여부 (서버 상태 최우선 → 없으면 날짜로 판단)
  const isVoteClosed = useMemo(() => {
    if (projectStatus) return String(projectStatus).toUpperCase() === "CLOSED";
    if (!voteEndDate) return true;
    try {
      const end = new Date(`${voteEndDate}T23:59:59`);
      return Date.now() > end.getTime();
    } catch {
      return true;
    }
  }, [projectStatus, voteEndDate]);


  const loadVotes = useCallback(async () => {
    if (!projectId) return;
    try {
      const raw = await getProjectVotes(projectId);
      const { results, totalVotes } = normalizeProjectVotes(raw);

      // id → votes 맵
      const map = new Map(
        results.map((r) => [toKey(r.submissionId), typeof r.votes === "number" ? r.votes : 0])
      );

      // 현재 submissions 기준으로 병합
      setItems(
        submissions.map((s) => {
          const id = toKey(s.submissionId);
          const votes = map.get(id);
          return {
            ...s,
            submissionId: id,
            voteCount: typeof votes === "number" ? votes : 0,
          };
        })
      );
      setTotalVotes(typeof totalVotes === "number" ? totalVotes : 0);
    } catch (e) {
      // 실패 시 조용히 유지 (필요하면 console.warn 활성화)
      // console.warn("loadVotes error:", e);
    }
  }, [projectId, submissions]);

  useEffect(() => {
    loadVotes();
    // 수상작 확정 전까지만 폴링
    if (!winnerId) {
      const t = setInterval(loadVotes, REFRESH_MS);
      return () => clearInterval(t);
    }
  }, [loadVotes, winnerId]);

  // 표수 내림차순 정렬
  const ranked = useMemo(
    () => [...items].sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0)),
    [items]
  );

  // 상위 3위 정보
  const top3Map = useMemo(() => {
    const m = new Map();
    ranked.slice(0, 3).forEach((it, idx) =>
      m.set(toKey(it.submissionId), { rank: idx + 1, votes: it.voteCount || 0 })
    );
    return m;
  }, [ranked]);

  // 공통 카드
  const Card = ({ s, dimmed = false, rankInfo = null, badgeVariant = "voting" }) => {
    return (
      <div className="w-[240px] h-[306px] flex flex-col rounded-xl border border-gray-200 overflow-hidden bg-white">
        <div className="relative h-[300px] bg-gray-100 flex items-center justify-center overflow-hidden">
          {rankInfo ? (
            <RankBadge rank={rankInfo.rank} votes={rankInfo.votes} variant={badgeVariant} />
          ) : null}
          {s?.imageUrl ? (
            <img
              src={s.imageUrl}
              alt={s?.title ?? "submission"}
              className={`w-full h-full object-cover ${
                dimmed ? "opacity-10" : "opacity-100"
              } transition-opacity`}
            />
          ) : (
            <div className="text-gray-400 text-sm">이미지 없음</div>
          )}
        </div>

     
        <div className="p-3">
          
          <div className="ml-[16px] mt-[6px] text-[16px] font-semibold truncate">
            {s?.title ?? "-"}
          </div>
        
        </div>
      </div>
    );
  };

  // ── 수상작 발표 화면 ──
  if (winnerId) {
    const winner =
      items.find((it) => toKey(it.submissionId) === toKey(winnerId)) ||
      submissions
        .map((s) => ({ ...s, submissionId: toKey(s.submissionId) }))
        .find((it) => it.submissionId === toKey(winnerId));
    const others = items.filter((it) => toKey(it.submissionId) !== toKey(winnerId));

    return (
      <div className="font-pretendard">
        <div className="flex flex-col items-center">
          <span className="mt-5 text-[24px] font-semibold">최종 수상작이 발표되었습니다! 🏆</span>
          <p className="mt-2 text-[#A3A3A3] text-[14px]">
            모든 참가자와 투표자분들께 감사드립니다.
          </p>
        </div>

        {/* 수상작 크게 */}
        <div className="mt-10 rounded-2xl border border-gray-200 bg-white overflow-hidden">
          <div className="mx-auto aspect-square max-w-[1032px] w-full bg-gray-100 overflow-hidden">
            {winner?.imageUrl ? (
              <img
                src={winner.imageUrl}
                alt={winner?.title || "winner"}
                className="block w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-gray-400">
                이미지 없음
              </div>
            )}
          </div>

          {/* 이미지 '아래' 닉네임/제목 */}
          <div className="p-6">
            <div className="flex items-center gap-2 text-[16px] text-[#6B7280] justify-center">
              <IoPersonCircle size={22} />
              <span className="truncate">{winner?.writerNickname || "참가자"}</span>
            </div>
            <div className="mt-[6px] text-[20px] font-semibold text-center truncate">
              {winner?.title || "제목 없음"}
            </div>
          </div>
        </div>

        {/* 나머지 제출물 (결과 뱃지 크기) */}
        {others.length > 0 && (
          <div className="flex flex-wrap gap-6 mt-[80px]">
            {others.map((s) => (
              <Card
                key={s.submissionId}
                s={s}
                dimmed
                rankInfo={top3Map.get(toKey(s.submissionId))}
                badgeVariant="result"
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── 마감됐지만 수상작 미선정 → 결과 화면 ──
  if (isVoteClosed) {
    return (
      <div className="font-pretendard">
        <div className="flex flex-col items-center  mt-[80px]">
          <div className="text-[14px] text-[#26ADC5] border bg-[#E0F9FE] border-[#E0F9FE] rounded-[20px] w-[255px] h-[34px] flex gap-[8px] items-center justify-center mr-4">
            <span>선정 기간 </span>
            <span className="font-semibold">{fmtYMD(voteStartDate)} - {fmtYMD(voteEndDate)}</span>
          </div>
          <h2 className="mt-5 text-2xl font-semibold">투표 결과가 발표되었습니다! 🎉</h2>
          <p className="mt-2 text-gray-500 text-sm">
            현재 수상작 선정이 진행 중입니다. 잠시만 기다려주세요.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-4  gap-[24px]">
          {ranked.map((s) => (
            <Card
              key={s.submissionId}
              s={s}
              rankInfo={top3Map.get(toKey(s.submissionId))}
              badgeVariant="result"
            />
          ))}
        </div>

        <div className="mt-[80px] flex justify-center">
          <button
            disabled
            className="border rounded-[8px] bg-[#E1E1E1] text-white w-[180px] h-[45px] border-[#E1E1E1]"
          >
            투표 마감
          </button>
        </div>
      </div>
    );
  }

  // 진행중 (안전 메시지)
  return (
    <div className="font-pretendard text-center text-gray-500">
      현재 투표가 진행 중입니다. 잠시 후 결과가 공개됩니다.
    </div>
  );
}

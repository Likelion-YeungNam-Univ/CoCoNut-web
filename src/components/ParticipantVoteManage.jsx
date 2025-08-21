// src/components/ParticipantVoteManage.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { IoPersonCircle } from "react-icons/io5";
import vote1 from "../assets/vote1.png";
import vote2 from "../assets/vote2.png";
import vote3 from "../assets/vote3.png";
import { getProjectVotes, normalizeProjectVotes } from "../apis/votesApi";
import { Link } from "react-router-dom";

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

export default function ParticipantVoteManage({
  projectId,
  submissions = [],                         // [{submissionId, title, writerNickname, imageUrl}]
  voteStartDate,
  voteEndDate,
  winnerSubmissionId: winnerFromServer = null,
}) {
  // 서버 집계 주입용 로컬 상태
  const [items, setItems] = useState(
   submissions.map((s) => ({
     ...s,
     // 🔑 id는 문자열로 통일
     submissionId: toKey(s.submissionId),
     voteCount: typeof s.voteCount === "number" ? s.voteCount : 0,
   }))
 );

  const [totalVotes, setTotalVotes] = useState(0);

  // 수상작 ID (서버에서 오면 반영)
  const [winnerId, setWinnerId] = useState(
   winnerFromServer != null ? toKey(winnerFromServer) : null
 );
  useEffect(() => {
    setWinnerId(winnerFromServer != null ? toKey(winnerFromServer) : null);
  }, [winnerFromServer]);

  const isVoteClosed = useMemo(() => {
    if (!voteEndDate) return true; // 날짜가 없으면 마감으로 간주
    try {
      return new Date(voteEndDate).getTime() < Date.now();
    } catch {
      return true;
    }
  }, [voteEndDate]);

  // 집계 로딩
  const loadVotes = useCallback(async () => {
    if (!projectId) return;
    try {
      const raw = await getProjectVotes(projectId);
      const { results, totalVotes } = normalizeProjectVotes(raw);
 const map = new Map(results.map((r) => [toKey(r.submissionId), r.votes || 0]));
      setItems((prev) =>
        prev.map((s) => ({ ...s, voteCount: map.get(toKey(s.submissionId)) || 0 }))
      );
      setTotalVotes(typeof totalVotes === "number" ? totalVotes : 0);
    } catch (e) {
      // 네트워크/서버 오류는 무시하고 UI 유지
      // console.error(e);
    }
  }, [projectId]);

  useEffect(() => {
    loadVotes();
    // 수상작이 확정되면 실시간 갱신은 멈춰도 됨(고정 화면)
    if (!winnerId) {
      const t = setInterval(loadVotes, REFRESH_MS);
      return () => clearInterval(t);
    }
  }, [loadVotes, winnerId]);

  // 랭킹/상위3 계산
  const ranked = useMemo(
    () => [...items].sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0)),
    [items]
  );
  const top3 = ranked.slice(0, 3).map((it, idx) => ({
    submissionId: it.submissionId,
    rank: idx + 1,
  }));
  const top3Map = useMemo(
    () => new Map(top3.map((t) => [t.submissionId, t.rank])),
    [top3]
  );

const Card = ({ s, dimmed = false }) => {
  return (
    <div className="w-[240px] h-[360px] flex flex-col rounded-xl border border-gray-200 overflow-hidden bg-white">
      <div className="h-[300px] bg-gray-100 flex items-center justify-center overflow-hidden">
        {s?.imageUrl ? (
          <img
            src={s.imageUrl}
            alt={s?.title ?? "submission"}
            className={`w-full h-full object-cover ${dimmed ? "opacity-10" : "opacity-100"} transition-opacity`}
          />
        ) : (
          <div className="text-gray-400 text-sm">이미지 없음</div>
        )}
      </div>

      <div className="p-3">
        <div className="text-[16px] font-semibold">{s?.title ?? "-"}</div>
      </div>
    </div>
  );
};




  // 수상작 뷰
 if (winnerId) {
   // items에서 못찾으면 submissions에서도 한 번 더 시도
   const winner =
     items.find((it) => toKey(it.submissionId) === toKey(winnerId)) ||
     submissions
       .map((s) => ({ ...s, submissionId: toKey(s.submissionId) }))
       .find((it) => it.submissionId === toKey(winnerId));
   const others = items.filter((it) => toKey(it.submissionId) !== toKey(winnerId));

    return (
      <div className="font-pretendard">
        < div className="flex flex-col items-center">
          <span className="mt-5 text-[24px] font-semibold">최종 수상작이 발표되었습니다! 🏆</span>
          <p className="mt-2 text-[#A3A3A3] text-[14px]">
            모든 참가자 여러분과 투표에 참여해 주신 분들께 감사드립니다.
          </p>
  
        </div>
        

        {/* 수상작 큰 카드 */}
        <div className="mt-10 rounded-2xl border border-gray-200 bg-white overflow-hidden">
          <div className="w-[1032px] h-[1032px] bg-gray-100 flex items-center justify-center overflow-hidden">
            {winner?.imageUrl ? (
              <img src={winner.imageUrl} alt={winner?.title || "winner"} className="w-full h-full object-cover" />
            ) : (
              <div className="text-gray-400">이미지 없음</div>
            )}
          </div>
          <div className="p-6 text-center">
  
          </div>
          
        </div>
         <div className="text-xl font-semibold flex items-center justify-center mt-[28px]">{winner?.title || "-"}</div>
            <div className="mt-2 flex items-center justify-center text-gray-500">
              <IoPersonCircle className="mr-1" size={24} />
              {winner?.writerNickname || "익명"}
            </div>
        {/* 나머지 제출물 */}
        {others.length > 0 && (
          <>
            <div className="flex flex-wrap gap-6 mt-[80px]">
              {others.map((s) => (
                <Card key={s.submissionId} s={s} dimmed />
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  // 투표 마감 & 아직 수상 미선정 → 랭킹/표수 화면
  if (isVoteClosed) {
    return (
      <div className="font-pretendard">
        <div className="flex flex-col items-center">
          <div className="text-xs text-teal-500 bg-teal-50 border border-teal-200 rounded-full px-3 py-1">
            선정 기간 {fmtYMD(voteStartDate)} - {fmtYMD(voteEndDate)}
          </div>
          <h2 className="mt-5 text-2xl font-semibold">투표 결과가 발표되었습니다! 🎉</h2>
          <p className="mt-2 text-gray-500 text-sm">
            현재 수상작 선정이 진행 중입니다. 조금만 기다려주세요.
          </p>
        </div>

        {/* 상위 3개 뱃지 + 전체 리스트 */}
        <div className="mt-10 grid grid-cols-4 gap-6">
          {ranked.map((s) => (
            <Card key={s.submissionId} s={s} />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <button
            disabled
            className="px-5 py-2 rounded-md bg-gray-200 text-gray-500 cursor-not-allowed"
          >
            투표 마감
          </button>
        </div>
      </div>
    );
  }

  // 안전장치: 혹시 투표 진행 중에 이 컴포넌트가 렌더될 경우
  return (
    <div className="font-pretendard text-center text-gray-500">
      현재 투표가 진행 중입니다. 잠시 후 결과가 공개됩니다.
    </div>
  );
}

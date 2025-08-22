// src/components/ParticipantVoteGrid.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { BsCheckCircleFill } from "react-icons/bs";
import VoteConfirmModal from "./VoteConfirmModal";
import vote1 from "../assets/vote1.png";
import vote2 from "../assets/vote2.png";
import vote3 from "../assets/vote3.png";
import { getProjectVotes, voteSubmission } from "../apis/votesApi";

const REFRESH_MS = 10000;

const ParticipantVoteGrid = ({
  projectId,
  userId,
  mySubmissionId = null,
  submissions = [],
  voteStartDate,
  voteEndDate,
  onVote,
  initialTotalVotes = 0,
  forceOpen = false,
}) => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selected, setSelected] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [checking, setChecking] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);

  // 투표 기간
  const timeWindowOpen = useMemo(() => {
    if (!voteStartDate || !voteEndDate) return true;
    const now = Date.now();
    return (
      now >= new Date(voteStartDate).getTime() &&
      now <= new Date(voteEndDate).getTime()
    );
  }, [voteStartDate, voteEndDate]);
  const canVote = forceOpen || timeWindowOpen;

  // 로컬 키(오직 사용자별)
  const votedKey = useMemo(
    () =>
      userId && projectId ? `voted:${String(userId)}:${String(projectId)}` : null,
    [userId, projectId]
  );

  // 초기: userId가 준비된 뒤 로컬 키 확인
  useEffect(() => {
    if (!votedKey) return;
    try {
      if (localStorage.getItem(votedKey) === "1") setHasVoted(true);
    } catch {}
  }, [votedKey]);

  // 카드/표 수 상태
  const [items, setItems] = useState(
    submissions.map((s) => ({
      ...s,
      voteCount: typeof s.voteCount === "number" ? s.voteCount : 0,
    }))
  );

  const totalKey = projectId ? `voteTotal:${projectId}` : null;
  const [totalVotes, setTotalVotes] = useState(() => {
    const cached = totalKey ? sessionStorage.getItem(totalKey) : null;
    return cached ? Number(cached) : initialTotalVotes;
  });

  useEffect(() => {
    setItems((prev) =>
      submissions.map((s) => {
        const key = s.submissionId ?? s.id;
        const old = prev.find((it) => (it.submissionId ?? it.id) === key);
        return {
          ...s,
          voteCount:
            typeof old?.voteCount === "number"
              ? old.voteCount
              : typeof s.voteCount === "number"
              ? s.voteCount
              : 0,
        };
      })
    );
  }, [submissions]);

  // 서버 집계 + 내 투표 여부
  const loadProjectVotes = useCallback(async () => {
    if (!projectId) return;
    try {
      const data = await getProjectVotes(projectId);

      const toArray = (d) => {
        if (Array.isArray(d)) return d;
        if (Array.isArray(d?.results)) return d.results;
        if (Array.isArray(d?.data)) return d.data;
        return [];
      };
      const rows = toArray(data);

      const counts = new Map(
        rows.map((r) => [
          r.submissionId ?? r.id,
          Number(r.voteCount ?? r.votes ?? r.count ?? 0),
        ])
      );

      setItems((prev) =>
        prev.map((it) => ({
          ...it,
          voteCount: counts.get(it.submissionId ?? it.id) ?? (it.voteCount ?? 0),
        }))
      );

      const total =
        typeof data?.totalVotes === "number"
          ? data.totalVotes
          : rows.reduce(
              (sum, r) => sum + Number(r.voteCount ?? r.votes ?? r.count ?? 0),
              0
            );
      setTotalVotes(total);
      if (totalKey) sessionStorage.setItem(totalKey, String(total));

      const serverHasVoted = Boolean(
        data?.myVoteSubmissionId ??
          data?.my_vote_submission_id ?? // 백엔드 snake_case 대비
          data?.hasVoted ??
          data?.has_voted ??
          data?.voted ??
          (data?.myVote && data.myVote.submissionId) ??
          (data?.my_vote && data.my_vote.submission_id)
      );

     setHasVoted(serverHasVoted);
if (votedKey) {
  if (serverHasVoted) localStorage.setItem(votedKey, "1");
  else localStorage.removeItem(votedKey);
}
    } catch (e) {
      console.error("loadProjectVotes failed:", e);
    } finally {
      setChecking(false);
    }
  }, [projectId, totalKey, votedKey]);

  // userId가 준비되어야 최종 판단 가능
  useEffect(() => {
    if (!userId) return; // 로그인 정보 대기
    setChecking(true);
    loadProjectVotes();
  }, [userId, loadProjectVotes]);

  // 투표 중이면 주기적 새로고침
  useEffect(() => {
    if (!canVote) return;
    const t = setInterval(loadProjectVotes, REFRESH_MS);
    return () => clearInterval(t);
  }, [canVote, loadProjectVotes]);

  const votePeriodLabel =
    voteStartDate && voteEndDate ? `${voteStartDate} - ${voteEndDate}` : null;

  const keyOf = (s) => s?.submissionId ?? s?.id;

  const handleCardClick = (s) => {
    if (!isSelecting || hasVoted || checking) return;
    const nextKey = keyOf(s);
    if (mySubmissionId && String(nextKey) === String(mySubmissionId)) {
      alert("본인 작품에는 투표할 수 없습니다.");
      return;
    }
    const curKey = keyOf(selected);
    setSelected(curKey === nextKey ? null : s);
  };

  const handleConfirm = async () => {
    if (!selected) return;
    if (!canVote) {
      alert("지금은 투표 기간이 아닙니다.");
      setOpenConfirm(false);
      return;
    }

    const selKey = keyOf(selected);
    if (mySubmissionId && String(selKey) === String(mySubmissionId)) {
      alert("본인 작품에는 투표할 수 없습니다.");
      setOpenConfirm(false);
      return;
    }

    try {
      await voteSubmission(selKey);

      // 낙관적 업데이트
      setItems((prev) =>
        prev.map((it) =>
          keyOf(it) === selKey ? { ...it, voteCount: (it.voteCount ?? 0) + 1 } : it
        )
      );
      setTotalVotes((v) => {
        const next = v + 1;
        if (totalKey) sessionStorage.setItem(totalKey, String(next));
        return next;
      });

      setHasVoted(true);
      setIsSelecting(false);
      setSelected(null);
      setOpenConfirm(false);

      if (votedKey) localStorage.setItem(votedKey, "1");
      if (typeof onVote === "function") onVote(selected);
  } catch (e) {
  console.error("voteSubmission failed:", e);
  const resp = e?.response;
  const dup = resp?.status === 409;

  // 서버가 내려주는 메시지 우선 사용, 없으면 기본 문구
  const serverMsg = resp?.data?.message;
  const msg = dup
    ? (serverMsg || "해당 공모전에 대한 작품에 이미 투표하셨습니다.")
    : (serverMsg || "투표에 실패했습니다. 잠시 후 다시 시도해 주세요.");

  alert(msg);

  if (dup) {
    // 즉시 '이미 투표했어요' 상태로 전환
    setHasVoted(true);
    setIsSelecting(false);
    setSelected(null);
    setOpenConfirm(false);
    if (votedKey) localStorage.setItem(votedKey, "1");

    // 최신 집계 반영(표 수 등)
    await loadProjectVotes();
    return; // 여기서 종료
  }

  setOpenConfirm(false);
  await loadProjectVotes();
}

  };

  const top3Map = useMemo(() => {
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
      <div className="absolute top-3 left-3 z-20 flex justify-center items-center rounded-[20px] bg-[#212121] border border-[#212121] w-[94px] h-[40px]">
        <img className="mr-[8px]" src={icon} alt={`${rank}위`} />
        <span className="font-semibold text-[16px] text-[#2FD8F6]">{votes}표</span>
      </div>
    );
  };

  const isStartDisabled =
    checking || !userId || items.length === 0 || !canVote || hasVoted;

  return (
    <div className="font-pretendard flex flex-col items-center">
      {votePeriodLabel && (
        <span className="border border-[#E0F9FE] bg-[#E0F9FE] text-[#26ADC5] font-semibold text-[14px] pt-[8px] pb-[8px] rounded-[24px] w-[255px] h-[34px] mt-[80px] flex gap-[8px] items-center justify-center">
          <span className="font-medium">투표 기간</span>
          {votePeriodLabel}
        </span>
      )}

      {!hasVoted ? (
        <>
          <span className="text-[24px] font-semibold mt-[20px]">
            {checking ? "투표 여부 확인 중..." : "마음에 드는 작품에 투표해 주세요!"}
          </span>
          {!checking && (
            <span className="mt-[8px] text-[14px] text-[#A3A3A3]">
              여러분의 한 표가 수상작 선정에 큰 도움이 됩니다.
            </span>
          )}
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

      <div className="mt-[60px] grid grid-cols-4 gap-[24px]">
        {items.map((s, idx) => {
          const key = s.submissionId ?? s.id ?? idx;
          const isSelected = (selected?.submissionId ?? selected?.id) === (s.submissionId ?? s.id);
          const rankInfo = top3Map.get(s.submissionId ?? s.id);

          return (
            <div
              key={key}
              onClick={() => handleCardClick(s)}
              className={`border border-[#E1E1E1] rounded-[12px] w-[240px] h-[306px] ${
                isSelecting && !hasVoted && !checking
                  ? "cursor-pointer hover:ring-2 hover:ring-[#2FD8F6]"
                  : "cursor-default"
              } ${isSelected && !hasVoted ? "ring-2 ring-[#2FD8F6]" : ""}`}
            >
              <div className="relative border border-[#EBEBEB] w-[240px] h-[240px] rounded-[12px] bg-[#EBEBEB] overflow-hidden">
                {s?.imageUrl ? (
                  <img
                    src={s.imageUrl}
                    alt={s.title || "submission"}
                    className="absolute inset-0 w-full h-full object-cover rounded-[12px] z-0"
                  />
                ) : null}
                {rankInfo && (
                  <div className="absolute top-3 left-3 z-20">
                    <RankBadge rank={rankInfo.rank} votes={rankInfo.votes} />
                  </div>
                )}
                {isSelecting && !hasVoted && !checking && isSelected && (
                  <div className="absolute inset-0 z-30 flex items-center justify-center">
                    <BsCheckCircleFill size={56} color="#2FD8F6" />
                  </div>
                )}
              </div>
              <span className="block mt-[20px] ml-[16px] pr-[8px] truncate font-semibold">
                {s.title || "제목 없음"}
              </span>
            </div>
          );
        })}
      </div>

      {!hasVoted ? (
        !isSelecting ? (
          <button
            className={`mb-[80px] mt-[80px] border w-[180px] h-[45px] rounded-[8px] px-[20px] text-white text-[16px] flex items-center justify-center ${
              isStartDisabled ? "bg-[#A3A3A3] cursor-not-allowed" : "bg-[#212121]"
            }`}
            onClick={() => setIsSelecting(true)}
            disabled={isStartDisabled}
          >
            {checking ? "확인 중..." : "투표 시작하기"}
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

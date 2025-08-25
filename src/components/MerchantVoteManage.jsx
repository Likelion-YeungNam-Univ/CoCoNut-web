// src/components/MerchantVoteManage.jsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BsCheckCircleFill } from "react-icons/bs";
import { IoPersonCircle } from "react-icons/io5";
import vote1 from "../assets/vote1.png";
import vote2 from "../assets/vote2.png";
import vote3 from "../assets/vote3.png";
import VoteConfirmModal from "./VoteConfirmModal";
import SubmissionPreviewModal from "./SubmissionPreviewModal";
import { getProjectVotes } from "../apis/votesApi";
import { selectWinner, getProjectWinner } from "../apis/rewardsApi";
import { fetchSubmissionDetail } from "../apis/submissionApi";

const REFRESH_MS = 10000;

function toKey(v) {
  if (v === null || v === undefined) return "";
  const n = Number(v);
  return Number.isFinite(n) ? String(n) : String(v);
}

const getNick = (s) =>
  s?.writerNickname ?? s?.nickname ?? s?.userNickname ?? s?.username ?? null;

const fmtYMD = (s, addDays = 0) => {
  if (!s) return "-";
  try {
    const d = new Date(s);
    if (isNaN(d)) return s;
    if (addDays) d.setDate(d.getDate() + addDays);
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
        ${isResult ? "px-[12px] h-[40px] text-[16px]" : "px-[10px] h-[28px] text-[14px]"}
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

export default function MerchantVoteManage({
  project, // optional, only for title fallback in preview
  projectId,
  submissions = [],
  voteStartDate,
  voteEndDate,
  winnerSubmissionId: winnerFromServer = null,
  onWinnerSelected,
  uiVariant = "voting", // "voting" | "result"
}) {
  const [items, setItems] = useState(
    submissions.map((s) => ({
      ...s,
      voteCount: typeof s.voteCount === "number" ? s.voteCount : 0,
    }))
  );
  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    setItems(
      submissions.map((s) => ({
        ...s,
        voteCount: typeof s.voteCount === "number" ? s.voteCount : 0,
      }))
    );
  }, [submissions]);

  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);

  const [winnerEmail, setWinnerEmail] = useState(null);
  const [loadingWinnerEmail, setLoadingWinnerEmail] = useState(false);
  const [winnerId, setWinnerId] = useState(winnerFromServer ?? null);

  useEffect(() => {
    setWinnerId(winnerFromServer ?? null);
  }, [winnerFromServer]);

  // --- Preview modal state ---
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null); // { title, imageUrl, description, relatedUrl }

  useEffect(() => {
    if (!projectId || !winnerId) return;
    (async () => {
      setLoadingWinnerEmail(true);
      try {
        const info = await getProjectWinner(projectId);
        setWinnerEmail(info?.winnerEmail ?? null);
      } catch (e) {
        console.error("getProjectWinner failed:", e);
        setWinnerEmail(null);
      } finally {
        setLoadingWinnerEmail(false);
      }
    })();
  }, [projectId, winnerId]);

  // 투표수 로딩
  const loadVotes = useCallback(async () => {
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
              (sum, r) => sum + Number(r.voteCount ?? r.votes ?? r.count ?? 0),
              0
            );
      setTotalVotes(total);
    } catch (e) {
      console.error("getProjectVotes failed:", e);
    }
  }, [projectId, submissions]);

  useEffect(() => {
    loadVotes();
    const t = setInterval(loadVotes, REFRESH_MS);
    return () => clearInterval(t);
  }, [loadVotes]);

  // 투표수 기준 정렬된 배열
  const ranked = useMemo(
    () => [...items].sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0)),
    [items]
  );

  // 상위 3개 뱃지 정보
  const top3ById = useMemo(() => {
    const map = new Map();
    ranked.slice(0, 3).forEach((it, idx) =>
      map.set(toKey(it.submissionId), {
        rank: idx + 1,
        votes: it.voteCount || 0,
      })
    );
    return map;
  }, [ranked]);

  // 카드 클릭: 선택 모드가 아니고, 결과 화면이 아니며, 아직 우승작이 없으면 → 미리보기 모달
  const onCardClick = async (id) => {
    if (!id) return;

    if (!isSelecting) {
      const base =
        ranked.find((it) => toKey(it.submissionId) === toKey(id)) ||
        submissions.find((it) => toKey(it.submissionId) === toKey(id));

      let detail = {};
      try {
        if (!base?.description || !base?.relatedUrl) {
          detail = await fetchSubmissionDetail(id);
        }
      } catch (e) {
        console.warn("fetchSubmissionDetail failed:", e);
      }

      setPreviewData({
        title: base?.title ?? detail?.title ?? "",
        imageUrl: base?.imageUrl ?? detail?.imageUrl ?? "",
        description: base?.description ?? detail?.description ?? "",
        relatedUrl: base?.relatedUrl ?? detail?.relatedUrl ?? "",
      });
      setPreviewOpen(true);
      return;
    }

    // 선택 모드에서는 선택 토글
    if (isSelecting) {
      setSelectedId((prev) => (prev === id ? null : id));
    }
  };

  const confirmWinner = async () => {
    if (!selectedId) return;
    try {
      const reward = await selectWinner(projectId, selectedId);
      setWinnerId(selectedId);
      setIsSelecting(false);
      setOpenConfirm(false);
      onWinnerSelected?.(selectedId, reward);
      try {
        sessionStorage.setItem(`winner:${projectId}`, String(selectedId));
      } catch {}
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      console.error("selectWinner failed:", e);
      alert("수상작 선정에 실패했어요. 잠시 후 다시 시도해 주세요.");
    }
  };

  // ✅ 우승작 화면
  if (winnerId) {
    const wKey = toKey(winnerId);
    const winner =
      items.find((it) => toKey(it.submissionId) === wKey) ||
      submissions.find((it) => toKey(it.submissionId) === wKey);
    const winnerNick =
      getNick(winner) ||
      getNick(submissions.find((s) => toKey(s.submissionId) === wKey)) ||
      "익명";
    const others = items.filter((it) => toKey(it.submissionId) !== wKey);

    return (
      <div className="font-pretendard flex flex-col items-center">
        {/* 상단 안내 */}
        <div className="flex flex-col mt-[80px] items-center text-center gap-[8px]">
          <div className="text-[24px] font-semibold">수상작 선정이 완료되었습니다.🎉</div>
          <div className="text-[14px] text-[#A3A3A3]">
            선정하신 수상작은 모든 사용자에게 공개됩니다
          </div>

          <div className="flex flex-row mt-[40px] items-center gap-[16px] border bg-[#E0F9FE] border-[#E0F9FE] rounded-[24px] justify-center text-[16px] text-[#26ADC5] px-[16px] py-[10px]">
            <div className="text-center">
              <div className="font-medium">{winnerNick} 님의 작품이 수상작으로 선정되었습니다.</div>
              {loadingWinnerEmail ? (
                <div className="mt-1 text-[#26ADC5]/70">이메일 불러오는 중…</div>
              ) : winnerEmail ? (
                <div className="mt-1">
                  수상자 연락처:&nbsp;
                  <a href={`mailto:${winnerEmail}`} className="underline font-semibold">
                    {winnerEmail}
                  </a>
                </div>
              ) : (
                <div className="mt-1 text-[#26ADC5]/70">이메일 정보를 찾을 수 없습니다.</div>
              )}
            </div>
          </div>
        </div>

        {/* 우승작 크게 */}
        <div className="mx-auto mt-10 border border-gray-200 w-[600px] rounded-2xl  bg-white overflow-hidden justify-center">
          <div className="mx-auto aspect-square max-w-[600px] w-full bg-gray-100 overflow-hidden">
            {winner?.imageUrl ? (
              <img src={winner.imageUrl} alt={winner?.title || "winner"} className="w-full h-full object-cover" />
            ) : (
              <div className="text-gray-400">이미지 없음</div>
            )}
          </div>
          <div className="p-6 text-center"></div>
        </div>

        <div className="text-xl font-semibold flex items-center justify-center mt-[28px]">
          {winner?.title || "-"}
        </div>
        <div className="mt-2 flex items-center justify-center text-gray-500">
          <IoPersonCircle className="mr-1" size={24} />
          {winnerNick}
        </div>

        {/* 나머지 썸네일 */}
        <div className="grid grid-cols-4 gap-[24px] mt-[32px]">
          {others.map((it) => (
            <div key={it.submissionId} className="border border-[#E1E1E1] rounded-[12px] w-[240px] h-[306px]">
              <div className="relative border border-[#EBEBEB] w-[240px] h-[240px] rounded-[12px] bg-[#EBEBEB] overflow-hidden">
                {it.imageUrl ? <img src={it.imageUrl} className="w-full h-full object-cover" alt={it.title} /> : null}
              </div>
              <span className="block mt-[20px] ml-[16px] font-semibold truncate">{it.title}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ✅ 기본/선택 모드 (조건부 UI)
  const isResult = uiVariant === "result";

  return (
    <div className="font-pretendard flex flex-col items-center ">
      <div className="mt-2 text-center w-full">
        {/* 투표 기간 칩 */}
        <div className="flex flex-row justify-center"></div>

        {/* 헤더 카피: 모드에 따라 교체 */}
        {isResult ? (
          <>
            <div className="flex justify-center">
              <div className="border rounded-[24px] bg-[#E0F9FE] text-[#26ADC5] border-[#E0F9FE] px-[12px] py-[8px] text-[14px] flex items-center gap-[8px]">
                <div className="font-medium">선정 기간</div>
                <div className="font-semibold">
                  {`${fmtYMD(voteStartDate, 7)} - ${fmtYMD(voteEndDate, 7)}`}
                </div>
              </div>
            </div>
            <div className="mt-[20px] text-[24px] font-semibold text-[#212121]">
              투표 결과가 나왔습니다! 이제 수상작을 선정해 주세요.
            </div>
            <div className="mt-[8px] text-[14px] text-[#A3A3A3]">
              기간이 지나면 선정이 어려워질 수 있어요. 서둘러 결정해 주세요.
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-center">
              <div className="border rounded-[24px] bg-[#E0F9FE] text-[#26ADC5] border-[#E0F9FE] px-[12px] py-[8px] text-[14px] flex items-center justify-center gap-[8px] w-[255px] h-[34px]">
                <div className="font-medium">투표 기간</div>
                <div className="font-semibold">
                  {fmtYMD(voteStartDate)} - {fmtYMD(voteEndDate)}
                </div>
              </div>
            </div>
            <div className="mt-[20px] flex justify-center items-center text-[24px] font-semibold text-[#212121]">
              지금까지 {totalVotes?.toLocaleString()}명이 투표에 참여했어요!
            </div>
            <div className="mt-[8px] text-[14px] text-[#A3A3A3]">
              투표를 통해 지역의 목소리가 반영된 순위를 확인할 수 있어요.
            </div>
          </>
        )}
      </div>

      {/* 카드 그리드: 투표수 많은 순서로 정렬된 ranked 사용 */}
      <div className={`mt-[28px] grid ${isResult ? "grid-cols-5 gap-[16px]" : "grid-cols-4 gap-[24px]"}`}>
        {ranked.map((it) => {
          const badge = top3ById.get(toKey(it.submissionId));
          const selected = toKey(selectedId) === toKey(it.submissionId);
          return (
            <div
              key={it.submissionId}
              onClick={() => onCardClick(it.submissionId)}
              className={`border border-[#E1E1E1] rounded-[12px]
                ${isResult ? "w-[216px] h-[290px]" : "w-[240px] h-[306px]"}
                ${isSelecting ? "cursor-pointer hover:ring-2 hover:ring-[#2FD8F6]" : ""} ${
                selected ? "ring-2 ring-[#2FD8F6]" : ""
              }`}
            >
              <div
                className={`relative border border-[#EBEBEB] rounded-[12px] bg-[#EBEBEB] overflow-hidden
                  ${isResult ? "w-[216px] h-[216px]" : "w-[240px] h-[240px]"}`}
              >
                {badge ? (
                  <RankBadge
                    rank={badge.rank}
                    votes={badge.votes}
                    variant={isResult ? "result" : "voting"}
                  />
                ) : null}
                {it.imageUrl ? (
                  <img src={it.imageUrl} className="w-full h-full object-cover" alt={it.title} />
                ) : null}
                {isSelecting && selected && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BsCheckCircleFill size={56} color="#2FD8F6" />
                  </div>
                )}
              </div>
              <span className="block mt-[20px] ml-[16px] font-semibold truncate">{it.title}</span>
            </div>
          );
        })}
      </div>

      {/* 버튼 영역 */}
      {!isSelecting ? (
        <button
          className="mb-[60px] mt-[80px] border w-[180px] h-[45px] rounded-[8px] text-white bg-[#212121] text-[16px] flex items-center justify-center"
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
            className={`w-[180px] h-[45px] rounded-[8px] text-white flex justify-center items-center ${
              !selectedId ? "bg-[#A3A3A3] cursor-not-allowed" : "bg-[#212121]"
            }`}
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
        submission={items.find((it) => toKey(it.submissionId) === toKey(selectedId))}
        title="이 작품을 수상작으로 선정하시겠습니까?"
        description="선정하신 이후에는 변경할 수 없어요."
        confirmText="선정하기"
        cancelText="취소"
      />

      {/* 미리보기 모달 */}
      <SubmissionPreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        projectTitle={previewData?.title ?? project?.title ?? ""}
        uploadedImage={previewData?.imageUrl ?? ""}
        description={previewData?.description ?? ""}
        link={previewData?.relatedUrl ?? ""}
      />
    </div>
  );
}

// src/pages/ParticipantProfile.jsx
import React, { useEffect, useMemo, useState } from 'react';
import MerchantHeader from '../header/MerchantHeader';
import { IoPersonCircle } from "react-icons/io5";
import { BiSolidCopy } from "react-icons/bi";
import Alarm from '../components/Alarm';
import ProjectCardClosed from '../main/projectCard/ProjectCardClosed';
import { fetchProjects } from "../apis/getProjectsApi";

//참여자 프로필 페이지 (임시 사용자)
const mockParticipant = {
  id: "user_0001",
  name: "참가자 닉네임",
  email: "coconut@gmail.com",
  participationCount: 8,
  awardCount: 3,
  avatarUrl: null,
};

export default function ParticipantProfile({
  // 필요하면 상위에서 코드북을 내려줄 수 있어요 (없어도 동작)
  categories = [],
  businessTypes = [],
}) {
  const p = mockParticipant;

  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchProjects(); // ✅ 너가 쓰는 API
        if (mounted) setProjects(Array.isArray(data) ? data : []);
      } catch (e) {
        if (mounted) setError(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // 이 참가자가 '수상한' 프로젝트만 골라요.
  // 백엔드 필드명이 다를 수 있어서 여러 케이스를 넓게 커버.
  const myAwarded = useMemo(() => {
    const byWinnerId = projects.filter((prj) => {
      const winner =
        prj.winnerUserId ??
        prj.winnerId ??
        prj.awardedParticipantId ??
        prj.awardWinnerId;
      return winner && String(winner) === String(p.id);
    });

    if (byWinnerId.length > 0) return byWinnerId;

    // 백업: winner id가 없다면 CLOSED 상태만이라도 노출
    return projects.filter((prj) => prj.status === "CLOSED");
  }, [projects, p.id]);

  return (
    <>
      <MerchantHeader />
      <div className='ml-[240px] font-pretendard mt-[100px] mr-[322px] divide-y divide-[#A3A3A3] [&>*]:py-[55px]'>

        {/* 상단 프로필 영역 (네 코드 유지) */}
        <div className='flex flex-row'>
          <IoPersonCircle size={80} color='#A3A3A3'/>
          <div className='flex flex-col ml-[20px] mt-[10px]'>
            <span className='font-semibold text-[20px]'>{p.name}</span>
            <div className='flex flex-row'>
              <span className='text-[14px] text-[#212121]'>{p.email}</span>
              <BiSolidCopy className='mt-[3px] ml-[4px]' size={16} color='#A3A3A3'/>
              
            </div>
          </div>

          <div className='mt-[18px] ml-auto flex flex-row divide-x divide-[#A3A3A3] [&>div]:px-[28px]'>
            <div className='flex flex-col'>
              <span className='text-[14px] text-[#A3A3A3]'>참여 경력</span>
              <span className='font-semibold text-[16px] mt-[8px]'>{p.participationCount}</span>
            </div>
            <div className='flex flex-col'>
              <span className='text-[14px] text-[#A3A3A3]'>수상 경력</span>
              <span className='font-semibold text-[16px] mt-[8px]'>{p.awardCount}</span>
            </div>
          </div>
        </div>

        {/* 수상 내역 */}
        <div>
          <span className='font-semibold text-[20px]'>수상 내역</span>

          <div className="mt-4 space-y-4">
            {loading && <div className="text-[14px] text-[#A3A3A3]">불러오는 중…</div>}
            {error && (
              <div className="text-[14px] text-red-500">
                불러오기에 실패했습니다: {error.message}
              </div>
            )}
            {!loading && !error && myAwarded.length === 0 && (
              <div className="text-[14px] text-[#A3A3A3]">수상 내역이 없습니다.</div>
            )}

            {myAwarded.map((prj) => (
              <ProjectCardClosed
                key={prj.projectId ?? prj.id}
                project={prj}                 // ✅ 필수
                categories={categories}       // 선택 (설명 매핑용)
                businessTypes={businessTypes} // 선택 (설명 매핑용)
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

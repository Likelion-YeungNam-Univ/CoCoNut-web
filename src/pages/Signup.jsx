import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const [currentStep, setCurrentStep] = useState(1); // 현재 단계 (1, 2, 3)

  const navigate = useNavigate();

  const signUpHandler = async (e) => {
    e.preventDefault();

    const body = {
      name: name,
      nickname: nickname,
      password: password,
      role: role,
    };

    try {
      await signUpApi(body);
      navigate("/main");
    } catch (err) {
      alert(`회원가입 실패: ${err.message}`);
    }
  };

  const stepBox = (step, label) => (
    <div className='flex flex-row gap-[8px] border border-[#FFFFFF] bg-[#FFFFFF] rounded-[8px] p-[14px]'>
      <div
        className={`border w-7 h-7 rounded-full flex items-center justify-center 
          ${currentStep === step ? "bg-black text-white" : "bg-gray-300 text-white"}`}
      >
        {step}
      </div>
      <span className='mt-0.5'>{label}</span>
    </div>
  );

  return (
    <div className='bg-[#F3F3F3] min-h-screen flex flex-col items-center gap-3 font-pretendard'>
      <span className='font-bold text-4xl mt-[120px]'>회원가입</span>
      <div className='flex flex-row gap-[8px] p-[14px] '>
        {stepBox(1, "회원 유형 선택")}
        {stepBox(2, "회원 정보 입력")}
        {stepBox(3, "회원가입 완료")}
      </div>

      {currentStep === 1 && ( // 회원 유형 선택했을 때 
        <div className='border w-[504px] h-[480px] flex flex-col items-center text-center rounded-[12px] border-[#FFFFFF] bg-[#FFFFFF]'>
          <span className='text-[20px] font-semibold text-[#212121] mt-10'>회원 유형을 선택해 주세요.</span>
          <span className='text-[#A3A3A3] text-[14px]'>유형에 따라 서비스를 다양하게 이용할 수 있어요.</span>
          
          <div className='flex flex-row gap-5 mt-8'>
            {/* 참가자 카드 */}
            <div
              onClick={() => setRole("참가자")}
              role='button'
              className={`flex flex-col w-[200px] h-[220px] border rounded-[8px] cursor-pointer
                ${role === "참가자" 
                  ? "bg-[#EAFBFE] border-[#2FD8F6]" 
                  : "border-[#F3F3F3] hover:bg-[#EAFBFE] hover:border-[#2FD8F6]"}`
              }
            >
              <button className='font-semibold text-[20px] text-[#212121] mt-30' type='button'>
                참가자
              </button>
              <span className='text-[14px] text-[#828282]'>
                공모전에 참여하여<br/>작품을 제안할 수 있어요.
              </span>
            </div>

            {/* 소상공인 카드 */}
            <div
              onClick={() => setRole("소상공인")}
              role='button'
              className={`flex flex-col w-[200px] h-[220px] border rounded-[8px] cursor-pointer
                ${role === "소상공인" 
                  ? "bg-[#EAFBFE] border-[#2FD8F6]" 
                  : "border-[#F3F3F3] hover:bg-[#EAFBFE] hover:border-[#2FD8F6]"}`
              }
            >
              <button className='font-semibold text-[20px] text-[#212121] mt-30' type='button'>
                소상공인
              </button>
              <span className='text-[14px] text-[#828282]'>
                도움이 필요할 때<br/>공모를 등록할 수 있어요
              </span>
            </div>
          </div>

          <button
            type='button'
            onClick={() => setCurrentStep(2)}
            disabled={!role}
            className={`
              w-[180px] h-[45px] border rounded-[8px] text-white mt-8
              ${!role 
                ? 'bg-[#E1E1E1]' 
                : 'bg-[#2FD8F6] hover:bg-[#2AC2DD]'} 
            `}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
};

export default Signup;

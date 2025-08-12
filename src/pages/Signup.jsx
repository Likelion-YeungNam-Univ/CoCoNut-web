import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCheckCircle } from "react-icons/fa";
import ScriptModal from '../components/ScriptModal';
import PolicyContent from '../components/PolicyContent';

const Signup = () => {
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const [email, setEmail] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [nicknameMessage, setNicknameMessage] = useState("");

  const [checkingEmail, setCheckingEmail] = useState(false);
  const [checkingNickname, setCheckingNickname] = useState(false);

  const [currentStep, setCurrentStep] = useState(1);

  const [passwordMessage, setPasswordMessage] = useState("");

    const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false); //모달상태

  const validatePassword = (value) => {
  // 영문, 숫자, 특수기호 포함 8~16자 정규식
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{8,16}$/;
  if (!passwordRegex.test(value)) {
    setPasswordMessage("영문, 숫자, 특수기호 조합 8자~16자를 입력해 주세요.");
  } else {
    setPasswordMessage(""); // 조건 충족 시 메시지 제거
  }
};


  // 약관 동의 상태 관리
  const [termsAgreed1, setTermsAgreed1] = useState(false);
  const [termsAgreed2, setTermsAgreed2] = useState(false);

  const navigate = useNavigate();

  const checkEmailApi = async (emailValue) => {
    return new Promise((resolve) =>
      setTimeout(() => resolve({ exists: false }), 500)
    );
  };
  const checkNicknameApi = async (nicknameValue) => {
    return new Promise((resolve) =>
      setTimeout(() => resolve({ exists: false }), 500)
    );
  };
  const signUpApi = async (body) => {
    return new Promise((resolve) =>
      setTimeout(() => resolve({ ok: true }), 700)
    );
  };

const checkEmailDuplicate = async () => {
  if (!email) {
    setEmailMessage("이메일을 입력하세요.");
    return;
  }
  try {
    setCheckingEmail(true);

    // 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailMessage("이메일 형식에 맞춰 입력해 주세요.(예시: abcd@gmail.com)");
      return; // 형식 틀리면 API 호출 안 함
    }

    // 중복 검사
    const res = await checkEmailApi(email);
    if (res.exists) {
      setEmailMessage("이미 존재하는 아이디입니다. 다른 아이디를 입력해 주세요.");
    } else {
      setEmailMessage("사용 가능한 아이디입니다.");
    }
  } catch (e) {
    setEmailMessage("중복확인 중 오류가 발생했습니다.");
  } finally {
    setCheckingEmail(false);
  }
};


  const checkNicknameDuplicate = async () => {
    if (!nickname) {
      setNicknameMessage("닉네임을 입력하세요.");
      return;
    }
    try {
      setCheckingNickname(true);
      const res = await checkNicknameApi(nickname);
      setNicknameMessage(res.exists ? "이미 존재하는 닉네임입니다. 다른 닉네임을 입력해 주세요." : "사용 가능한 닉네임입니다.");
    } catch (e) {
      setNicknameMessage("중복확인 중 오류가 발생했습니다.");
    } finally {
      setCheckingNickname(false);
    }
  };

  const signUpHandler = async (e) => {
    e.preventDefault();

    const body = {
      name,
      nickname,
      password,
      role,
      email,
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

      {currentStep === 1 && (
        <div className='border w-[504px] h-[480px] flex flex-col items-center text-center rounded-[12px] border-[#FFFFFF] bg-[#FFFFFF]'>
          <span className='text-[20px] font-semibold text-[#212121] mt-10'>회원 유형을 선택해 주세요.</span>
          <span className='text-[#A3A3A3] text-[14px]'>유형에 따라 서비스를 다양하게 이용할 수 있어요.</span>
          
          <div className='flex flex-row gap-5 mt-8'>
            <div
              onClick={() => setRole("참가자")}
              role='button'
              className={`flex flex-col w-[200px] h-[220px] border rounded-[8px] cursor-pointer
                ${role === "참가자" 
                  ? "bg-[#EAFBFE] border-[#2FD8F6]" 
                  : "border-[#F3F3F3] hover:bg-[#EAFBFE] hover:border-[#2FD8F6]"}`}
            >
              <button className='font-semibold text-[20px] text-[#212121] mt-30' type='button'>
                참가자
              </button>
              <span className='text-[14px] text-[#828282]'>
                공모전에 참여하여<br/>작품을 제안할 수 있어요.
              </span>
            </div>

            <div
              onClick={() => setRole("소상공인")}
              role='button'
              className={`flex flex-col w-[200px] h-[220px] border rounded-[8px] cursor-pointer
                ${role === "소상공인" 
                  ? "bg-[#EAFBFE] border-[#2FD8F6]" 
                  : "border-[#F3F3F3] hover:bg-[#EAFBFE] hover:border-[#2FD8F6]"}`}
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
            className={`w-[180px] h-[45px] border rounded-[8px] text-white mt-8
              ${!role ? 'bg-[#E1E1E1]' : 'bg-[#2FD8F6] hover:bg-[#2AC2DD]'}`}
          >
            다음
          </button>
        </div>
      )}
      
      {currentStep === 2 && (
        <div className='border w-[504px] h-[620px] rounded-[12px] border-[#FFFFFF] bg-[#FFFFFF] font-pretendard'>
          <div className='flex flex-col my-[18px] mx-[36px]'>
            <form className='flex flex-col gap-[8px]' onSubmit={signUpHandler}>
              <div className='flex flex-col gap-[2px]'>
                <span className='text-[14px]'>아이디</span>
                <div>
                  <div className="flex gap-[8px] items-center">
                    <input
                      className='pt-[15px] pr-[16px] pb-[15px] pl-[16px] border rounded-[6px] border-[#F3F3F3] w-[321px] h-[48px] focus:outline-none'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder='이메일을 입력해 주세요.'
                    />
                    <button
                      type="button"
                      onClick={checkEmailDuplicate}
                      className="w-[83px] h-[48px] border rounded-[6px] border-[#E1E1E1] bg-[#E1E1E1] text-[#828282] hover:bg-[#4C4C4C]"
                      disabled={checkingEmail}
                    >
                      {checkingEmail ? "확인중" : "중복확인"}
                    </button>
                  </div>
                 {emailMessage && (
                  <span
                    className={`text-[12px] mt-[4px] ${
                      emailMessage.includes("사용 가능한") ? "text-[#2CCC41]" : "text-[#EE4343]"
                    }`}
                  >
                    {emailMessage}
                  </span>
                )}
                </div>
              </div>

              <div className='flex flex-col gap-[2px]'>
                <span className='text-[14px]'>닉네임</span>
                <div className="flex gap-[8px] items-center">
                  <input
                    className='pt-[15px] pr-[16px] pb-[15px] pl-[16px] border rounded-[6px] border-[#F3F3F3] w-[321px] h-[48px] focus:outline-none'
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder='10자 이내로 작성해 주세요.'
                  />
                  <button
                    type="button"
                    onClick={checkNicknameDuplicate}
                    className="w-[83px] h-[48px] border rounded-[6px] border-[#E1E1E1] bg-[#E1E1E1] text-[#828282] hover:bg-[#4C4C4C]"
                    disabled={checkingNickname}
                  >
                    {checkingNickname ? "확인중" : "중복확인"}
                  </button>
                </div>
                                    {nicknameMessage && (
                      <span
                        className={`text-[12px] mt-[4px] ${
                          nicknameMessage.includes("사용 가능한")
                            ? "text-[#2CCC41]" 
                            : nicknameMessage.includes("이미 사용 중")
                            ? "text-[#EE4343]" 
                            : "text-[#828282]" 
                        }`}
                      >
                        {nicknameMessage}
                      </span>
                    )}
              </div>

              <div className='flex flex-col gap-[2px]'>
                <span className='text-[14px]'>이름</span>
                <input
                  className='pt-[15px] pr-[16px] pb-[15px] pl-[16px] border rounded-[6px] border-[#F3F3F3] w-[424px] h-[48px] focus:outline-none'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder='이름을 입력해 주세요.'
                />
              </div>

              <div className='flex flex-col gap-[2px]'>
                  <span className='text-[14px]'>비밀번호</span>
                  <input
                    className='pt-[15px] pr-[16px] pb-[15px] pl-[16px] border rounded-[6px] border-[#F3F3F3] w-[424px] h-[48px] focus:outline-none'
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      validatePassword(e.target.value); // 입력 시마다 검증
                    }}
                    placeholder='영문,숫자,특수기호 조합 8자~16자'
                    type='password'
                  />
                  {passwordMessage && (
                    <span className="text-[12px] text-[#EE4343] mt-[4px]">{passwordMessage}</span>
                  )}
                </div>

              {/* 약관 동의 체크박스 */}
              <div className='mt-[32px]'>
                <div className='flex flex-col gap-[14px]'>
                  <div className='flex flex-row items-center gap-[8px] '>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={termsAgreed1}
                      onChange={() => setTermsAgreed1(!termsAgreed1)}
                      className="hidden"
                    />
                    <span
                      className={`w-[20px] h-[20px] flex items-center justify-center rounded border 
                        ${termsAgreed1 ? "bg-[#2FD8F6] border-[#2FD8F6]" : "bg-white border-gray-400"}`}
                    >
                      {termsAgreed1 && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-[14px] h-[14px] text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                  </label>

                  <div className='flex gap-[191px]'>
                  <span className='text-[14px]'>(필수) 서비스 이용약관 동의</span>
                  <button
                        type="button"
                        className='text-[12px] underline text-[#A3A3A3] hover:text-[#828282]'
                        onClick={() => setIsTermsOpen(true)}
                      >
                        자세히보기
                      </button>
                  </div>
                
                  
                    
                  </div>
                <div className='flex flex-row items-center gap-[8px]'>
                  <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAgreed2}
                    onChange={() => setTermsAgreed2(!termsAgreed2)}
                    className="hidden"
                  />
                  <span
                    className={`w-[20px] h-[20px] flex items-center justify-center rounded border 
                      ${termsAgreed2 ? "bg-[#2FD8F6] border-[#2FD8F6]" : "bg-white border-gray-400"}`}
                  >
                    {termsAgreed2 && ( // 체크박스 커스텀
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-[14px] h-[14px] text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                </label>
                  <div className='flex gap-[123px]'>
                  <span className='text-[14px]'>(필수) 개인정보수집 및 이용에 대한 안내</span>
                   <button
                        type="button"
                        className='text-[12px] underline text-[#A3A3A3] hover:text-[#828282]'
                        onClick={() => setIsPrivacyOpen(true)}
                      >
                        자세히보기
                      </button>
                  </div>
                </div>
                </div>
              </div>

              {/* 다음 버튼 */}
              <div className="flex justify-center">
                <button
                  type='button'
                  onClick={() => setCurrentStep(3)}
                  disabled={!(termsAgreed1 && termsAgreed2)}
                  className={` mt-[38px] w-[180px] h-[45px] border rounded-[8px] pt-[12px] pr-[20px] pb-[12px] pl-[20px] border-[#E1E1E1] text-white 
                    ${termsAgreed1 && termsAgreed2 ? 'bg-[#2FD8F6]' : 'bg-[#E1E1E1]'}`}
                >
                  다음
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    {currentStep === 3 && (
      <div className='flex flex-col font-pretendard items-center border border-white rounded-[12px] bg-white w-[504px] h-[340px]'>
      <FaCheckCircle className='mt-[60px]' size={60} color='#2FD8F6' />
      <span className='mt-[20px] font-semibold text-[24px]'>회원가입이 완료되었습니다.</span>
      <span className='mt-[8px] text-[#A3A3A3] text-[14px]'>로그인 후 브릿지의 서비스를 이용하실 수 있습니다.</span>
      <Link className='mt-[40px] border border-[#2FD8F6] text-white bg-[#2FD8F6] rounded-[8px] py-[12px] px-[40px]' to='signin'>로그인하러 가기</Link>
      </div>
    )}
   <ScriptModal
      isOpen={isTermsOpen}
      onClose={() => setIsTermsOpen(false)}
      title="서비스 이용약관"
    >
      <PolicyContent type="terms" />
    </ScriptModal>

    <ScriptModal
      isOpen={isPrivacyOpen}
      onClose={() => setIsPrivacyOpen(false)}
      title="개인정보 수집 및 이용"
    >
      <PolicyContent type="privacy" />
</ScriptModal>
    </div>
  );
};

export default Signup;

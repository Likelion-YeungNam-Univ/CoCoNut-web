import { Link, useNavigate } from "react-router-dom";
import SignInApi from "../apis/signInApi";
import { useContext, useState } from "react";
import AuthContext from "../contexts/AuthContext";

/** 로그인 페이지 */
const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 필드별 에러 메시지 상태
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  /** 로그인 버튼 클릭 시 실행되는 함수 */
  const SignInHandler = async (e) => {
    e.preventDefault();

    // 이전 에러 초기화
    setEmailError("");
    setPasswordError("");

    // 비어있는 값 검사
    let hasError = false;
    if (!email) {
      setEmailError("아이디(이메일)를 입력해 주세요.");
      hasError = true;
    }
    if (!password) {
      setPasswordError("비밀번호를 입력해 주세요.");
      hasError = true;
    }
    if (hasError) return;

    // 요청 바디
    const body = { email, password };

    try {
      /** 로그인 API 호출 */
      const result = await SignInApi(body);
      const accessToken = result?.data?.accessToken ?? result?.accessToken;
      const role =
        result?.data?.role ??
        result?.role ??
        result?.data?.user?.role ??
        result?.user?.role;

      if (!accessToken) throw new Error("토큰이 응답에 없습니다.");

      login(accessToken);
      alert("로그인이 완료되었습니다!");
      /** 성공 시 이동 (role에 따라 분기하면 여기서 처리) */
      if (role === "ROLE_BUSINESS") {
        navigate("/merchant-main-page");
      } else if (role === "ROLE_USER") {
        navigate("/participant-main-page");
      } else {
        // role이 없거나 예상치 못한 값인 경우 기본 페이지로
        navigate("/");
      }
    } catch (err) {
      // 서버 메시지/필드 정보 파싱
      const server = err?.response?.data || {};
      const serverMsg = server.message || server.error || err.message || "";

      // 서버가 잘못된 필드를 알려주는 여러 케이스를 대응
      const errorField =
        server.field || server.errorField || server?.errors?.[0]?.field || null;

      if (errorField === "email" || /email|아이디/i.test(serverMsg)) {
        setEmailError("아이디를 잘못 입력하셨습니다. 다시 입력해 주세요.");
        setPasswordError(""); // 다른 필드 메시지는 비움
      } else if (
        errorField === "password" ||
        /password|비밀번호/i.test(serverMsg)
      ) {
        setPasswordError("비밀번호를 잘못 입력하셨습니다. 다시 입력해주세요.");
        setEmailError("");
      } else {
        // 어떤 필드인지 불명확하면 둘 다 안내
        setEmailError("아이디 또는 비밀번호를 다시 확인해 주세요.");
        setPasswordError("아이디 또는 비밀번호를 다시 확인해 주세요.");
      }

      console.error("로그인 에러:", {
        status: err?.response?.status,
        data: err?.response?.data,
      });
    }
  };

  return (
    <div className="flex justify-center mt-[120px] font-pretendard ">
      <fieldset className="border rounded-[12px] w-[504px] h-[428px] bg-white flex flex-col justify-center items-center border-white pt-[44px] pb-[57px]">
        <span className="font-semibold text-[32px]">로그인</span>

        <form className="flex flex-col" onSubmit={SignInHandler}>
          {/* 아이디(이메일) */}
          <div className="flex flex-col">
            <input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError("");
              }}
              placeholder="아이디(이메일)"
              type="text"
              autoComplete="username"
              className="flex items-center mt-[32px] focus:outline-none text-[14px] border rounded-[6px] w-[360px] h-[48px] pt-[15px] pr-[16px] pb-[15px] pl-[16px] border-[#F3F3F3] placeholder-[#C3C3C3]"
              aria-invalid={!!emailError}
              aria-describedby="email-error"
            />
            <span
              id="email-error"
              className="min-h-[18px] text-[12px] text-[#EE4343] pl-[4px] py-[8px]"
            >
              {emailError}
            </span>
          </div>

          {/* 비밀번호 */}
          <div className="flex flex-col">
            <input
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError("");
              }}
              placeholder="비밀번호"
              type="password"
              autoComplete="current-password"
              className="text-[14px] border focus:outline-none rounded-[6px] w-[360px] h-[48px] pt-[15px] pr-[16px] pb-[15px] pl-[16px] border-[#F3F3F3] placeholder-[#C3C3C3]"
              aria-invalid={!!passwordError}
              aria-describedby="password-error"
            />
            <span
              id="password-error"
              className="min-h-[18px] text-[12px] text-[#EE4343] pl-[4px] py-[8px]"
            >
              {passwordError}
            </span>
          </div>

          <button
            type="submit"
            className="mt-[12px] text-white border border-[#2FD8F6] bg-[#2FD8F6] rounded-[8px] w-[360px] h-[45px] text-[16px] hover:bg-[#2AC2DD] cursor-pointer"
          >
            로그인
          </button>

          <Link
            className="text-[12px] text-[#A3A3A3] mt-[20px] flex justify-center"
            to="/signup"
          >
            회원가입
          </Link>
        </form>
      </fieldset>
    </div>
  );
};

export default SignIn;

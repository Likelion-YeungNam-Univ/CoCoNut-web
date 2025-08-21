import React from "react";
import { Link } from "react-router-dom";
import LandingBackground from "../assets/LandingBackground.png";
import LandingScreen from "../assets/LandingScreen.png";
import Landing1 from "../assets/Landing1.png";
import Landing2 from "../assets/Landing2.png";
import Landing3_1 from "../assets/Landing3_1.png";
import Landing3_2 from "../assets/Landing3_2.png";
import Landing3_3 from "../assets/Landing3_3.png";
import Landing4 from "../assets/Landing4.png";
import Landing5 from "../assets/Landing5.png";
import Landing6 from "../assets/Landing6.png";
import { RiArrowDownWideFill } from "react-icons/ri";

const Landing = () => {
  return (
    <div className="font-pretendard">
      {/* 첫 번째 영역 */}
      <div
        className="relative w-full h-[1013px] bg-cover bg-center flex flex-col items-center"
        style={{ backgroundImage: `url(${LandingBackground})` }}
      >
        <div className="flex flex-col items-center pt-[76px]">
          <h1 className="font-bold text-[40px] text-black leading-snug text-center pb-[16px]">
            가게에 필요한 것, 쉽게 요청하고 받아보세요.
          </h1>
          <p className="text-[#626262] text-[16px] text-center">
            브릿지는 경산의 소상공인과 지역 주민이 연결될 수 있도록 돕는 B2P
            공모 플랫폼입니다.
          </p>

          {/* 버튼 */}
          <div className="flex gap-[16px] mt-[40px]">
            <Link
              className="border border-[#2FD8F6] bg-[#EAFBFE] hover:bg-[#E0F9FE] rounded-xl 
                        w-[140px] h-[45px] flex items-center justify-center text-[#2FD8F6] text-[16px]"
              to="/signup"
              state={{ presetRole: "참가자" }}
            >
              공모전 참여하기
            </Link>
            <Link
              className="border rounded-xl bg-[#2FD8F6] hover:bg-[#2AC2DD] 
                        w-[140px] h-[45px] text-[#FFFFFF] flex items-center justify-center text-[16px]"
              to="/signup"
              state={{ presetRole: "소상공인" }}
            >
              도움 요청하기
            </Link>
          </div>

          <Link
            className="text-[#A3A3A3] underline underline-offset-2 text-[12px] mt-[20px]"
            to="/guest-main-page"
          >
            지금 올라온 공모전 둘러보기
          </Link>
        </div>

        {/* 화면 이미지 */}
        <div className="flex justify-center mt-[56px]">
          <img
            src={LandingScreen}
            alt="서비스 화면 미리보기"
            className="w-[1252px] h-[663px]"
          />
        </div>
      </div>
      {/* 두 번째 영역 */}{" "}
      <div className="flex flex-col items-center bg-white w-full h-[740px] pt-[20px]">
        <RiArrowDownWideFill className="w-[60px] h-[60px] text-[#E1E1E1]" />
        <div className="flex space-x-[60px] mt-[50px] px-[240px]">
          {/* 왼쪽 */}
          <div className="flex-1">
            <p className="text-[#2FD8F6] font-semibold text-[16px] mb-[12px] tracking-[-0.02em]">
              지역화폐 제공
            </p>
            <h2 className="text-[#212121] text-[32px] font-bold leading-[130%] mb-[12px] tracking-[-0.02em]">
              부담은 가볍게, 아이디어는 풍성하게
            </h2>
            <p className="text-[#626262] text-[16px] leading-[170%] tracking-[-0.02em]">
              브릿지는 상금의 일부를 지역 화폐로 제공해 외주 비용의 부담은
              줄이고,
              <br /> 주민들의 다양한 아이디어가 가게에 연결될 수 있도록
              돕습니다.
            </p>
          </div>

          {/* 오른쪽 */}
          <div className="flex-1">
            <img
              src={Landing1}
              alt="랜딩 이미지1"
              className="w-[504px] h-auto rounded-[12px]"
            />
          </div>
        </div>
      </div>
      {/* 세 번째 영역 */}
      <div className="flex flex-col items-center bg-[#F9F9F9] w-full h-[740px] pt-[130px]">
        <div className="flex space-x-[60px] pl-[240px] pr-[225px]">
          {/* 왼쪽 */}
          <div className="flex-1">
            <img
              src={Landing2}
              alt="랜딩 이미지2"
              className="w-[480px] h-auto rounded-[12px]"
            />
          </div>

          {/* 오른쪽 */}
          <div className="flex-1">
            <p className="text-[#2FD8F6] font-semibold text-[16px] mb-[12px] tracking-[-0.02em]">
              AI로 공모전 쉽게 작성하기
            </p>
            <h2 className="text-[#212121] text-[32px] font-bold leading-[130%] mb-[12px] tracking-[-0.02em] whitespace-nowrap">
              필요한 도움, 공모전으로 쉽게 열어보세요.
            </h2>
            <p className="text-[#626262] text-[16px] leading-[170%] tracking-[-0.02em]">
              가게에 필요한 도움을 바로 공모전으로 올릴 수 있습니다.
              <br />
              AI가 내용을 작성해주어, 복잡한 과정 없이도 누구나 쉽게 시작할 수
              있어요.
            </p>
          </div>
        </div>
      </div>
      {/* 네 번째 영역 */}{" "}
      <div className="flex flex-col items-center bg-white w-full h-[740px] pt-[130px]">
        <div className="flex space-x-[60px] px-[240px]">
          {/* 왼쪽 */}
          <div className="flex-1">
            <p className="text-[#2FD8F6] font-semibold text-[16px] mb-[12px] tracking-[-0.02em]">
              지역 주민의 투표
            </p>
            <h2 className="text-[#212121] text-[32px] font-bold leading-[130%] mb-[12px] tracking-[-0.02em]">
              내 가게의 고민, 지역 주민과 해결해요.
            </h2>
            <p className="text-[#626262] text-[16px] leading-[170%] tracking-[-0.02em]">
              지역 주민들이 내놓은 아이디어를 실시간으로 받아볼 수 있습니다.
              <br />
              또한 주민들의 투표를 통해 어떤 작품이 더 공감을 얻는지 확인할 수
              있습니다.
            </p>
          </div>

          {/* 오른쪽 */}
          <div className="flex-1 flex flex-col gap-[16px]">
            {/* 위쪽 큰 이미지 */}
            <img
              src={Landing3_1}
              alt="랜딩 이미지3_1"
              className="w-[504px] h-[280px] rounded-[12px]"
            />

            {/* 아래쪽 두 개 이미지 (가로 배치) */}
            <div className="flex gap-[18px] w-[504px]">
              <img
                src={Landing3_2}
                alt="랜딩 이미지3_2"
                className="w-[302px] h-[184px] rounded-[12px] flex-shrink-0"
              />
              <img
                src={Landing3_3}
                alt="랜딩 이미지3_3"
                className="w-[184px] h-[184px] rounded-[12px] flex-shrink-0"
              />
            </div>
          </div>
        </div>
      </div>
      {/* 다섯 번째 영역 */}
      <div className="flex flex-col items-center bg-[#EAFBFE] w-full h-[740px] pt-[130px]">
        <div className="flex space-x-[60px] pl-[240px] pr-[225px]">
          {/* 왼쪽 */}
          <div className="flex-1">
            <img
              src={Landing4}
              alt="랜딩 이미지4"
              className="w-[480px] h-auto rounded-[12px]"
            />
          </div>

          {/* 오른쪽 */}
          <div className="flex-1">
            <p className="text-[#2FD8F6] font-semibold text-[16px] mb-[12px] tracking-[-0.02em]">
              공모전 참여하기
            </p>
            <h2 className="text-[#212121] text-[32px] font-bold leading-[130%] mb-[12px] tracking-[-0.02em] whitespace-nowrap">
              내가 낸 아이디로 동네를 변화시켜요.
            </h2>
            <p className="text-[#626262] text-[16px] leading-[170%] tracking-[-0.02em]">
              지역 주민 누구나 가게의 새로운 아이디어를 제안할 수 있습니다.
              <br />
              공모전 참여를 넘어 동네를 함께 만드는 특별한 경험을 할 수 있어요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;

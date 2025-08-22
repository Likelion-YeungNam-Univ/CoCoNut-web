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
import Landing7 from "../assets/Landing7.png";
import { RiArrowDownWideFill } from "react-icons/ri";
import Footer from "../components/Footer.jsx";
import LandingProjectCard from "../main/projectCard/LandingProjectCard.jsx";
const mockProjects = [
  {
    projectId: 1,
    title: "음식점 메뉴판 3장 디자인 필요해요",
    summary:
      "포차 감성 술집을 운영하는 중입니다. 지류 3장 메뉴판 디자인이 필요해요.",
    category: "그래픽/편집",
    businessType: "식당/카페/주점",
    rewardAmount: 300000,
    createdAt: "2025-08-01",
    deadline: "2025-08-27",
    merchantName: "빌런호프",
    writerNickname: "오뚜기",
    submissionsCount: 12,
  },
  {
    projectId: 2,
    title: "쇼핑몰 웹사이트 리뉴얼",
    summary: "현재 운영 중인 쇼핑몰 웹사이트를 반응형으로 개선하고 싶습니다.",
    category: "IT/모바일/웹",
    businessType: "의류/쇼핑몰",
    rewardAmount: 200000,
    createdAt: "2025-08-05",
    deadline: "2025-09-01",
    merchantName: "해피스토어",
    writerNickname: "코딩장인",
    submissionsCount: 7,
  },
  {
    projectId: 3,
    title: "치킨집 포스터 제작 요청",
    summary: "신메뉴 홍보용 포스터가 필요합니다.",
    category: "네이밍/슬로건",
    businessType: "식당/카페/주점",
    rewardAmount: 150000,
    createdAt: "2025-08-07",
    deadline: "2025-08-27",
    merchantName: "치킨천국",
    writerNickname: "최고닭",
    submissionsCount: 25,
  },
  {
    projectId: 4,
    title: "학원 온라인 강의 홍보 영상",
    summary: "신규 개강 수업을 홍보할 짧은 인스타용 영상 편집이 필요합니다.",
    category: "사진/영상/UCC",
    businessType: "교육/학원",
    rewardAmount: 100000,
    createdAt: "2025-08-10",
    deadline: "2025-10-22",
    merchantName: "탑클래스학원",
    writerNickname: "공부의신",
    submissionsCount: 3,
  },
];

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
        <div className="flex space-x-[44px] pl-[240px] pr-[225px]">
          {/* 왼쪽 */}
          <div className="flex-1 flex items-start">
            <img
              src={Landing4}
              alt="랜딩 이미지4"
              className="w-[480px] h-auto rounded-[12px]"
            />
          </div>

          {/* 오른쪽 */}
          <div className="flex-1 flex flex-col justify-between ">
            {/* 텍스트 부분 */}
            <div className="ml-[12px]">
              <p className="text-[#2FD8F6] font-semibold text-[16px] mb-[12px] tracking-[-0.02em]">
                공모전 참여하기
              </p>
              <h2 className="text-[#212121] text-[32px] font-bold leading-[130%] mb-[12px] tracking-[-0.02em] whitespace-nowrap">
                내가 낸 아이디어로 동네를 변화시켜요.
              </h2>
              <p className="text-[#626262] text-[16px] leading-[170%] tracking-[-0.02em]">
                지역 주민 누구나 가게의 새로운 아이디어를 제안할 수 있습니다.
                <br />
                공모전 참여를 넘어 동네를 함께 만드는 특별한 경험을 할 수
                있어요.
              </p>
            </div>
            <div className="flex space-x-[48px] mt-[139px]">
              <img
                src={Landing5}
                alt="랜딩 이미지5"
                className="w-[240px] h-[200px] rounded-[12px]"
              />
              <img
                src={Landing6}
                alt="랜딩 이미지6"
                className="w-[240px] h-[200px] rounded-[12px]"
              />
            </div>
          </div>
        </div>
      </div>
      {/* 여섯 번째 영역 */}
      <div className="flex flex-col items-center bg-white w-full h-[1600px] pt-[130px]">
        {/* 섹션 타이틀 */}
        <div className="flex flex-col items-center mb-[48px]">
          <p className="text-[#2FD8F6] font-semibold text-[16px] mb-[12px]">
            미리보기
          </p>
          <h2 className="text-[#212121] text-[32px] font-bold leading-[130%] tracking-[-0.02em] text-center">
            현재 브릿지에서 진행 중인 공모전을 미리 살펴보세요.
          </h2>
        </div>

        <div className="flex flex-col items-center bg-[#fdfdfd] min-h-screen relative">
          {/* 카드 리스트 */}
          <div className="flex flex-col space-y-[24px] w-[856px] relative z-10">
            {mockProjects.map((project) => (
              <LandingProjectCard key={project.projectId} project={project} />
            ))}
            <div
              className="absolute bottom-0 left-0 w-full h-[200px] 
                bg-gradient-to-b from-transparent to-[#fdfdfd] pointer-events-none"
            ></div>
          </div>

          {/* 다리 이미지 */}
          <div className="w-full relative -mt-[160px] z-0">
            <img
              src={Landing7}
              alt="bridge"
              className="w-full object-contain"
            />
            <div className="absolute bottom-0 left-0 w-full h-[100px] bg-gradient-to-b from-transparent to-white"></div>
          </div>
        </div>

        {/* 하단 버튼 + 작은 텍스트 */}
        <div className="flex flex-col items-center space-y-[16px] mt-[20px]">
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
      </div>
      <Footer />
    </div>
  );
};

export default Landing;

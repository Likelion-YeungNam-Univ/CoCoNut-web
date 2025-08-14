import React from "react";

// 내용은 모두 임시로 작성됨
const PolicyContent = ({ type }) => {
  if (type === "terms") {
    return (
      <div className="text-sm leading-6 text-gray-700 space-y-2">
        <h3 className="font-semibold text-lg mb-2">서비스 이용약관</h3>
        <p>본 약관은 서비스 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.</p>
        <ol className="list-decimal pl-5 space-y-1">
          <li>제1조(목적) …</li>
          <li>제2조(약관의 효력과 변경) …</li>
          <li>제3조(서비스 이용) …</li>
        
        </ol>
      </div>
    );
  }

  if (type === "privacy") {
    return (
      <div className="text-sm leading-6 text-gray-700 space-y-2">
        <h3 className="font-semibold text-lg mb-2">개인정보 수집 및 이용 안내</h3>
        <p>회사는 회원가입 및 서비스 제공을 위해 아래와 같이 개인정보를 수집·이용합니다.</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>수집 항목: 이메일, 닉네임, 이름, 비밀번호</li>
          <li>수집 목적: 회원 식별, 서비스 제공, 고객문의 처리</li>
          <li>보유 기간: 회원 탈퇴 시까지 또는 관련 법령에 따른 보존 기간</li>
        </ul>
        <p>위의 내용에 동의하지 않으면 서비스 이용이 제한될 수 있습니다.</p>
      </div>
    );
  }

  return null;
};

export default PolicyContent;

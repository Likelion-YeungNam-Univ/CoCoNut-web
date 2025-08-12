import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import RendingHeader from "../header/RendingHeader";

export default function Layout() {
  const location = useLocation();

  // 회원가입, 로그인 페이지만 회색 배경
  const isAuthPage =
    location.pathname === "/signup" || location.pathname === "/signin";

  return (
    <div className="min-h-screen flex flex-col">
      <RendingHeader />
      <main className={`flex-1 ${isAuthPage ? "bg-[#F3F3F3]" : "bg-white"}`}>
        <Outlet />
      </main>
    </div>
  );
}

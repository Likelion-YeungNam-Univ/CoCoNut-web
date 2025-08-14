import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import RendingHeader from "../header/RendingHeader";

export default function Layout() {
  const location = useLocation();

  // 헤더 노출 페이지: Rending(/), Signin(/signin), Signup(/signup)
  const showHeader = /^\/($|signin(\/|$)|signup(\/|$))/.test(location.pathname);

  // 회원가입/로그인 페이지만 회색 배경 유지
  const isAuthPage =
    location.pathname === "/signin" ||
    location.pathname === "/signup" ||
    location.pathname.startsWith("/signin/") ||
    location.pathname.startsWith("/signup/");

  return (
    <div className="min-h-screen flex flex-col">
      {showHeader && <RendingHeader />}
      <main className={`flex-1 ${isAuthPage ? "bg-[#F3F3F3]" : "bg-white"}`}>
        <Outlet />
      </main>
    </div>
  );
}

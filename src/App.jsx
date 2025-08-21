import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Rending from "./pages/Rending";
import ProjectRegister from "./pages/ProjectRegister";
import ProjectDetail from "./pages/ProjectDetail.jsx";
import MerchantMainPage from "./pages/MerchantMainPage";
import SearchPage from "./pages/SearchPage";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import AuthProvider from "./contexts/AuthProvider";
import ParticipantMainPage from "./pages/ParticipantMainPage";

import ProjectSubmissionPage from "./pages/ProjectSubmissionPage";

import MerchantMyProject from "./pages/MerchantMyProject.jsx";
import ParticipantMyProject from "./pages/ParticipantMyProject.jsx";
import GuestMainPage from "./pages/GuestMainPage.jsx";


export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Rending />} />
            <Route path="signup" element={<Signup />} />
            <Route path="signin" element={<Signin />} />
            <Route path="/project-register" element={<ProjectRegister />} />
            <Route
              path="/project-detail/:projectId"
              element={<ProjectDetail role="merchant" />}
            />
            <Route
              path="/project-detail-participant/:projectId"
              element={<ProjectDetail role="participant" />}
            />
          </Route>
          <Route path="/merchant-main-page" element={<MerchantMainPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route
            path="/participant-main-page"
            element={<ParticipantMainPage />}
          />
          <Route path="/participant-search" element={<SearchPage />} />
          <Route path="guest-main-page" element={<GuestMainPage />} />
          <Route path="/guest-search" element={<SearchPage />} />
          <Route
            path="/projects/:projectId/submission"
            element={<ProjectSubmissionPage />}
          />
          <Route path="merchant-myproject" element={<MerchantMyProject />} />
          <Route
            path="participant-myproject"
            element={<ParticipantMyProject />}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
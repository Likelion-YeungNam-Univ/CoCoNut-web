import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Rending from "./pages/Rending";
import MerchantMainPage from "./pages/MerchantMainPage";
import SearchPage from "./pages/SearchPage";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import AuthProvider from "./contexts/AuthProvider";
import ParticipantMainPage from "./pages/ParticipantMainPage";
import MerchantVote from "./components/MerchantVote";
import VoteSuccess from "./components/VoteSuccess";
import ParticipantProfile from "./pages/ParticipantProfile";
import WinnerProfile from "./pages/WinnerProfile";
import VoteIng from "./components/VoteIng";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Rending />} />
            <Route path="signup" element={<Signup />} />
            <Route path="signin" element={<Signin />} />
          </Route>
          <Route path="/merchant-main-page" element={<MerchantMainPage />} />
          <Route
            path="/participant-main-page"
            element={<ParticipantMainPage />}
          />
          <Route
            path="/search"
            element={<SearchPage showRegisterButton={true} />}
          />
          <Route
            path="/participant-search"
            element={<SearchPage showRegisterButton={false} />}
          />
-
          <Route path="merchantvote" element={<MerchantVote/>}/> {/*pr보내기전에 확인*/}
          <Route path="vote-success" element={<VoteSuccess/>}/>
          <Route path="participant-profile" element={<ParticipantProfile/>}/>
          <Route path="winner-profile" element={<WinnerProfile/>}/>
          <Route path="voting" element={<VoteIng/>}/> {/*pr올릴때 수정*/}
-
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
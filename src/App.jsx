// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Rending from "./pages/Rending";
import MerchantMainPage from "./pages/MerchantMainPage";
import SearchPage from "./pages/SearchPage";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import AuthProvider from "./contexts/AuthProvider";
import ParticipantMainPage from "./pages/ParticipantMainPage";
import MerchantMy from "./pages/Merchantmy";

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
           <Route path="merchant-mypage" element={<MerchantMy/>}/>
        </Routes>
       
      </BrowserRouter>
    </AuthProvider>
  );
}

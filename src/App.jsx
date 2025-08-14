// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Rending from "./pages/Rending";
import ProjectRegister from "./pages/ProjectRegister";
import RegisterResult from "./pages/RegisterResult";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import AuthProvider from "./contexts/AuthProvider";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Routes from the develop branch */}
          <Route element={<Layout />}>
            <Route index element={<Rending />} />
            <Route path="signup" element={<Signup />} />
            <Route path="signin" element={<Signin />} />
            <Route
              path="/project-register"
              element={<ProjectRegister />}
            ></Route>
            <Route path="/register-result" element={<RegisterResult />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Rending from "./pages/Rending";
import ProjectRegister from "./pages/ProjectRegister";
import RegisterResult from "./pages/RegisterResult";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProjectRegister />}></Route>
        <Route path="/register-result" element={<RegisterResult />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

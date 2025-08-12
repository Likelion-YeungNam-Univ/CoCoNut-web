import { BrowserRouter, Route, Routes } from "react-router-dom";
import Rending from "./pages/Rending";
import MerchantMainPage from "./pages/MerchantMainPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Rending />}></Route>
        <Route path="merchant-main" element={<MerchantMainPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

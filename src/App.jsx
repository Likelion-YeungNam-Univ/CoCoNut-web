import { BrowserRouter, Route, Routes } from "react-router-dom";
import Rending from "./pages/Rending";
import MerchantMainPage from "./pages/MerchantMainPage";
import SearchPage from "./pages/SearchPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Rending />}></Route>
        <Route path="/merchant-main" element={<MerchantMainPage />}></Route>
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

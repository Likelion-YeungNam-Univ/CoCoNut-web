import { BrowserRouter, Route, Routes } from "react-router-dom";
import Rending from "./pages/Rending";

const App = () => {
  return(
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Rending/>}>
    </Route>
  </Routes>
 </BrowserRouter>
 )
};

export default App;

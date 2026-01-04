import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/homepage";
import LoginPage from "./pages/loginpage";
import RegisterPage from "./pages/registerpage";
import FilePage from "./pages/filepage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/kham-pha" element={<div>Trang khám phá</div>} />
        <Route path="/settings" element={<div>Trang cài đặt</div>} />
        <Route path="/files" element={<FilePage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

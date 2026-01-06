import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import HomePage from "./pages/homepage";
import LoginPage from "./pages/loginpage";
import RegisterPage from "./pages/registerpage";
import FilePage from "./pages/filepage";
import { isLoggedIn } from "./utils/auth";
import { useEffect, useState } from "react";
import { useStore } from "./zustand/store";
import { apiClient } from "./services/apiClient";
import type { UserProfile } from "./interfaces/IStore";
const ProtectedRoute = () => {
  const isAuth = isLoggedIn();
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};
const GuestRoute = () => {
  // Lấy thông tin user từ store (hoặc check localStorage nếu muốn nhanh)
  const user = useStore((state) => state.user);
  const token = localStorage.getItem("accessToken");

  // Nếu đã có user HOẶC có token -> Đá về trang chủ ngay lập tức
  if (user || token) {
    return <Navigate to="/" replace />;
  }

  // Nếu chưa đăng nhập -> Cho phép hiển thị trang con (Login/Register)
  return <Outlet />;
};
function App() {
  const { setUser, setIsLogin } = useStore();
  const [isInitializing, setIsInitializing] = useState(true);
  useEffect(() => {
    const initApp = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (token) {
          const userData: UserProfile = await apiClient.get("/user/privateprofile");
          setUser(userData);
          setIsLogin(true);
        } else {
          const data: { accessToken: string } = await apiClient.post(
            "/refresh-token"
          );

          localStorage.setItem("accessToken", data.accessToken);
          const userData: UserProfile = await apiClient.get("/user/privateprofile");
          setUser(userData);
          setIsLogin(true);
        }
      } catch {
        setUser(null);
        setIsLogin(false);
        localStorage.removeItem("accessToken");
      } finally {
        setIsInitializing(false);
      }
    };

    initApp();
  }, [setUser, setIsLogin]);

  if (isInitializing) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route path="/kham-pha" element={<div>Trang khám phá</div>} />
        <Route path="/settings" element={<div>Trang cài đặt</div>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/files" element={<FilePage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

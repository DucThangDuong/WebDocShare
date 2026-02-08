import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import FilePage from "./pages/MyDocumentsPage";
import ShowFile from "./pages/DocumentDetailPage";
import EditDocumentPage from "./pages/EditDocumentPage";
import { isLoggedIn } from "./utils/auth";
import { useEffect, useState } from "react";
import { useStore } from "./zustand/store";
import { apiClient } from "./utils/apiClient";
import type { UserProfilePrivate } from "./interfaces/Types";
import UserProfile from "./pages/MyProfilePage";
import AccountSettings from "./pages/AccountSettingPage";
import "./App.css";
import SearchPage from "./pages/SearchPage";
const ProtectedRoute = () => {
  const isAuth = isLoggedIn();
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};
const GuestRoute = () => {
  const user = useStore((state) => state.user);
  const token = localStorage.getItem("accessToken");
  if (user || token) {
    return <Navigate to="/" replace />;
  }
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
          const userData: UserProfilePrivate = await apiClient.get(
            "/user/privateprofile",
          );
          setUser(userData);
          setIsLogin(true);
        } else {
          const data: { accessToken: string } =
            await apiClient.post("/refresh-token");

          localStorage.setItem("accessToken", data.accessToken);
          const userData: UserProfilePrivate = await apiClient.get(
            "/user/privateprofile",
          );
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
        <Route path="/PDFfile/:docId" element={<ShowFile />} />
        <Route path="/search" element={<SearchPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/files" element={<FilePage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
          <Route path="/myprofile" element={<UserProfile />} />
          <Route path="/account-settings" element={<AccountSettings />} />
          <Route path="/edit-document/:docId" element={<EditDocumentPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

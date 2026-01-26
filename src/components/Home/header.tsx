import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { isLoggedIn, logout } from "../../utils/auth";
import { getMe } from "../../utils/auth";
import { useStore } from "../../zustand/store";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, isLogin, setUser, setIsLogin } = useStore((state) => state);

  useEffect(() => {
    setIsLogin(isLoggedIn());
    const fetchProfile = async () => {
      if (isLogin) {
        try {
          const userData = await getMe();
          setUser(userData);
        } catch (error) {
          console.error("Lỗi lấy thông tin user:", error);
          logout();
        }
      }
    };
    fetchProfile();
  }, [isLogin, setUser, setIsLogin]);

  return (
    <header className="flex items-center whitespace-nowrap border-b border-solid border-[#dbdfe6] px-6 py-3 bg-white z-20 sticky top-0 h-16 shrink-0">
      <div className="flex items-center gap-8 w-full">
        <div className="flex items-center gap-3 text-black min-w-fit md:min-w-[240px]">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-gray-100 text-[#616f89] transition-colors focus:outline-none"
            title="Mở menu"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>

          <h2 className="text-xl font-bold cursor-pointer">BrandLogo</h2>
        </div>

        <div className="hidden md:flex flex-1 max-w-[600px] border border-[#dbdfe6] rounded-lg">
          <label className="flex flex-col w-full h-10">
            <div className="flex w-full flex-1 items-stretch rounded-lg h-full bg-white focus-within:ring-2 focus-within:ring-primary/50 transition-all">
              <div className="text-[#616f89] flex items-center justify-center pl-4 rounded-l-lg border-r-0">
                <span className="material-symbols-outlined text-[20px]">
                  search
                </span>
              </div>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg rounded-l-none border-none bg-transparent focus:outline-0 focus:ring-0 h-full placeholder:text-[#616f89] px-4 pl-2 text-sm font-normal leading-normal text-[#111318]"
                placeholder="Tìm kiếm nội dung, danh mục..."
              />
            </div>
          </label>
        </div>

        <div className="flex flex-1 justify-end gap-4">
          {isLogin && user ? (
            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-bold text-[#111318] leading-tight">
                  {user.fullname || "Người dùng"}
                </span>
                <span className="text-xs text-[#616f89]">{user.email}</span>
              </div>

              <Link
                to={"/myprofile"}
                className="w-10 h-10 rounded-lg overflow-hidden border border-[#dbdfe6] hover:ring-2 hover:ring-primary/20 transition-all"
              >
                {user.avatarurl ? (
                  <img
                    src={`http://localhost:9000/avatar-storage/${user.avatarurl}?v=${new Date().getTime()}`}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#f0f2f4] flex items-center justify-center text-[#616f89]">
                    <span className="material-symbols-outlined">person</span>
                  </div>
                )}
              </Link>

              <button
                onClick={logout}
                className="flex items-center justify-center h-10 w-10 rounded-lg hover:bg-red-50 text-[#616f89] hover:text-red-600 transition-colors"
                title="Đăng xuất"
              >
                <span className="material-symbols-outlined">logout</span>
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-transparent hover:bg-gray-100 text-[#111318] text-sm font-bold leading-normal tracking-[0.015em] transition-colors"
              >
                <span className="truncate">Đăng nhập</span>
              </Link>
              <Link
                to="/register"
                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary hover:bg-primary/90 text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors shadow-sm"
              >
                <span className="truncate">Đăng ký</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

import React, { type ReactNode } from "react";
import Header from "../components/header";
import Sidebar from "../components/sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="bg-background-light  text-[#111318] font-display h-screen flex flex-col overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />
        <main className="flex-1 h-full overflow-y-auto bg-background-light dark:bg-background-dark p-6 md:p-10 scroll-smooth">
          <div className="max-w-[1200px] mx-auto flex flex-col gap-10 pb-20">
            {children}

            <footer className="flex flex-col gap-6 pt-10 mt-10 border-t border-[#dbdfe6] dark:border-gray-800 text-center">
              <div className="flex flex-wrap items-center justify-center gap-6">
                {[
                  "Về chúng tôi",
                  "Liên hệ",
                  "Chính sách bảo mật",
                  "Điều khoản sử dụng",
                ].map((item) => (
                  <a
                    key={item}
                    className="text-[#616f89] hover:text-primary transition-colors text-sm font-normal"
                    href="#"
                  >
                    {item}
                  </a>
                ))}
              </div>
              <p className="text-[#616f89] text-sm font-normal">
                © 2023 BrandLogo. Bảo lưu mọi quyền.
              </p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

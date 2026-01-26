import React, { useState } from "react";
import { Sidebar } from "../components/MySetings/SideBar";
import { AccountSection } from "../components/MySetings/AccountSection";
import { SecuritySection } from "../components/MySetings/SecuritySection";
import DashboardLayout from "../layouts/HomeLayout";
const AccountSettings: React.FC = () => {
  const [NavItemActivate, setNavItemActivate] = useState("profile");
  return (
    <DashboardLayout>
      <div className="bg-[#f6f8f8] text-[#111818] min-h-screen flex flex-col font-display overflow-x-hidden">
        <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 md:px-10 py-6">
          <div className="px-4 mb-8">
            <h1 className="text-[#111818] text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
              Cài đặt tài khoản
            </h1>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 px-4">
            <Sidebar
              NavItemActivate={NavItemActivate}
              setNavItemActivate={setNavItemActivate}
            />
            <div className="flex-1 flex flex-col gap-8">
              {NavItemActivate === "profile" && <AccountSection />}
              {NavItemActivate === "security" && <SecuritySection />}
            </div>
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
};

export default AccountSettings;

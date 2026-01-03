import React from 'react';

const Sidebar: React.FC = () => {
  return (
    <aside className="w-[280px] bg-white dark:bg-[#1a2230] border-r border-[#dbdfe6] dark:border-gray-800 flex flex-col justify-between p-4 shrink-0 overflow-y-auto hidden md:flex h-full">
      <div className="flex flex-col gap-6">
        <div className="flex gap-3 items-center px-2">
          <div
            className="bg-center bg-no-repeat bg-cover rounded-full w-12 h-12 ring-2 ring-primary/10"
            style={{ backgroundImage: "url('https://i.pravatar.cc/150?img=12')" }} 
          ></div>
          <div className="flex flex-col">
            <h1 className="text-[#111318] dark:text-white text-sm font-bold leading-normal">Xin chào, Bạn!</h1>
            <p className="text-[#616f89] text-xs font-normal leading-normal">Tài khoản miễn phí</p>
          </div>
        </div>
        <div className="h-px bg-[#f0f2f4] dark:bg-gray-700 w-full"></div>

        <nav className="flex flex-col gap-1">
          <NavItem icon="home" label="Trang chủ" active />
          <NavItem icon="explore" label="Khám phá" />
          <NavItem icon="category" label="Danh mục" />
          <NavItem icon="favorite" label="Yêu thích" />
        </nav>

        <div className="mt-4">
          <p className="px-3 text-xs font-semibold text-[#616f89] uppercase tracking-wider mb-2">Thư viện</p>
          <nav className="flex flex-col gap-1">
            <NavItem icon="history" label="Gần đây" />
            <NavItem icon="folder_open" label="Tệp của tôi" />
          </nav>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-auto">
        <NavItem icon="settings" label="Cài đặt" />
        <NavItem icon="help" label="Trợ giúp" />
      </div>
    </aside>
  );
};

const NavItem = ({ icon, label, active = false }: { icon: string; label: string; active?: boolean }) => {
  const baseClasses = "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group";
  const activeClasses = "bg-primary/10 text-primary";
  const inactiveClasses = "text-[#616f89] dark:text-gray-400 hover:bg-[#f0f2f4] dark:hover:bg-[#252e40] hover:text-[#111318] dark:hover:text-white";

  return (
    <a href="#" className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}>
      <span className={`material-symbols-outlined text-[20px] ${!active && "group-hover:scale-110 transition-transform"}`}>
        {icon}
      </span>
      <p className="text-sm font-medium leading-normal">{label}</p>
    </a>
  );
};

export default Sidebar;
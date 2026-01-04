import React from "react";
import { Link } from "react-router-dom";
import { useStore } from "../../zustand/store";

const Sidebar: React.FC = () => {
  const { NavItemActivate, setNavItemActivate } = useStore();

  const handleItemClick = (url: string) => {
    setNavItemActivate(url);
  };

  return (
    <aside className="w-[15%] bg-white border-r border-[#dbdfe6] flex-col justify-between p-4 md:flex h-full">
      <div className="flex flex-col gap-6">
        <nav className="flex flex-col gap-1">
          <NavItem
            icon="home"
            label="Trang chủ"
            url="/"
            active={NavItemActivate === "/"}
            onClick={() => handleItemClick("/")}
          />
          <NavItem
            icon="explore"
            label="Khám phá"
            url="/kham-pha"
            active={NavItemActivate === "/kham-pha"}
            onClick={() => handleItemClick("/kham-pha")}
          />
          <NavItem
            icon="category"
            label="Danh mục"
            url="/danh-muc"
            active={NavItemActivate === "/danh-muc"}
            onClick={() => handleItemClick("/danh-muc")}
          />
          <NavItem
            icon="favorite"
            label="Yêu thích"
            url="/yeu-thich"
            active={NavItemActivate === "/yeu-thich"}
            onClick={() => handleItemClick("/yeu-thich")}
          />
        </nav>

        <div className="h-px bg-[#f0f2f4] w-full"></div>

        <div className="mt-4">
          <p className="px-3 text-xs font-semibold text-[#616f89] uppercase tracking-wider mb-2">
            Thư viện
          </p>
          <nav className="flex flex-col gap-1">
            <NavItem
              icon="history"
              label="Gần đây"
              url="/history"
              active={NavItemActivate === "/history"}
              onClick={() => handleItemClick("/history")}
            />
            <NavItem
              icon="folder_open"
              label="Tệp của tôi"
              url="/files"
              active={NavItemActivate === "/files"}
              onClick={() => handleItemClick("/files")}
            />
          </nav>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-auto">
        <NavItem
          icon="settings"
          label="Cài đặt"
          url="/settings"
          active={NavItemActivate === "/settings"}
          onClick={() => handleItemClick("/settings")}
        />
        <NavItem
          icon="help"
          label="Trợ giúp"
          url="/help"
          active={NavItemActivate === "/help"}
          onClick={() => handleItemClick("/help")}
        />
      </div>
    </aside>
  );
};

interface NavItemProps {
  icon: string;
  label: string;
  active?: boolean;
  url: string;
  onClick: () => void;
}

const NavItem = ({
  icon,
  label,
  active = false,
  url,
  onClick,
}: NavItemProps) => {
  const baseClasses =
    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group cursor-pointer";
  const activeClasses = "bg-primary/10 text-primary";

  const inactiveClasses =
    "text-[#616f89] hover:bg-[#f0f2f4] hover:text-[#111318]";

  return (
    <Link
      to={url}
      onClick={onClick}
      className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}
    >
      <span
        className={`material-symbols-outlined text-[20px] ${
          !active && "group-hover:scale-110 transition-transform"
        }`}
      >
        {icon}
      </span>
      <p className="text-sm font-medium leading-normal">{label}</p>
    </Link>
  );
};

export default Sidebar;

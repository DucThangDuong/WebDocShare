import React from "react";
import { Link } from "react-router-dom";
import { useStore } from "../../zustand/store";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { NavItemActivate, setNavItemActivate } = useStore();

  const handleItemClick = (url: string) => {
    setNavItemActivate(url);
    onClose();
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${isOpen
          ? "opacity-100 visible"
          : "opacity-0 invisible pointer-events-none"
          }`}
        onClick={onClose}
      />

      <aside
        className={`fixed top-0 left-0 z-40 h-full w-[280px] bg-white border-r border-[#dbdfe6] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col p-4 ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold px-3">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-muted"
            title="Đóng menu"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-6 overflow-y-auto flex-1 custom-scrollbar">
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
              url="/search"
              active={NavItemActivate === "/search"}
              onClick={() => handleItemClick("/search")}
            />
            <NavItem
              icon="category"
              label="Danh mục"
              url="/categories"
              active={NavItemActivate === "/categories"}
              onClick={() => handleItemClick("/categories")}
            />
            <NavItem
              icon="favorite"
              label="Yêu thích"
              url="/favorites"
              active={NavItemActivate === "/favorites"}
              onClick={() => handleItemClick("/favorites")}
            />
          </nav>
          <div className="h-px bg-[#f0f2f4] w-full shrink-0"></div>
          <div>
            <p className="px-3 text-xs font-semibold text-muted uppercase tracking-wider mb-2">
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
                url="/my-documents"
                active={NavItemActivate === "/my-documents"}
                onClick={() => handleItemClick("/my-documents")}
              />
            </nav>
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-[#f0f2f4]">
          <NavItem
            icon="settings"
            label="Cài đặt"
            url="/account-settings"
            active={NavItemActivate === "/account-settings"}
            onClick={() => handleItemClick("/account-settings")}
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
    </>
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
  return (
    <Link
      to={url}
      onClick={onClick}
      className={`nav-item ${active ? "nav-item-active" : "nav-item-inactive"}`}
    >
      <span
        className={`material-symbols-outlined text-[24px] ${!active && "group-hover:scale-110 transition-transform"
          }`}
      >
        {icon}
      </span>
      <p className="text-sm leading-normal">{label}</p>
    </Link>
  );
};

export default Sidebar;

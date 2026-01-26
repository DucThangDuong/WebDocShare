import { Link } from "react-router-dom";

export const Sidebar: React.FC<{
  NavItemActivate: string;
  setNavItemActivate: (item: string) => void;
}> = ({ NavItemActivate, setNavItemActivate }) => {
  return (
    <aside className="w-full lg:w-72 flex-shrink-0">
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5e7eb]">
        <nav className="flex flex-col gap-2">
          <NavItem
            icon="person"
            label="Tài khoản"
            active={NavItemActivate === "profile"}
            url="#"
            onClick={() => setNavItemActivate("profile")}
          />
          <NavItem
            icon="shield"
            label="Bảo mật"
            url="#"
            active={NavItemActivate === "security"}
            onClick={() => setNavItemActivate("security")}
          />
          <NavItem
            icon="notifications"
            label="Thông báo"
            url="#"
            active={NavItemActivate === "notifications"}
            onClick={() => setNavItemActivate("notifications")}
          />
          <NavItem
            icon="lock"
            label="Quyền riêng tư"
            url="#"
            active={NavItemActivate === "private"}
            onClick={() => setNavItemActivate("private")}
          />
        </nav>
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
const NavItem = ({ icon, label, active, url, onClick }: NavItemProps) => {
  return (
    <Link
      to={url}
      className={`nav-item ${active ? "nav-item-active" : "nav-item-inactive"}`}
      onClick={onClick}
    >
      <span className="material-symbols-outlined text-[24px] group-hover:text-[#111818]">
        {icon}
      </span>
      <span className="text-sm leading-normal group-hover:text-[#111818]">
        {label}
      </span>
    </Link>
  );
};

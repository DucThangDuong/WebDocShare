import { Link } from "react-router-dom";

export const Sidebar: React.FC<{
  AccountItemActivate: string;
  setAccountItemActivate: (item: string) => void;
}> = ({ AccountItemActivate, setAccountItemActivate }) => {
  return (
    <aside className="w-full lg:w-72 flex-shrink-0">
      <div className="section-card p-4">
        <nav className="flex flex-col gap-2">
          <NavItem
            icon="person"
            label="Tài khoản"
            active={AccountItemActivate === "profile"}
            url="#"
            onClick={() => setAccountItemActivate("profile")}
          />
          <NavItem
            icon="shield"
            label="Bảo mật"
            url="#"
            active={AccountItemActivate === "security"}
            onClick={() => setAccountItemActivate("security")}
          />
          <NavItem
            icon="notifications"
            label="Thông báo"
            url="#"
            active={AccountItemActivate === "notifications"}
            onClick={() => setAccountItemActivate("notifications")}
          />
          <NavItem
            icon="lock"
            label="Quyền riêng tư"
            url="#"
            active={AccountItemActivate === "private"}
            onClick={() => setAccountItemActivate("private")}
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

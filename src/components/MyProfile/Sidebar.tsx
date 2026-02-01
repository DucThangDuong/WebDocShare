const Minio_url = import.meta.env.VITE_MinIO_URL;
import { useStore } from "../../zustand/store";
export const ProfileSidebar = () => {
  const { user } = useStore();
  const displayAvatar = `url("${Minio_url}/avatar-storage/${user?.avatarurl}?v=${new Date().getTime()}")`;
  return (
    <aside className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6 ">
      <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100 flex flex-col items-center text-center">
        <div className="relative group mb-4">
          <div
            className="w-32 h-32 rounded-full bg-cover bg-center shadow-md ring-4 ring-white transition-all duration-300"
            style={{ backgroundImage: displayAvatar }}
          ></div>
        </div>

        <div className="mb-1 w-full flex justify-center">
          <h1 className="text-2xl font-bold text-text-main overflow-hidden">
            {user?.fullname}
          </h1>
        </div>
        <div className="w-full flex flex-col gap-4 pt-6 border-t border-gray-100">
          <ContactItem icon="mail" label="Email" value={user?.email} />
        </div>
        <div className="w-full flex flex-col gap-4 pt-6 border-t border-gray-100">
          <ContactItem
            icon="person"
            label="Người dùng"
            value={`@${user?.username}`}
          />
        </div>
      </div>
    </aside>
  );
};

const ContactItem = ({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string | undefined;
}) => (
  <div className="flex items-center gap-3 text-sm">
    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-text-secondary">
      <span className="material-symbols-outlined text-[18px]">{icon}</span>
    </div>
    <div className="flex flex-col items-start">
      <span className="text-xs text-text-secondary uppercase font-bold tracking-wider">
        {label}
      </span>
      <span className="text-text-main font-medium truncate max-w-[180px]">
        {value}
      </span>
    </div>
  </div>
);

import React from "react";

export const UserStats: React.FC = () => {
  const stats = [
    {
      label: "Tài liệu đã đăng",
      value: "124",
      icon: "description",
      color: "blue",
    },
    {
      label: "Tài liệu đã lưu",
      value: "45",
      icon: "bookmark",
      color: "purple",
    },
    { label: "Lượt thích", value: "1.2k", icon: "thumb_up", color: "orange" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="bg-white p-5 rounded-2xl shadow-soft border border-gray-100 flex items-center gap-4"
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center bg-${stat.color}-50 text-${stat.color}-600`}
          >
            <span className="material-symbols-outlined text-[24px]">
              {stat.icon}
            </span>
          </div>
          <div>
            <p className="text-2xl font-bold text-text-main">{stat.value}</p>
            <p className="text-sm text-text-secondary">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

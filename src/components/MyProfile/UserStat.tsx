import React from "react";
import { apiClient } from "../../utils/apiClient";
import type { ResUserStatsDto } from "../../interfaces/UserTypes";

export const UserStats: React.FC = () => {
  const [stats, setStats] = React.useState<ResUserStatsDto | null>(null);

  React.useEffect(() => {
    const fetchStats = async () => {
      const data = await apiClient.get<ResUserStatsDto>("/documents/stats");
      setStats(data);
    };
    fetchStats();
  }, []);

  if (!stats) {
    return null;
  }

  const statItems = [
    { icon: "upload_file", color: "blue", value: stats.uploadCount, label: "Tài liệu" },
    { icon: "bookmark", color: "green", value: stats.savedCount, label: "Đã lưu" },
    { icon: "thumb_up", color: "red", value: stats.totalLikesReceived, label: "lượt thích" },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {statItems.map((stat, idx) => (
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

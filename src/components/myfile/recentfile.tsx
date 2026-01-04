import React from "react";
import type { RecentFile } from "../../interfaces/Types";

interface RecentFileCardProps {
  file: RecentFile;
}

export const RecentFileCard: React.FC<RecentFileCardProps> = ({ file }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case "image":
        return { icon: "image", color: "text-blue-600", bg: "bg-blue-100" };
      case "excel":
        return {
          icon: "table_chart",
          color: "text-green-600",
          bg: "bg-green-100",
        };
      default:
        return {
          icon: "picture_as_pdf",
          color: "text-red-600",
          bg: "bg-red-100",
        };
    }
  };

  const style = getIcon(file.type);

  return (
    <div className="group cursor-pointer p-4 rounded-xl border border-[#dbdfe6] bg-white hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div
          className={`size-10 rounded ${style.bg} flex items-center justify-center ${style.color}`}
        >
          <span className="material-symbols-outlined">{style.icon}</span>
        </div>
        <span className="material-symbols-outlined text-[#616f89] hover:text-[#111318] cursor-pointer">
          more_vert
        </span>
      </div>
      <h3 className="font-semibold text-[#111318] truncate mb-1">
        {file.name}
      </h3>
      <p className="text-xs text-[#616f89]">{file.actionTime}</p>
    </div>
  );
};

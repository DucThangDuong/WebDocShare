import React from "react";
import type { DocumentInfor } from "../../interfaces/Types";

interface Props {
  doc: DocumentInfor;
}

export const DocumentItem: React.FC<Props> = ({ doc }) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };
  return (
    <div className="group flex flex-col md:flex-row items-start md:items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all bg-white">
      <div className="flex-grow min-w-0">
        <h5 className="font-bold text-text-main truncate group-hover:text-primary transition-colors cursor-pointer">
          {doc.title}
        </h5>
        <div className="flex items-center gap-3 mt-1 text-xs text-text-secondary">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">
              calendar_today
            </span>
            {doc.createdAt}
          </span>
          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
          <span>{formatFileSize(Number.parseInt(doc.sizeInBytes) || 0)}</span>
          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0 justify-end">
        <span className="flex items-center gap-1 text-xs text-text-secondary mr-2">
          <span className="material-symbols-outlined text-[16px]">
            visibility
          </span>
          {doc.viewCount > 1000
            ? `${(doc.viewCount / 1000).toFixed(1)}k`
            : doc.viewCount}
        </span>
        <button className="p-2 hover:bg-gray-100 rounded-lg text-text-secondary transition-colors">
          <span className="material-symbols-outlined text-[20px]">
            download
          </span>
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-lg text-text-secondary transition-colors">
          <span className="material-symbols-outlined text-[20px]">
            more_vert
          </span>
        </button>
      </div>
    </div>
  );
};

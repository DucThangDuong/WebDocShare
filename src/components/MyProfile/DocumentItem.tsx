import React from "react";
import type { DocumentInfor } from "../../interfaces/DocumentTypes";
import { formatFileSize } from "../../utils/formatUtils";

interface Props {
  doc: DocumentInfor;
}

export const DocumentItem: React.FC<Props> = ({ doc }) => {
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
    </div>
  );
};

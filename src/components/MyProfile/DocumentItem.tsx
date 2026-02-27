import React from "react";
import { useNavigate } from "react-router-dom";
import type { DocumentSummary } from "../../interfaces/DocumentTypes";
import { formatDate } from "../../utils/formatUtils";

interface Props {
  doc: DocumentSummary;
}

export const DocumentItem: React.FC<Props> = ({ doc }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/documents/${doc.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group flex flex-col md:flex-row items-start md:items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all bg-white cursor-pointer"
    >
      <div className="flex-grow min-w-0">
        <h5 className="font-bold text-text-main truncate group-hover:text-primary transition-colors">
          {doc.title}
        </h5>
        <div className="flex items-center justify-between gap-3 mt-1 text-xs text-text-secondary">
          <span className="flex items-center gap-1">Ngày đăng tải:
            <span className="material-symbols-outlined text-[14px]">
              calendar_today
            </span>
            {formatDate(doc.createdAt)}
          </span>
          <span className="flex items-center gap-1">Lượt thích:
            <span className="material-symbols-outlined text-[14px]">
              favorite
            </span>
            {doc.likeCount}
          </span>
        </div>
      </div>
    </div>
  );
};

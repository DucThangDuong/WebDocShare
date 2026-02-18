const Minio_url = import.meta.env.VITE_MinIO_URL;
import React from "react";
import type { DocumentSummary } from "../../interfaces/Types";
import { useNavigate } from "react-router-dom";

interface SearchResultItemProps {
  document: DocumentSummary;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({ document }) => {
  const navigate = useNavigate();
  const handleItemClick = () => {
    navigate(`/documents/${document.id}`);
  };
  return (
    <div
      onClick={handleItemClick}
      className="bg-white p-4 rounded-xl shadow-sm border border-[#e2e8f0] flex gap-4 hover:shadow-md transition-shadow group cursor-pointer"
    >
      {/* Thumbnail Area */}
      <div className="w-16 h-20 md:w-20 md:h-24 flex-shrink-0 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden relative">
        <div
          style={{
            backgroundImage: `url('${Minio_url}/thumb-storage/${document.thumbnail}')`,
          }}
          className="absolute inset-0 flex items-center justify-center bg-cover bg-center"
        >
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base md:text-lg font-semibold text-primary group-hover:underline decoration-2 underline-offset-2 line-clamp-2">
              {document.title}
            </h2>
          </div>
          {/* Rating Section */}
          <div
            className={`flex flex-col items-center gap-1 text-gray-400`}
          >
            <span className="material-symbols-outlined hover:text-primary transition-colors">
              thumb_up
            </span>
            <span className={`text-xs font-bold text-gray-400 `}>{document.likeCount}</span>
          </div>
        </div>

        {/* Details Section */}
        <div className="mt-2 space-y-1 text-sm text-[#64748b]">
          <p>
            <span className="overflow-hidden font-medium text-[#334155]">
              Danh mục:
            </span>{" "}
            {document.tags?.join(",")}
          </p>
        </div>

        {/* Footer Info */}
        <div className="mt-3 flex items-center gap-4 text-xs text-[#64748b]">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">
              description
            </span>
            {document.pageCount} pages
          </div>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">
              calendar_today
            </span>
            {document.createdAt ? document.createdAt.substring(0, 10) : ""}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultItem;

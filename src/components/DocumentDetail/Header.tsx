import React from "react";
interface HeaderProps {
  fileName: string;
  onDownload: () => void;
  isDownloading?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  fileName,
  onDownload,
  isDownloading = false,
}) => {
  return (
    <header className="h-16 flex items-center justify-between px-4 border-b bg-white z-20 shadow-sm top-0 left-0 sticky">
      <div className="flex items-center gap-4 min-w-[200px]">
        <div className="flex items-center justify-center p-2 rounded-lg bg-blue-50 text-blue-600">
          <span className="material-symbols-outlined">description</span>
        </div>
        <div className="flex flex-col">
          <h1
            className="text-sm font-bold leading-tight line-clamp-1 max-w-[200px]"
            title={fileName}
          >
            {fileName}
          </h1>
        </div>
      </div>

      <button
        onClick={onDownload}
        disabled={isDownloading}
        className={`h-9 px-4 rounded-lg flex items-center gap-2 text-sm font-medium transition-all ${
          isDownloading
            ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
            : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow"
        }`}
      >
        {isDownloading ? (
          <>
            <span className="material-symbols-outlined animate-spin text-[18px]">
              progress_activity
            </span>
            <span>Đang tải...</span>
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-[18px]">
              download
            </span>
            <span>Tải xuống</span>
          </>
        )}
      </button>
    </header>
  );
};

const Minio_url = import.meta.env.VITE_MinIO_URL;
import React, { useRef } from "react";
import type { DocumentDetailEdit } from "../../interfaces/DocumentTypes";
import { formatFileSize } from "../../utils/formatUtils";

interface PreviewPanelProps {
  document: DocumentDetailEdit | null;
  pendingDelete: boolean;
  pendingNewFile: File | null;
  onMarkDelete: () => void;
  onCancelDelete: () => void;
  onSelectNewFile: (file: File) => void;
  onCancelNewFile: () => void;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({
  document,
  pendingDelete,
  pendingNewFile,
  onMarkDelete,
  onCancelDelete,
  onSelectNewFile,
  onCancelNewFile,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!document) return null;

  const hasFile = !!document.fileUrl;
  const showFilePreview = (hasFile && !pendingDelete) || pendingNewFile;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const handleDeleteClick = () => {
    onMarkDelete();
  };
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSelectNewFile(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleChangeFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleAddFileClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white dark:bg-[#1A2C2C] rounded-xl p-6 shadow-sm border border-[#dbe6e6] dark:border-gray-700 h-fit sticky top-6">
        <h3 className="text-[#111818] dark:text-white text-lg font-bold mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined">visibility</span>
          Xem trước
        </h3>

        {/* Thumbnail Container */}
        <div className="bg-[#f6f8f8] dark:bg-gray-900 rounded-lg p-8 flex items-center justify-center mb-4 border border-[#dbe6e6] dark:border-gray-700 group cursor-pointer relative overflow-hidden">
          {/* Document shadow effect */}
          <div className="relative w-40 h-56 bg-white shadow-lg transition-transform transform group-hover:-translate-y-1 duration-300">
            {/* Top pattern to simulate document header */}
            <div
              className="h-full w-full bg-cover bg-center"
              style={{
                backgroundImage: `url("${Minio_url}/thumb-storage/${document.thumbnail}")`,
              }}
            ></div>
          </div>
        </div>

        {/* File Details */}
        <div className="flex flex-col gap-3 border-t border-[#dbe6e6] dark:border-gray-700 pt-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-alt">Loại tệp:</span>
            <span className="text-[#111818] dark:text-white font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-red-500 text-[18px]">
                picture_as_pdf
              </span>
              PDF
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-alt">Kích thước:</span>
            <span className="text-[#111818] dark:text-white font-medium">
              {formatFileSize(Number(document.sizeInBytes) || 0)}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-alt">Ngày tải lên:</span>
            <span className="text-[#111818] dark:text-white font-medium">
              {formatDate(document.createdAt)}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-alt">Số trang:</span>
            <span className="text-[#111818] dark:text-white font-medium">
              {document.pageCount}
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-4 flex flex-col gap-2">
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept=".pdf"
            className="hidden"
          />

          {/* Pending Delete Warning */}
          {pendingDelete && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-2">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm font-medium mb-2">
                <span className="material-symbols-outlined text-[18px]">
                  warning
                </span>
                Tệp sẽ bị xóa khi lưu
              </div>
              <button
                type="button"
                onClick={onCancelDelete}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-[#111818] dark:text-white text-sm font-medium transition-colors border border-gray-200 dark:border-gray-600"
              >
                <span className="material-symbols-outlined text-[18px]">
                  undo
                </span>
                Hoàn tác xóa
              </button>
            </div>
          )}

          {/* Pending New File Info */}
          {pendingNewFile && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-2">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-medium mb-1">
                <span className="material-symbols-outlined text-[18px]">
                  upload_file
                </span>
                Tệp mới đã chọn
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 truncate mb-2">
                {pendingNewFile.name} ({formatFileSize(pendingNewFile.size)})
              </p>
              <button
                type="button"
                onClick={onCancelNewFile}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-[#111818] dark:text-white text-sm font-medium transition-colors border border-gray-200 dark:border-gray-600"
              >
                <span className="material-symbols-outlined text-[18px]">
                  close
                </span>
                Hủy chọn tệp
              </button>
            </div>
          )}

          {/* Action Buttons */}
          {showFilePreview && !pendingDelete ? (
            <>
              <button
                type="button"
                onClick={handleDeleteClick}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#f6f8f8] dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">
                  delete
                </span>
                Xóa tệp
              </button>
              <button
                type="button"
                onClick={handleChangeFileClick}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#f6f8f8] dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-[#111818] dark:text-white text-sm font-medium transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">
                  edit_document
                </span>
                Thay đổi tài liệu
              </button>
            </>
          ) : !pendingDelete && !pendingNewFile ? (
            <button
              type="button"
              onClick={handleAddFileClick}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#19a463] hover:bg-[#148f54] text-white text-sm font-medium transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Thêm tệp
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default PreviewPanel;

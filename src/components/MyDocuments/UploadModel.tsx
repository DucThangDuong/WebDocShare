import React, { useState, useRef } from "react";
import type {
  FileDocument,
  FileItem,
  FileData,
  UserStorageFile,
} from "../../interfaces/Types";
import { apiClient } from "../../utils/apiClient";
import { useStore } from "../../zustand/store";
import DocumentListUpload from "./DocumentListUpload";
interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [tempEditData, setTempEditData] = useState<FileDocument | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    fileList,
    setFileList,
    setFiles,
    setUserStorageFiles,
    signalRConnectionId,
    updateFileStatus,
  } = useStore();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    const newFilesArray: FileItem[] = Array.from(files)
      .filter((file) => file.type === "application/pdf")
      .map((file) => ({
        id: file.name + Date.now() + Math.random(),
        file: file,
        uploadStatus: "uploading",
        metaData: {
          title: file.name.replace(".pdf", ""),
          description: "",
          tags: "",
          status: "Public",
        },
      }));
    setFileList([...fileList, ...newFilesArray]);

    newFilesArray.forEach((newFile) => {
      const formData = new FormData();
      formData.append("File", newFile.file);
      formData.append("SignalRConnectionID", signalRConnectionId || "");
      formData.append("Title", newFile.id);
      apiClient.postForm("/document/check", formData).then(
        (response) => {
          if (response.status !== 200) {
            updateFileStatus(newFile.id, "error");
          }
        },
        () => {
          updateFileStatus(newFile.id, "error");
        },
      );
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  // tải tất cả file lên server
  const handleUploadFiles = async () => {
    if (fileList.length === 0) return;
    try {
      for (const item of fileList) {
        const formData = new FormData();
        formData.append("File", item.file);
        formData.append("Title", item.metaData.title || item.file.name);
        formData.append("Description", item.metaData.description);
        formData.append("Tags", item.metaData.tags.trim());
        formData.append("Status", item.metaData.status);
        await apiClient.postForm("/document", formData);
        const fetchFiles = apiClient.get<FileData[]>("/documents");
        const fetchUserStoragefiles = apiClient.get<UserStorageFile>(
          "/user/filedocs?skip=0&take=10",
        );
        Promise.all([fetchFiles, fetchUserStoragefiles])
          .then(([filesData, userStorageFilesData]) => {
            setFiles(filesData);
            setUserStorageFiles(userStorageFilesData);
          })
          .catch((error) => {
            console.error("Error fetching files or user storage files:", error);
          });
        setExpandedIndex(null);
        setTempEditData(null);
        setFileList([]);
      }
      onClose();
    } catch (error) {
      console.error("Lỗi upload:", error);
      alert("Có lỗi xảy ra khi tải lên.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-[800px] bg-white rounded-xl shadow-2xl border border-[#e5e7eb] overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0f2f4]">
          <h2 className="text-[#111318] text-xl font-bold leading-tight">
            Tải lên tài liệu mới
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-[#616f89] hover:bg-gray-100 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 flex flex-col gap-6">
          <p className="text-[#616f89] text-base font-normal -mt-2">
            Chỉ hỗ trợ định dạng PDF, kích thước tối đa 50MB.
          </p>

          {/* Vùng nhận file pdf */}
          <div className="group relative flex flex-col items-center gap-4 rounded-xl border-2 border-dashed border-[#dbdfe6] bg-[#f9fafb] hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 px-6 py-10 cursor-pointer">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              multiple
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
            <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[32px]">
                cloud_upload
              </span>
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <p className="text-[#111318] text-lg font-bold">
                Kéo thả nhiều tệp vào đây
              </p>
              <p className="text-[#616f89] text-sm">
                hoặc nhấn để chọn từ máy tính
              </p>
            </div>
          </div>

          {/* Danh sách file */}
          <DocumentListUpload
            expandedIndex={expandedIndex}
            setExpandedIndex={setExpandedIndex}
            setTempEditData={setTempEditData}
            tempEditData={tempEditData}
          />
        </div>

        {/* Footer hành động cho danh sách  */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-[#f9fafb] border-t border-[#dbdfe6]">
          <button onClick={onClose} className="btn-cancel">
            Hủy bỏ
          </button>
          <button
            disabled={
              fileList.length === 0 ||
              fileList.some((e) => e.uploadStatus == "success") != true
            }
            className="btn-change"
            onClick={handleUploadFiles}
          >
            <span className="material-symbols-outlined text-[20px]">
              upload
            </span>
            Tải lên tất cả ({fileList.length})
          </button>
        </div>
      </div>
    </div>
  );
};

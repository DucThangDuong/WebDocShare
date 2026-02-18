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
          tags: [],
          status: "Public",
        },
      }));
    setFileList([...fileList, ...newFilesArray]);

    newFilesArray.forEach((newFile) => {
      const formData = new FormData();
      formData.append("File", newFile.file);
      formData.append("SignalRConnectionID", signalRConnectionId || "");
      formData.append("Title", newFile.id);
      apiClient.postForm("/documents/scan", formData).then(
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
  const handleUploadFiles = async () => {
    if (fileList.length === 0) return;

    const successFileIds = new Set<string>();

    await Promise.all(
      fileList.map(async (item) => {
        try {
          // Cập nhật trạng thái đang upload
          updateFileStatus(item.id, "uploading");

          const formData = new FormData();
          formData.append("File", item.file);
          formData.append("Title", item.metaData.title || item.file.name);
          formData.append("Description", item.metaData.description || "");
          for (const tag of item.metaData.tags) {
            formData.append("Tags", tag.trim());
          }
          formData.append("Status", item.metaData.status);

          await apiClient.postForm("/documents", formData);
          successFileIds.add(item.id);
          updateFileStatus(item.id, "success");
        } catch (error) {
          console.error("Lỗi upload file:", item.metaData.title, error);
          updateFileStatus(item.id, "error");
        }
      })
    );

    // Refresh dữ liệu nền
    try {
      const [filesData, userStorageFilesData] = await Promise.all([
        apiClient.get<FileData[]>("/documents"),
        apiClient.get<UserStorageFile>("/user/me/storage"),
      ]);
      setFiles(filesData);
      setUserStorageFiles(userStorageFilesData);
    } catch (error) {
      console.error("Lỗi làm mới dữ liệu:", error);
    }

    // Lọc danh sách: bỏ file thành công, giữ lại file lỗi
    const remainingFiles = fileList
      .filter((file) => !successFileIds.has(file.id))
      .map((file) => ({
        ...file,
        uploadStatus: "error" as const,
      }));

    if (remainingFiles.length === 0) {
      setExpandedIndex(null);
      setTempEditData(null);
      setFileList([]);
      onClose();
    } else {
      setFileList(remainingFiles);
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
          <h2 className="text-body text-xl font-bold leading-tight">
            Tải lên tài liệu mới
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-muted hover:bg-gray-100 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 flex flex-col gap-6">
          <p className="text-muted text-base font-normal -mt-2">
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
              <p className="text-body text-lg font-bold">
                Kéo thả nhiều tệp vào đây
              </p>
              <p className="text-muted text-sm">
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

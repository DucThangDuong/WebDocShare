import React, { useState, useRef } from "react";
import type {
  FileMetaData,
  FileItem,
  FileData,
  UserStorageFile,
} from "../../interfaces/Types";
import { apiClient } from "../../services/apiClient";
import { useStore } from "../../zustand/store";
interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [tempEditData, setTempEditData] = useState<FileMetaData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    fileList,
    setFileList,
    setFiles,
    setUserStorageFiles,
    signalRConnectionId,
    updateFileStatus,
  } = useStore();

  // thêm file vào danh sách khi chọn file
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
        }
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
        formData.append(
          "Tags",
          item.metaData.tags.trim() == "" ? "A" : item.metaData.tags
        );
        formData.append("Status", item.metaData.status);
        await apiClient.postForm("/document", formData);
        const fetchFiles = apiClient.get<FileData[]>("/documents");
        const fetchUserStoragefiles = apiClient.get<UserStorageFile>(
          "/user/filedocs?skip=0&take=10"
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
  // xóa file khỏi danh sách
  const handleRemoveFile = (e: React.MouseEvent, indexToRemove: number) => {
    e.stopPropagation();
    const newListFile = fileList.filter((_, index) => index !== indexToRemove);
    setFileList(newListFile);
    if (expandedIndex === indexToRemove) {
      setExpandedIndex(null);
      setTempEditData(null);
    } else if (expandedIndex !== null && expandedIndex > indexToRemove) {
      setExpandedIndex(expandedIndex - 1);
    }
  };

  // --- LOGIC CHỈNH SỬA & LƯU/HỦY ---

  // Khi bấm vào file để mở form
  const handleStartEdit = (index: number) => {
    if (expandedIndex === index) {
      // Đang mở mà bấm lại -> coi như Hủy (Đóng lại)
      handleCancelEdit();
    } else {
      // Mở file mới -> Copy dữ liệu hiện tại vào Temp để sửa
      setExpandedIndex(index);
      setTempEditData({ ...fileList[index].metaData });
    }
  };

  // Khi sửa input (cập nhật vào Temp)
  const handleInputChange = (field: keyof FileMetaData, value: string) => {
    if (tempEditData) {
      setTempEditData({ ...tempEditData, [field]: value });
    }
  };

  // Khi bấm LƯU
  const handleSaveEdit = () => {
    if (expandedIndex !== null && tempEditData) {
      const newList = [...fileList];
      newList[expandedIndex] = {
        ...newList[expandedIndex],
        metaData: tempEditData,
      };
      setFileList(newList);
      // Đóng form
      setExpandedIndex(null);
      setTempEditData(null);
    }
  };

  // Khi bấm HỦY
  const handleCancelEdit = () => {
    // Chỉ cần đóng form, không cập nhật gì cả
    setExpandedIndex(null);
    setTempEditData(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
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
          {fileList.length > 0 && (
            <div className="flex flex-col gap-3 animate-in slide-in-from-top-2 duration-300">
              <h3 className="text-sm font-semibold text-[#111318] uppercase tracking-wider mb-1">
                Danh sách tệp ({fileList.length})
              </h3>
              {/* vòng lặp hiện các file đã up lên */}
              {fileList.map((item, index) => {
                const isExpanded = expandedIndex === index;

                return (
                  <div
                    key={item.id}
                    className="flex flex-col gap-0 transition-all"
                  >
                    {/* FILE CARD */}
                    <div
                      onClick={() => handleStartEdit(index)}
                      className={`flex items-center gap-4 rounded-lg p-3 border cursor-pointer relative transition-colors
                        ${
                          isExpanded
                            ? "bg-primary/5 border-primary ring-1 ring-primary rounded-b-none border-b-0"
                            : "bg-[#f6f6f8] border-[#f0f2f4] hover:border-primary/50"
                        }
                      `}
                    >
                      {/* icon file */}
                      <div className="text-[#eb3b3b] flex items-center justify-center rounded-lg bg-white size-12 shadow-sm">
                        <span className="material-symbols-outlined text-[28px]">
                          picture_as_pdf
                        </span>
                      </div>
                      {/* thông tin file */}
                      <div className="flex flex-col justify-center flex-1 min-w-0 gap-1">
                        {/* tên file */}
                        <div className="flex justify-between items-center">
                          <p className="text-[#111318] text-sm font-medium line-clamp-1">
                            {item.metaData.title || item.file.name}
                          </p>
                          <button
                            onClick={(e) => handleRemoveFile(e, index)}
                            className="text-[#616f89] hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors z-20"
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              close
                            </span>
                          </button>
                        </div>
                        {/* tiến trình */}
                        <div className="flex flex-col gap-1 w-full mt-1">
                          <div className="flex items-center justify-between text-xs">
                            {/* Dung lượng file */}
                            <span className="text-[#616f89] font-medium">
                              {formatFileSize(item.file.size)}
                            </span>
                            {/* Trạng thái Upload */}
                            <div className="flex items-center gap-1.5">
                              {item.uploadStatus === "pending" && (
                                <span className="text-gray-500 font-medium flex items-center gap-1">
                                  <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                                  Sẵn sàng
                                </span>
                              )}
                              {item.uploadStatus === "uploading" && (
                                <span className="text-blue-600 font-medium flex items-center gap-1 animate-pulse">
                                  <span className="material-symbols-outlined text-[14px] animate-spin">
                                    progress_activity
                                  </span>
                                  Đang xử lý...
                                </span>
                              )}
                              {item.uploadStatus === "success" && (
                                <span className="text-green-600 font-bold flex items-center gap-1">
                                  <span className="material-symbols-outlined text-[16px]">
                                    check_circle
                                  </span>
                                  Thành công
                                </span>
                              )}
                              {item.uploadStatus === "error" && (
                                <span className="text-red-500 font-bold flex items-center gap-1">
                                  <span className="material-symbols-outlined text-[16px]">
                                    error
                                  </span>
                                  Lỗi
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* khi mà click vào file thì hiện form chỉnh sửa */}
                    {isExpanded && tempEditData && (
                      <div className="border border-t-0 border-primary/30 rounded-b-lg bg-white p-4 animate-in slide-in-from-top-1 duration-200 shadow-sm flex flex-col gap-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          {/* chỉnh title */}
                          <div className="flex flex-col gap-2 md:col-span-2">
                            <label className="text-black text-xs font-bold uppercase ">
                              Tiêu đề tệp
                            </label>
                            <input
                              type="text"
                              value={tempEditData.title}
                              onChange={(e) =>
                                handleInputChange("title", e.target.value)
                              }
                              className="form-input w-full rounded-lg border border-[#dbdfe6] bg-white text-[#111318] px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                          </div>
                          {/* chỉnh mô tả */}
                          <div className="flex flex-col gap-2 md:col-span-2">
                            <label className="text-[#111318] text-sm font-medium">
                              Mô tả
                            </label>
                            <textarea
                              rows={2}
                              value={tempEditData.description}
                              onChange={(e) =>
                                handleInputChange("description", e.target.value)
                              }
                              className="form-textarea w-full rounded-lg border border-[#dbdfe6] bg-white text-[#111318] px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                              placeholder="Ghi chú..."
                            ></textarea>
                          </div>
                          {/* chỉnh tag */}
                          <div className="flex flex-col gap-2">
                            <label className="text-[#111318] text-sm font-medium">
                              Thẻ phân loại
                            </label>
                            <input
                              type="text"
                              value={tempEditData.tags}
                              onChange={(e) =>
                                handleInputChange("tags", e.target.value)
                              }
                              className="form-input w-full rounded-lg border border-[#dbdfe6] bg-white text-[#111318] px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                              placeholder="VD: Tài chính..."
                            />
                          </div>
                          {/* chỉnh quyền */}
                          <div className="flex flex-col gap-2">
                            <label className="text-[#111318] text-sm font-medium">
                              Quyền
                            </label>
                            <select
                              value={tempEditData.status}
                              onChange={(e) =>
                                handleInputChange("status", e.target.value)
                              }
                              className="form-select w-full rounded-lg border border-[#dbdfe6] bg-white text-black px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                            >
                              <option value="Private">Riêng tư</option>
                              <option value="Public">Công khai</option>
                            </select>
                          </div>
                        </div>

                        {/* hành động lưu các chỉnh sửa */}
                        <div className="flex items-center justify-end gap-3 pt-2 border-t border-dashed border-gray-200">
                          <button
                            onClick={handleCancelEdit}
                            className="px-4 py-2 rounded-lg text-xs font-bold text-[#616f89] hover:bg-gray-100 hover:text-red-500 transition-colors"
                          >
                            Hủy bỏ
                          </button>
                          <button
                            onClick={handleSaveEdit}
                            className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-primary hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              check
                            </span>
                            Lưu thay đổi
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer hành động cho danh sách  */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-[#f9fafb] border-t border-[#dbdfe6]">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-[#616f89] hover:bg-gray-100 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            disabled={fileList.length === 0}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-primary hover:bg-blue-700 shadow-sm transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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

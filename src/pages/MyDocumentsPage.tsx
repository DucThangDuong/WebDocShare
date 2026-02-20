import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/HomeLayout";
import { StatsCard } from "../components/MyDocuments/StatsCard";
import { FileTable } from "../components/MyDocuments/DocumentList";
import { UploadModal } from "../components/MyDocuments/UploadModal";
import type { DocumentDetailEdit, UserStorageFile } from "../interfaces/Types";
import { apiClient } from "../utils/apiClient";
import { useStore } from "../zustand/store";
import { formatFileSize } from "../utils/formatUtils";

const FilesPage: React.FC = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { files, setFiles, userStorageFiles, setUserStorageFiles } = useStore();
  const [totalUpload, settotalupload] = useState<number | null>(0);

  useEffect(() => {
    const fetchFiles = apiClient.get<DocumentDetailEdit[]>("/documents?skip=0&take=10");
    const fetchUserStoragefiles =
      apiClient.get<UserStorageFile>("/user/me/storage");
    Promise.all([fetchFiles, fetchUserStoragefiles])
      .then(([filesData, userStorageFilesData]) => {
        setFiles(filesData);
        setUserStorageFiles(userStorageFilesData);
      })
      .catch((error) => {
        console.error("Error fetching files or user storage files:", error);
      });
  }, [setFiles, setUserStorageFiles]);
  useEffect(() => {
    if (files != null) {
      const countFilesThisMonth = () => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const total = files.filter((file) => {
          if (!file.createdAt) return false;
          const fileDate = new Date(file.createdAt);
          return (
            fileDate.getMonth() === currentMonth &&
            fileDate.getFullYear() === currentYear
          );
        }).length;
        settotalupload(total);
      };
      countFilesThisMonth();
    }
  }, [files]);

  return (
    <DashboardLayout>
      <div className="flex-1 overflow-y-auto bg-background-light p-6 md:p-10 scroll-smooth">
        <div className="max-w-[1200px] mx-auto flex flex-col gap-8 pb-20">
          {/* Header Section */}
          <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-black  text-3xl font-bold ">Tệp của tôi</h1>
              <p className="text-[#616f89] text-base font-normal ">
                Quản lý tất cả tài liệu PDF của bạn tại đây.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-primary hover:bg-primary/90 text-white text-sm font-bold transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">
                  upload_file
                </span>
                <span>Tải lên PDF mới</span>
              </button>
            </div>
          </section>
          {/* thông tin documents */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatsCard
              title="Tổng dung lượng"
              icon="cloud_queue"
              iconColorClass="text-primary bg-primary/10"
              subValue={
                userStorageFiles
                  ? formatFileSize(userStorageFiles.storageLimit)
                  : "0 Bytes"
              }
              value={
                userStorageFiles
                  ? formatFileSize(userStorageFiles.usedStorage)
                  : "0 Bytes "
              }
              progress={
                userStorageFiles
                  ? Math.round(
                    (userStorageFiles.usedStorage /
                      userStorageFiles.storageLimit) *
                    100,
                  )
                  : 0
              }
            />
            <StatsCard
              title="Tổng số tệp"
              icon="description"
              iconColorClass="text-purple-600 bg-purple-100"
              value={
                userStorageFiles ? userStorageFiles.totalCount.toString() : "0"
              }
              description={`Đã tải lên trong tháng này: ${totalUpload}`}
            />
            <StatsCard
              title="Thùng rác"
              icon="delete_outline"
              iconColorClass="text-red-600 bg-red-100"
              value={userStorageFiles ? userStorageFiles.trash.toString() : "0"}
              description="Tự động xóa sau 30 ngày"
            />
          </section>

          {/* danh sách documents */}
          <section className="bg-white border border-[#dbdfe6] rounded-xl  shadow-sm">
            <div className="px-6 py-4 border-b border-[#dbdfe6] flex items-center justify-between">
              <h3 className="font-bold text-lg text-[#111318]">
                Danh sách tệp tin
              </h3>
            </div>

            <FileTable files={files} />
          </section>
        </div>
      </div>
      {/* html tải documennt lên */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </DashboardLayout>
  );
};

export default FilesPage;

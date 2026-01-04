import React, { useState } from "react";
import DashboardLayout from "../layouts/dashboardlayout";
import { StatsCard } from "../components/myfile/statscard";
import { FileTable } from "../components/myfile/filetable";
import { RecentFileCard } from "../components/myfile/recentfile";
import { UploadModal } from "../components/myfile/uploadmodal";
import type { FileData, RecentFile } from "../interfaces/Types";

const FilesPage: React.FC = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const files: FileData[] = [
    {
      id: "1",
      name: "Bao_cao_tai_chinh_2023.pdf",
      date: "15 Thg 12, 2023",
      size: "2.4 MB",
      type: "pdf",
    },
    {
      id: "2",
      name: "Hop_dong_lao_dong_NV01.pdf",
      date: "20 Thg 11, 2023",
      size: "1.1 MB",
      type: "pdf",
    },
    {
      id: "3",
      name: "Huong_dan_su_dung.pdf",
      date: "10 Thg 11, 2023",
      size: "5.8 MB",
      type: "pdf",
    },
    {
      id: "4",
      name: "Ke_hoach_marketing_Q4.pdf",
      date: "05 Thg 11, 2023",
      size: "3.2 MB",
      type: "pdf",
    },
  ];

  const recentFiles: RecentFile[] = [
    {
      id: "1",
      name: "Thiet_ke_Banner.png",
      actionTime: "Đã chỉnh sửa 2 giờ trước",
      type: "image",
    },
    {
      id: "2",
      name: "Slide_Thuyet_trinh.pdf",
      actionTime: "Đã mở 5 giờ trước",
      type: "pdf",
    },
    {
      id: "3",
      name: "Bang_luong_T11.xlsx",
      actionTime: "Đã tải lên hôm qua",
      type: "excel",
    },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-1 overflow-hidden ">
        <main className="flex-1 overflow-y-auto bg-background-light p-6 md:p-10 scroll-smooth">
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

            {/* Stats Grid */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatsCard
                title="Tổng dung lượng"
                icon="cloud_queue"
                iconColorClass="text-primary bg-primary/10"
                value="2.4 GB"
                subValue=" 10 GB"
                progress={24}
              />
              <StatsCard
                title="Tổng số tệp"
                icon="description"
                iconColorClass="text-purple-600 bg-purple-100"
                value="128"
                description="Đã tải lên trong tháng này: 12"
              />
              <StatsCard
                title="Thùng rác"
                icon="delete_outline"
                iconColorClass="text-red-600 bg-red-100"
                value="3"
                description="Tự động xóa sau 30 ngày"
              />
            </section>

            {/* Files Table Section */}
            <section className="bg-white border border-[#dbdfe6] rounded-xl  shadow-sm">
              <div className="px-6 py-4 border-b border-[#dbdfe6] flex items-center justify-between">
                <h3 className="font-bold text-lg text-[#111318]">
                  Danh sách tệp tin
                </h3>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded text-[#616f89]">
                    <span className="material-symbols-outlined text-[20px]">
                      view_list
                    </span>
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded text-[#616f89]">
                    <span className="material-symbols-outlined text-[20px]">
                      grid_view
                    </span>
                  </button>
                </div>
              </div>

              <FileTable files={files} />

              <div className="px-6 py-4 border-t border-[#dbdfe6] flex items-center justify-between">
                <p className="text-sm text-[#616f89]">
                  Hiển thị 1 đến 4 trong số 128 tệp
                </p>
                <div className="flex items-center gap-2">
                  <button
                    className="px-3 py-1 rounded border border-[#dbdfe6] text-[#616f89] hover:bg-gray-50 text-sm disabled:opacity-50"
                    disabled
                  >
                    Trước
                  </button>
                  <button className="px-3 py-1 rounded border border-[#dbdfe6] text-[#616f89] hover:bg-gray-50 text-sm">
                    Sau
                  </button>
                </div>
              </div>
            </section>

            {/* Recent Files Section */}
            <section className="flex flex-col gap-4">
              <h2 className="text-[#111318] text-xl font-bold leading-tight">
                Gần đây
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {recentFiles.map((file) => (
                  <RecentFileCard key={file.id} file={file} />
                ))}
              </div>
            </section>
          </div>
        </main>
        <UploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)} 
        />
      </div>
    </DashboardLayout>
  );
};

export default FilesPage;

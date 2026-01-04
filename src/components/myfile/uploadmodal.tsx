import React, { useState } from "react";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [uploadProgress] = useState(45);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      {/* Modal Content Wrapper */}
      <div
        className="w-full max-w-[800px] bg-white rounded-xl shadow-2xl border border-[#e5e7eb] overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()} 
      >
        {/* Header Modal */}
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

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 flex flex-col gap-6">
          {/* Heading description */}
          <p className="text-[#616f89] text-base font-normal -mt-2">
            Chỉ hỗ trợ định dạng PDF, kích thước tối đa 50MB.
          </p>

          {/* Drag & Drop Zone */}
          <div className="group relative flex flex-col items-center gap-4 rounded-xl border-2 border-dashed border-[#dbdfe6] bg-[#f9fafb] hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 px-6 py-10 cursor-pointer">
            <input
              type="file"
              accept=".pdf"
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
            <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[32px]">
                cloud_upload
              </span>
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <p className="text-[#111318] text-lg font-bold">
                Kéo và thả tệp của bạn vào đây
              </p>
              <p className="text-[#616f89] text-sm">
                hoặc chọn tệp từ máy tính
              </p>
            </div>
            <button className="mt-2 flex items-center justify-center rounded-lg h-9 px-5 bg-white border border-[#dbdfe6] text-[#111318] text-sm font-medium shadow-sm group-hover:border-primary group-hover:text-primary transition-all">
              Chọn tệp
            </button>
          </div>

          {/* Selected File List */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-[#111318] uppercase tracking-wider">
              Tệp đang chọn
            </h3>
            <div className="flex items-center gap-4 bg-[#f6f6f8] rounded-lg p-3 border border-[#f0f2f4] relative">
              <div className="text-[#eb3b3b] flex items-center justify-center rounded-lg bg-white shrink-0 size-12 shadow-sm">
                <span className="material-symbols-outlined text-[28px]">
                  picture_as_pdf
                </span>
              </div>
              <div className="flex flex-col justify-center flex-1 min-w-0 gap-1">
                <div className="flex justify-between items-center">
                  <p className="text-[#111318] text-sm font-medium line-clamp-1">
                    bao_cao_tai_chinh_q1_2024.pdf
                  </p>
                  <button className="text-[#616f89] hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors">
                    <span className="material-symbols-outlined text-[20px]">
                      close
                    </span>
                  </button>
                </div>
                {/* Progress Bar */}
                <div className="flex flex-col gap-1.5 w-full">
                  <div className="w-full h-1.5 rounded-full bg-[#dbdfe6] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-[#616f89]">
                    <span>5.2 MB / 12.5 MB</span>
                    <span>{uploadProgress}% • Đang tải lên...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#f0f2f4] w-full"></div>

          {/* Metadata Form */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-[#111318] text-sm font-medium">
                Tiêu đề tệp <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="form-input w-full rounded-lg border border-[#dbdfe6] bg-white text-[#111318] px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-gray-400"
                placeholder="Nhập tiêu đề hiển thị"
                defaultValue="Báo cáo tài chính Quý 1 2024"
              />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-[#111318] text-sm font-medium">
                Mô tả{" "}
                <span className="text-[#616f89] font-normal">(Tùy chọn)</span>
              </label>
              <textarea
                rows={3}
                className="form-textarea w-full rounded-lg border border-[#dbdfe6] bg-white text-[#111318] px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-gray-400 resize-none"
                placeholder="Thêm ghi chú về tài liệu này..."
              ></textarea>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[#111318] text-sm font-medium">
                Thẻ phân loại
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-gray-400 text-[18px]">
                    label
                  </span>
                </div>
                <input
                  type="text"
                  className="form-input w-full rounded-lg border border-[#dbdfe6] bg-white text-[#111318] pl-9 pr-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-gray-400"
                  placeholder="VD: Tài chính, 2024..."
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[#111318] text-sm font-medium">
                Quyền truy cập
              </label>
              <select className="form-select w-full rounded-lg border border-[#dbdfe6] bg-white text-[#111318] px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary">
                <option>Riêng tư (Chỉ mình tôi)</option>
                <option>Công khai trong tổ chức</option>
                <option>Chia sẻ với người cụ thể</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-[#f9fafb] border-t border-[#dbdfe6]">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-[#616f89] hover:bg-gray-100 transition-colors"
          >
            Hủy bỏ
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-primary hover:bg-blue-700 shadow-sm transition-all transform active:scale-95">
            <span className="material-symbols-outlined text-[20px]">
              upload
            </span>
            Tải lên
          </button>
        </div>
      </div>
    </div>
  );
};

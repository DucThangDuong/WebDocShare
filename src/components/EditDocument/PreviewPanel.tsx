import React from "react";
import type { DocumentInfor } from "../../interfaces/Types";

interface PreviewPanelProps {
    document: DocumentInfor | null;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ document }) => {
    if (!document) return null;

    const formatSize = (size: string) => {
        const bytes = Number(size);
        if (!bytes || isNaN(bytes)) return size;
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN");
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
                                backgroundImage:
                                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDZKuy3uH92-LDYXwt0q1DTz_gve1h5H3lpYNu4UXX6zqFcLqpHoE2SdxJeUwfOhprILK_RFgq2AXBSjHFEwFFZ03H6UTsy6pO0hjU7xeB0yIErpp6r92dfGX7sc3zSoxKFH7FxT74boBhDLNp2M2d87_ej-Cz5IptE1UlIvW28Uokp3Q39pZbzcq4NL9fkvixIDOzeOaDTqi4DCglDVSpGbR18SBlWwYglKRxIB5vDJImn8bk8VGT-Ge32QM41Sc4LicpBItMZbVw')",
                            }}
                        ></div>
                        {/* Overlay icon */}
                        <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-white/90 p-2 rounded-full shadow-md">
                                <span className="material-symbols-outlined text-gray-800">
                                    zoom_in
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* File Details */}
                <div className="flex flex-col gap-3 border-t border-[#dbe6e6] dark:border-gray-700 pt-4">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-[#618989]">Loại tệp:</span>
                        <span className="text-[#111818] dark:text-white font-medium flex items-center gap-1">
                            <span className="material-symbols-outlined text-red-500 text-[18px]">
                                picture_as_pdf
                            </span>
                            PDF
                        </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-[#618989]">Kích thước:</span>
                        <span className="text-[#111818] dark:text-white font-medium">
                            {formatSize(document.sizeInBytes)}
                        </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-[#618989]">Ngày tải lên:</span>
                        <span className="text-[#111818] dark:text-white font-medium">
                            {formatDate(document.createdAt)}
                        </span>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                    <button
                        type="button"
                        className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#f6f8f8] dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-[#111818] dark:text-white text-sm font-medium transition-colors"
                    >
                        <span className="material-symbols-outlined text-[18px]">
                            edit_document
                        </span>
                        Thay đổi tài liệu
                    </button>
                    <button
                        type="button"
                        className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#f6f8f8] dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium transition-colors"
                    >
                        <span className="material-symbols-outlined text-[18px]">
                            delete
                        </span>
                        Xóa tệp
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PreviewPanel;

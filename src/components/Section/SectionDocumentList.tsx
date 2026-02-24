const Minio_url = import.meta.env.VITE_MinIO_URL;
import React from "react";
import type { DocumentSummary } from "../../interfaces/DocumentTypes";

interface SectionDocumentListProps {
    documents: DocumentSummary[];
    loading: boolean;
    searchQuery: string;
    onDocumentClick: (docId: string) => void;
}

const SectionDocumentList: React.FC<SectionDocumentListProps> = ({
    documents,
    loading,
    searchQuery,
    onDocumentClick,
}) => {
    return (
        <section>
            <h2 className="text-xl font-bold text-[#111318] mb-5 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                    description
                </span>
                Tất cả tài liệu
            </h2>

            {/* Sort bar */}
            <div className="flex items-center gap-6 mb-4 border-b border-gray-200 pb-2">
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 font-semibold text-gray-800 pb-2 border-b-2 border-primary text-sm">
                        Ngày tải lên
                        <span className="material-symbols-outlined text-sm">
                            expand_more
                        </span>
                    </button>
                    <button className="flex items-center gap-1 font-medium text-gray-500 pb-2 hover:text-gray-800 transition-colors text-sm">
                        Yêu thích
                        <span className="material-symbols-outlined text-sm">
                            expand_more
                        </span>
                    </button>
                </div>
            </div>

            {/* Document list */}
            {loading ? (
                <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex items-center p-4 bg-white rounded-xl"
                        >
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-[#f1f5f9] rounded-lg animate-pulse mr-4 flex-shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="h-5 w-3/4 bg-[#f1f5f9] rounded animate-pulse" />
                                <div className="h-3 w-1/4 bg-[#f1f5f9] rounded animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : documents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4 bg-white rounded-2xl border border-dashed border-[#e5e7eb]">
                    <span className="material-symbols-outlined text-6xl text-[#cbd5e1]">
                        description
                    </span>
                    <p className="text-[#64748b] text-lg font-medium">
                        {searchQuery
                            ? "Không tìm thấy tài liệu nào"
                            : "Chưa có tài liệu nào"}
                    </p>
                    <p className="text-[#94a3b8] text-sm">
                        {searchQuery
                            ? "Thử từ khóa khác"
                            : "Hãy là người đầu tiên đăng tải tài liệu!"}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {documents.map((doc) => (
                        <button
                            key={doc.id}
                            type="button"
                            onClick={() => onDocumentClick(doc.id)}
                            className="group flex items-center w-full p-4 bg-white rounded-xl border border-transparent hover:border-gray-200 hover:shadow-sm transition-all text-left"
                        >
                            {/* Thumbnail */}
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden shadow-sm mr-4 border border-gray-200">
                                {doc.thumbnail ? (
                                    <img
                                        alt={doc.title}
                                        className="w-full h-full object-cover"
                                        src={`${Minio_url}/thumb-storage/${doc.thumbnail}`}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-red-50">
                                        <span className="material-symbols-outlined text-2xl text-red-400">
                                            picture_as_pdf
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <h3 className="text-primary font-semibold text-base md:text-lg mb-1 group-hover:underline truncate">
                                    {doc.title}
                                </h3>
                                <div className="flex items-center text-sm text-gray-500 gap-3">
                                    <span className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[16px]">
                                            description
                                        </span>
                                        {doc.pageCount} trang
                                    </span>
                                    {doc.tags && doc.tags.length > 0 && (
                                        <span className="text-xs text-gray-400">
                                            {doc.tags.slice(0, 2).join(" • ")}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Metadata */}
                            <div className="flex flex-col items-end gap-1 ml-4 min-w-[140px]">
                                <div className="flex items-center text-sm text-gray-500 mb-1">
                                    <span className="material-symbols-outlined text-[16px] mr-1">
                                        calendar_today
                                    </span>
                                    {new Date(doc.createdAt).toLocaleDateString("vi-VN")}
                                </div>
                                <div
                                    className={`flex items-center font-medium text-green-500`}
                                >
                                    <span className="material-symbols-outlined text-[16px] mr-1">
                                        thumb_up
                                    </span>

                                    <span>
                                        {doc.likeCount}
                                        <span className="text-gray-400 ml-1 text-sm font-normal">
                                            lượt thích
                                        </span>
                                    </span>

                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </section>
    );
};

export default SectionDocumentList;

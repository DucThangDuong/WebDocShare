const Minio_url = import.meta.env.VITE_MinIO_URL;
import React, { useRef } from "react";
import type { DocumentSummary } from "../../interfaces/DocumentTypes";

interface SectionTrendingProps {
    documents: DocumentSummary[];
    onDocumentClick: (docId: string) => void;
}

const SectionTrending: React.FC<SectionTrendingProps> = ({
    documents,
    onDocumentClick,
}) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const scrollAmount = 280;
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    if (documents.length === 0) return null;

    return (
        <section>
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-[#111318] flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">
                        trending_up
                    </span>
                    Nổi bật
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => scroll("left")}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
                    >
                        <span className="material-symbols-outlined text-sm">
                            arrow_back_ios_new
                        </span>
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
                    >
                        <span className="material-symbols-outlined text-sm">
                            arrow_forward_ios
                        </span>
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="overflow-x-auto hide-scrollbar pb-4"
            >
                <div className="flex gap-4 min-w-max">
                    {documents.map((doc) => (
                        <button
                            key={doc.id}
                            type="button"
                            onClick={() => onDocumentClick(doc.id)}
                            className="w-64 flex flex-col group cursor-pointer text-left flex-shrink-0"
                        >
                            {/* Thumbnail */}
                            <div className="relative bg-gray-100 rounded-xl overflow-hidden aspect-[4/3] border border-gray-200">
                                {doc.thumbnail ? (
                                    <img
                                        alt={doc.title}
                                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                        src={`${Minio_url}/thumb-storage/${doc.thumbnail}`}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-red-50">
                                        <span className="material-symbols-outlined text-[48px] text-red-400">
                                            picture_as_pdf
                                        </span>
                                    </div>
                                )}
                                {/* Page count badge */}
                                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded backdrop-blur-sm">
                                    {doc.pageCount}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="mt-3">
                                <h3 className="text-primary font-semibold text-sm line-clamp-2 leading-snug group-hover:underline">
                                    {doc.title}
                                </h3>
                                {doc.tags && doc.tags.length > 0 && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        {doc.tags.slice(0, 2).join(" • ")}
                                    </p>
                                )}
                                {/* Like badge */}
                                <div className="flex items-center gap-1 mt-2 bg-gray-50 w-fit px-2 py-1 rounded-full border border-gray-100">
                                    <span
                                        className={`material-symbols-outlined text-sm ${doc.likeCount > 0
                                                ? "text-green-500"
                                                : "text-gray-400"
                                            }`}
                                    >
                                        thumb_up
                                    </span>
                                    <span className="text-xs font-medium text-gray-700">
                                        {doc.likeCount > 0 ? (
                                            <>
                                                {doc.likeCount}
                                                <span className="text-gray-400 ml-0.5">lượt thích</span>
                                            </>
                                        ) : (
                                            <span className="text-gray-500">Chưa có</span>
                                        )}
                                    </span>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SectionTrending;

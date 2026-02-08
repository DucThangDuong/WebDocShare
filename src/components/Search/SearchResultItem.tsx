
import React from 'react';

// Using a slightly more flexible interface for the document item
// based on the fields visible in trash.html
export interface SearchDocument {
    id: string | number;
    title: string;
    category: string;
    university: string;
    pageCount: number;
    year: string;
    description: string; // The type/tag rendered in the blue pill (e.g. "Lecture notes")
    thumbnailIcon?: string; // "description", "article", "show_chart", "lightbulb"
    rating?: string; // "100% (1)" or "None"
}

interface SearchResultItemProps {
    document: SearchDocument;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({ document }) => {
    return (
        <div className="bg-white dark:bg-[#1e293b] p-4 rounded-xl shadow-sm border border-[#e2e8f0] dark:border-[#334155] flex gap-4 hover:shadow-md transition-shadow group cursor-pointer">
            <div className="w-16 h-20 md:w-20 md:h-24 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-gray-400 text-3xl">
                        {document.thumbnailIcon || 'description'}
                    </span>
                </div>
                {/* Decorative lines to look like a document */}
                <div className="absolute top-2 left-2 right-2 space-y-1 opacity-40">
                    <div className="h-1 bg-gray-400 rounded w-3/4"></div>
                    <div className="h-1 bg-gray-400 rounded w-full"></div>
                    <div className="h-1 bg-gray-400 rounded w-5/6"></div>
                </div>
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-base md:text-lg font-semibold text-primary dark:text-sky-400 group-hover:underline decoration-2 underline-offset-2 line-clamp-2">
                            {document.title}
                        </h2>
                        <div className="mt-1 flex items-center gap-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200">
                                {document.description}
                            </span>
                        </div>
                    </div>
                    <div className={`flex flex-col items-center gap-1 ${document.rating !== 'None' ? 'text-emerald-500' : 'text-gray-400 dark:text-gray-500'}`}>
                        <span className="material-symbols-outlined hover:text-primary transition-colors">thumb_up</span>
                        <span className="text-xs font-bold">{document.rating}</span>
                    </div>
                </div>

                <div className="mt-2 space-y-1 text-sm text-[#64748b] dark:text-[#94a3b8]">
                    <p>
                        <span className="font-medium text-[#334155] dark:text-[#e2e8f0]">Danh mục:</span> {document.category}
                    </p>
                    <p>
                        <span className="font-medium text-[#334155] dark:text-[#e2e8f0]">Đại học:</span> {document.university}
                    </p>
                </div>

                <div className="mt-3 flex items-center gap-4 text-xs text-[#64748b] dark:text-[#94a3b8]">
                    <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">description</span>
                        {document.pageCount} pages
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">calendar_today</span>
                        {document.year}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchResultItem;

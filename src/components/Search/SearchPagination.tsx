
import React from 'react';

interface SearchPaginationProps {
    currentPage?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
}

const SearchPagination: React.FC<SearchPaginationProps> = ({ currentPage = 1, totalPages = 12, onPageChange }) => {
    return (
        <div className="mt-8 flex justify-center pb-8">
            <nav className="flex items-center gap-1">
                <button
                    className="p-2 rounded-lg text-[#64748b] dark:text-[#94a3b8] hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                    disabled={currentPage <= 1}
                    onClick={() => onPageChange?.(currentPage - 1)}
                >
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>

                {/* Simple pagination logic logic for demo purposes */}
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white font-medium text-sm">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-[#334155] dark:text-[#e2e8f0] hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium text-sm">2</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-[#334155] dark:text-[#e2e8f0] hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium text-sm">3</button>
                <span className="px-2 text-[#64748b] dark:text-[#94a3b8]">...</span>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-[#334155] dark:text-[#e2e8f0] hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium text-sm">12</button>

                <button
                    className="p-2 rounded-lg text-[#64748b] dark:text-[#94a3b8] hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => onPageChange?.(currentPage + 1)}
                >
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
            </nav>
        </div>
    );
};

export default SearchPagination;


import React from 'react';

interface SearchPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const SearchPagination: React.FC<SearchPaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const getPageNumbers = (): (number | '...')[] => {
        const pages: (number | '...')[] = [];

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
            return pages;
        }

        pages.push(1);

        if (currentPage > 3) {
            pages.push('...');
        }

        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (currentPage < totalPages - 2) {
            pages.push('...');
        }
        pages.push(totalPages);

        return pages;
    };

    return (
        <div className="mt-8 flex justify-center pb-8">
            <nav className="flex items-center gap-1">
                <button
                    className="p-2 rounded-lg text-[#64748b] hover:bg-gray-100 transition-colors disabled:opacity-50"
                    disabled={currentPage <= 1}
                    onClick={() => onPageChange(currentPage - 1)}
                >
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>

                {getPageNumbers().map((page, index) =>
                    page === '...' ? (
                        <span key={`dots-${index}`} className="px-2 text-[#64748b]">...</span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg font-medium text-sm transition-colors ${currentPage === page
                                ? 'bg-primary text-white'
                                : 'text-[#334155] hover:bg-gray-100'
                                }`}
                        >
                            {page}
                        </button>
                    )
                )}

                <button
                    className="p-2 rounded-lg text-[#64748b] hover:bg-gray-100 transition-colors disabled:opacity-50"
                    disabled={currentPage >= totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                >
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
            </nav>
        </div>
    );
};

export default SearchPagination;

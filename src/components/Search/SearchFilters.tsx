import React from 'react';
import type { Tag } from '../../interfaces/Types';


interface SearchFiltersProps {
    selectedFilter?: number;
    onFilterSelect?: (filter: number) => void;
    tags: Tag[];
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ selectedFilter, onFilterSelect, tags }) => {
    return (
        <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-muted dark:text-[#94a3b8] mr-2">Tags:</span>
            <button
                key={0}
                onClick={() => onFilterSelect?.(0)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${selectedFilter === 0
                    ? "bg-primary text-white"
                    : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-[#334155] dark:text-[#e2e8f0]"
                    }`}
            >
                Tất cả
            </button>
            {tags.map((filter) => (
                <button
                    key={filter.id}
                    onClick={() => onFilterSelect?.(filter.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${selectedFilter === filter.id
                        ? "bg-primary text-white"
                        : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-[#334155] dark:text-[#e2e8f0]"
                        }`}
                >
                    {filter.name}
                </button>
            ))}
        </div>
    );
};

export default SearchFilters;

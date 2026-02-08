
import React from 'react';

// This could be dynamic in the future
const FILTERS = [
    "Lecture notes",
    "Tutorial work",
    "Research Project",
    "Other",
    "Mẫu đơn",
    "Sách giáo khoa"
];

interface SearchFiltersProps {
    selectedFilter?: string;
    onFilterSelect?: (filter: string) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ selectedFilter, onFilterSelect }) => {
    return (
        <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-[#616f89] dark:text-[#94a3b8] mr-2">Tags:</span>
            {FILTERS.map((filter) => (
                <button
                    key={filter}
                    onClick={() => onFilterSelect?.(filter)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${selectedFilter === filter
                            ? "bg-primary text-white"
                            : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-[#334155] dark:text-[#e2e8f0]"
                        }`}
                >
                    {filter}
                </button>
            ))}
        </div>
    );
};

export default SearchFilters;

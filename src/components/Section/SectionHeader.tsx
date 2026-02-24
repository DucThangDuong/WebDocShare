import React from "react";
import { Link } from "react-router-dom";
import type { Universities, UniversitySection } from "../../interfaces/UniversityTypes";

interface SectionHeaderProps {
    university: Universities | null;
    universityId: string | undefined;
    section: UniversitySection | null;
    documentCount: number;
    searchQuery: string;
    onSearchChange: (value: string) => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
    university,
    universityId,
    section,
    documentCount,
    searchQuery,
    onSearchChange,
}) => {
    return (
        <header className="bg-[#ecfccb] rounded-2xl px-6 md:px-8 pt-6 pb-8 mb-8 border border-lime-200">
            {/* Breadcrumb */}
            <nav className="text-sm font-medium mb-6 flex items-center flex-wrap gap-1">
                <Link
                    to="/explore"
                    className="text-blue-500 hover:underline"
                >
                    Đại học
                </Link>
                <span className="text-gray-400 mx-1">›</span>
                <Link
                    to={`/explore/universities/${universityId}`}
                    className="text-blue-500 hover:underline"
                >
                    {university?.name || "Trường"}
                </Link>
                <span className="text-gray-400 mx-1">›</span>
                <span className="text-gray-600">{section?.name}</span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="flex-1">
                    {/* Section title */}
                    <div className="flex items-start gap-4 mb-4">
                        <div className="w-14 h-11 bg-green-500 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                            <span className="material-symbols-outlined text-white text-3xl">
                                folder
                            </span>
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                {section?.name}
                            </h1>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[18px]">
                                        description
                                    </span>
                                    {documentCount} tài liệu
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-3">
                        <button className="bg-primary hover:bg-[#2563eb] text-white px-6 py-2 rounded-full font-medium flex items-center gap-2 transition-colors shadow-sm text-sm">
                            <span className="material-symbols-outlined text-lg">add</span>
                            Theo dõi
                        </button>
                        <button className="bg-white hover:bg-gray-50 text-gray-700 px-5 py-2 rounded-full font-medium flex items-center gap-2 shadow-sm transition-colors text-sm">
                            <span className="material-symbols-outlined text-lg">share</span>
                            Chia sẻ
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="w-full md:w-80 lg:w-96 mt-2 md:mt-0">
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-gray-400 text-xl">
                                search
                            </span>
                        </span>
                        <input
                            type="text"
                            placeholder={`Tìm trong ${section?.name || "chuyên mục"}...`}
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="block w-full pl-10 pr-4 py-2.5 border-none rounded-full leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm text-sm"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default SectionHeader;

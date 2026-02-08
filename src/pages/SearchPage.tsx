
import React, { useState } from 'react';
import DashboardLayout from '../layouts/HomeLayout';
import SearchFilters from '../components/Search/SearchFilters';
import SearchResultItem, { type SearchDocument } from '../components/Search/SearchResultItem';
import SearchPagination from '../components/Search/SearchPagination';

const MOCK_RESULTS: SearchDocument[] = [
    {
        id: 1,
        title: "Đề Nghị Cấp Tín Dụng PVcomBank – Thông Tin Khách Hàng 2024",
        category: "Mẫu đơn hướng dẫn",
        university: "Đại học Kinh tế Quốc dân",
        pageCount: 2,
        year: "2017/2018",
        description: "Lecture notes",
        thumbnailIcon: "description",
        rating: "100% (1)"
    },
    {
        id: 2,
        title: "IT Information Systems Strategy for Efficiency and Flexibility (ISSE/ISSF)",
        category: "Research Project (RP1y)",
        university: "Học viện Ngân hàng",
        pageCount: 3,
        year: "2024/2025",
        description: "Other",
        thumbnailIcon: "article",
        rating: "None"
    },
    {
        id: 3,
        title: "LAB1: Vẽ Biểu đồ Line và Màu sắc trong Matplotlib – IT101",
        category: "Luật Cạnh tranh (NTTL1)",
        university: "Đại học Nguyễn Tất Thành",
        pageCount: 46,
        year: "2020/2021",
        description: "Lecture notes",
        thumbnailIcon: "show_chart",
        rating: "None"
    },
    {
        id: 4,
        title: "Exploring Daydreams: A Creative Adventure in Imagination",
        category: "Nhập môn mạng máy tính (NW2020)",
        university: "Trường Đại Học Hải Phòng",
        pageCount: 1,
        year: "2025/2026",
        description: "Tutorial work",
        thumbnailIcon: "lightbulb",
        rating: "None"
    }
];

const SearchPage: React.FC = () => {
    const [selectedFilter, setSelectedFilter] = useState<string | undefined>(undefined);

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto w-full">
                <div className="mb-6">
                    <h1 className="text-2xl lg:text-3xl font-bold text-[#334155] dark:text-[#e2e8f0] mb-4">
                        Kết quả tìm kiếm tài liệu
                    </h1>
                    <SearchFilters
                        selectedFilter={selectedFilter}
                        onFilterSelect={setSelectedFilter}
                    />
                </div>

                <div className="space-y-4">
                    {MOCK_RESULTS.map((doc) => (
                        <SearchResultItem key={doc.id} document={doc} />
                    ))}
                </div>

                <SearchPagination />
            </div>
        </DashboardLayout>
    );
};

export default SearchPage;

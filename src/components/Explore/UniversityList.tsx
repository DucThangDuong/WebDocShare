import React, { useState, useEffect, useMemo } from "react";
import { apiClient } from "../../utils/apiClient";
import type { Universities } from "../../interfaces/UniversityTypes";
import UniversityCard from "./UniversityCard";
import SearchPagination from "../Search/SearchPagination";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 10;

const UniversityList: React.FC = () => {
  const navigate = useNavigate();
  const [universities, setUniversities] = useState<Universities[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchUniversities = async () => {
      setLoading(true);
      try {
        const data = await apiClient.get<Universities[]>("/universities");
        setUniversities(data);
      } catch (error) {
        console.error("Error fetching universities:", error);
        setUniversities([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUniversities();
  }, []);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const filteredUniversities = useMemo(() => {
    if (!searchQuery.trim()) return universities;
    const query = searchQuery.toLowerCase().trim();
    return universities.filter(
      (uni) =>
        uni.name.toLowerCase().includes(query) ||
        uni.code.toLowerCase().includes(query),
    );
  }, [universities, searchQuery]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUniversities.length / ITEMS_PER_PAGE),
  );

  const paginatedUniversities = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUniversities.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUniversities, currentPage]);

  const handleUniversityClick = (university: Universities) => {
    navigate(`/explore/universities/${university.id}`);
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="explore-hero">
        <div className="explore-hero__icon">
          <span className="material-symbols-outlined text-5xl text-primary">
            account_balance
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-[#111318] text-center">
          Danh mục <span className="text-primary">Trường Đại học</span>
        </h1>
        <p className="text-[#64748b] text-base md:text-lg max-w-2xl font-normal text-center leading-relaxed">
          Khám phá kho tàng tri thức từ hàng trăm trường đại học trên cả nước.
          Tìm kiếm trường của bạn để bắt đầu chia sẻ và học tập.
        </p>

        {/* Search Bar */}
        <div className="w-full max-w-2xl mt-2">
          <label className="explore-search" id="university-search-bar">
            <span className="explore-search__icon">
              <span className="material-symbols-outlined text-2xl">search</span>
            </span>
            <input
              className="explore-search__input"
              placeholder="Tìm kiếm trường đại học..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="absolute right-3 p-1.5 text-[#94a3b8] hover:text-[#111318] hover:bg-[#f1f5f9] rounded-lg transition-colors"
                onClick={() => setSearchQuery("")}
                type="button"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            )}
          </label>
        </div>
      </div>

      {/* Stats & Sort Bar */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#e2e8f0]">
        <span className="text-sm text-[#64748b] font-medium">
          {loading
            ? "Đang tải..."
            : `${filteredUniversities.length} trường đại học`}
        </span>
      </div>

      {/* University List */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-[76px] rounded-xl bg-[#f1f5f9] animate-pulse"
            />
          ))}
        </div>
      ) : paginatedUniversities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <span className="material-symbols-outlined text-6xl text-[#cbd5e1]">
            search_off
          </span>
          <p className="text-[#64748b] text-lg font-medium">
            Không tìm thấy trường đại học nào
          </p>
          <p className="text-[#94a3b8] text-sm">
            Thử tìm kiếm với từ khóa khác
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {paginatedUniversities.map((uni, index) => (
            <div
              key={uni.id}
              className="animate-in fade-in slide-in-from-bottom-2"
              style={{
                animationDelay: `${index * 40}ms`,
                animationFillMode: "both",
              }}
            >
              <UniversityCard
                university={uni}
                onClick={handleUniversityClick}
              />
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && filteredUniversities.length > ITEMS_PER_PAGE && (
        <SearchPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default UniversityList;

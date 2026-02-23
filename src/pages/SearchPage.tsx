import React, { useState, useEffect } from "react";
import DashboardLayout from "../layouts/HomeLayout";
import SearchFilters from "../components/Search/SearchFilters";
import SearchResultItem from "../components/Search/SearchResultItem";
import SearchPagination from "../components/Search/SearchPagination";
import { apiClient } from "../utils/apiClient";
import type { DocumentSummary, Tag } from "../interfaces/DocumentTypes";

const ITEMS_PER_PAGE = 10;

const SearchPage: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<number>(0);
  const [tags, setTags] = useState<Tag[]>([]);
  const [documentTag, setDocumentTag] = useState<DocumentSummary[] | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await apiClient.get<Tag[]>(`/tags`);
        setTags(response);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchTags();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilter]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const skip = (currentPage - 1) * ITEMS_PER_PAGE;
        const tagParam = selectedFilter !== 0 ? `&tagId=${selectedFilter}` : "";
        const response = await apiClient.get<DocumentSummary[]>(
          `/tags/documents?take=${ITEMS_PER_PAGE}&skip=${skip}${tagParam}`,
        );
        setDocumentTag(response);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };
    fetchDocuments();
  }, [selectedFilter, currentPage]);
  const getTotalPages = (): number => {
    if (selectedFilter === 0) {
      const totalCount = tags.reduce((sum, tag) => sum + tag.count, 0);
      return Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));
    }
    const selectedTag = tags.find((tag) => tag.id === selectedFilter);
    if (!selectedTag) return 1;
    return Math.max(1, Math.ceil(selectedTag.count / ITEMS_PER_PAGE));
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto w-full">
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-[#334155] mb-4">
            Kết quả tìm kiếm tài liệu
          </h1>
          <SearchFilters
            selectedFilter={selectedFilter}
            onFilterSelect={setSelectedFilter}
            tags={tags}
          />
        </div>

        <div className="space-y-4 grid grid-cols-2 gap-4">
          {documentTag?.map((doc) => (
            <SearchResultItem key={doc.id} document={doc} />
          ))}
        </div>

        <SearchPagination
          currentPage={currentPage}
          totalPages={getTotalPages()}
          onPageChange={setCurrentPage}
        />
      </div>
    </DashboardLayout>
  );
};

export default SearchPage;

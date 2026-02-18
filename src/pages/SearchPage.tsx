import React, { useState, useEffect } from "react";
import DashboardLayout from "../layouts/HomeLayout";
import SearchFilters from "../components/Search/SearchFilters";
import SearchResultItem from "../components/Search/SearchResultItem";
import SearchPagination from "../components/Search/SearchPagination";
import { apiClient } from "../utils/apiClient";
import type { DocumentSummary, Tag } from "../interfaces/Types";

const SearchPage: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<number>(0);
  const [tags, setTags] = useState<Tag[]>([]);
  const [documentTag, setDocumentTag] = useState<DocumentSummary[] | null>(null);
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await apiClient.get<Tag[]>(`/tags`);
        setTags(response);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };
    const fetchDocumenttag = async () => {
      try {
        const response = await apiClient.get<DocumentSummary[]>(
          `/tags/documents?take=10&skip=0 ${selectedFilter !== 0 ? `&tagId=${selectedFilter}` : ""}`,
        );
        setDocumentTag(response);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };
    fetchDocumenttag();
    fetchTags();
  }, [setDocumentTag, setTags, selectedFilter, setSelectedFilter]);
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

        <div className="space-y-4">
          {documentTag?.map((doc) => (
            <SearchResultItem key={doc.id} document={doc} />
          ))}
        </div>

        <SearchPagination />
      </div>
    </DashboardLayout>
  );
};

export default SearchPage;

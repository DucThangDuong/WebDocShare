import React, { useState, useEffect } from "react";
import { apiClient } from "../../utils/apiClient";
import type { DocumentSummary } from "../../interfaces/DocumentTypes";
import { useNavigate } from "react-router-dom";

interface DocumentsPopularProps {
  universityId: number;
}

const DocumentsPopular: React.FC<DocumentsPopularProps> = ({
  universityId,
}) => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      try {
        const data = await apiClient.get<DocumentSummary[]>(
          `/universities/${universityId}/documents/popular?take=8&skip=0`,
        );
        setDocuments(data);
      } catch (error) {
        console.error("Error fetching university documents:", error);
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, [universityId]);

  const handleDocumentClick = (docId: string) => {
    navigate(`/documents/${docId}`);
  };

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#111318] flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">
            schedule
          </span>
          Tài liệu gần đây
        </h2>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-[180px] rounded-xl bg-[#f1f5f9] animate-pulse"
            />
          ))}
        </div>
      ) : documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4 bg-white rounded-2xl border border-dashed border-[#e5e7eb]">
          <span className="material-symbols-outlined text-6xl text-[#cbd5e1]">
            description
          </span>
          <p className="text-[#64748b] text-lg font-medium">
            Chưa có tài liệu nào
          </p>
          <p className="text-[#94a3b8] text-sm">
            Hãy là người đầu tiên đăng tải tài liệu cho trường này!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {documents.map((doc) => {
            return (
              <button
                key={doc.id}
                type="button"
                onClick={() => handleDocumentClick(doc.id)}
                className="group flex flex-col gap-3 p-4 bg-white rounded-xl border border-[#eef2f2] hover:border-primary/50 shadow-sm hover:shadow-md transition-all cursor-pointer text-left"
              >
                <div className="flex items-start justify-between">
                  <div className={`bg-red-50 p-2 rounded-lg text-red-500`}>
                    <span className="material-symbols-outlined text-[24px]">
                      picture_as_pdf
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#111318] line-clamp-2 group-hover:text-primary transition-colors">
                    {doc.title}
                  </h3>
                  {doc.tags && doc.tags.length > 0 && (
                    <p className="text-xs text-[#648787] mt-1">
                      {doc.tags.slice(0, 2).join(" • ")}
                    </p>
                  )}
                </div>
                <div className="mt-auto pt-3 border-t border-[#f0f4f4] flex items-center justify-between text-xs text-[#648787]">
                  <span>
                    {new Date(doc.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[14px]">
                        favorite
                      </span>{" "}
                      {doc.likeCount}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default DocumentsPopular;

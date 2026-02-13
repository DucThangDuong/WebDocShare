const Minio_url = import.meta.env.VITE_MinIO_URL;
import React, { useState, useEffect } from "react";
import { apiClient } from "../utils/apiClient";
import { useParams } from "react-router-dom";
import type { DocumentInfor } from "../interfaces/Types";
import { RelatedDoc } from "../components/DocumentDetail/RelatedDocument";
import { Detail } from "../components/DocumentDetail/Detail";
import { Header } from "../components/DocumentDetail/Header";
import DashboardLayout from "../layouts/HomeLayout";
import { useStore } from "../zustand/store";

const PDFDetailView: React.FC = () => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [docInfor, setdocInfor] = useState<DocumentInfor | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const { setNavItemActivate } = useStore();
  const { docId } = useParams<{ docId: string }>();

  useEffect(() => {
    if (docId) {
      apiClient
        .get<DocumentInfor>(`document/detail/${docId}`)
        .then((data: DocumentInfor) => {
          setdocInfor(data);
          setPdfUrl(data.fileUrl);
        })
        .catch((err) => console.error("Lỗi lấy infor doc:", err));
    }

    setNavItemActivate("");
  }, [docId, setNavItemActivate]);

  const handleDownload = async () => {
    try {
      if (!pdfUrl) {
        console.error("PDF chưa được tải");
        return;
      }
      setIsDownloading(true);
      const fileUrl = `${Minio_url}/pdf-storage/${pdfUrl}`;
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error("Không thể tải file từ server");
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      const fileName = docInfor?.title
        ? `${docInfor.title.replace(/\s+/g, "_")}.pdf`
        : "document.pdf";

      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Lỗi tải file:", error);
      alert("Có lỗi xảy ra khi tải tệp tin. Vui lòng thử lại.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="font-sans bg-[#f8f9fb] text-[#111318] min-h-screen flex flex-col">
        <Header
          fileName={docInfor?.title || ""}
          onDownload={handleDownload}
          isDownloading={isDownloading}
        />

        <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 mt-4 px-4 lg:px-0">
          <div className="flex-1 flex flex-col gap-6">
            <div className="w-full bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden h-[800px]">
              {pdfUrl ? (
                <iframe
                  src={`${Minio_url}/pdf-storage/${pdfUrl}#toolbar=0`}
                  title="PDF Viewer"
                  className="w-full h-full border-none"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <span className="material-symbols-outlined animate-spin text-3xl">
                      progress_activity
                    </span>
                    <span>Đang tải tài liệu...</span>
                  </div>
                </div>
              )}
            </div>

            <Detail docInfor={docInfor} />
          </div>

          <div className="w-full lg:w-80 shrink-0">
            <RelatedDoc />
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
};

export default PDFDetailView;

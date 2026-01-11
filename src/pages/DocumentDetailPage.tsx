import React, { useState, useEffect, useRef } from "react";
import { apiClient } from "../services/apiClient";
import { Document, Page, pdfjs } from "react-pdf";
import { useParams } from "react-router-dom";
import type { DocumentInfor } from "../interfaces/Types";
import { RelatedDoc } from "../components/DocumentDetail/RealatedDocument";
import { Detail } from "../components/DocumentDetail/Detail";
import { Header } from "../components/DocumentDetail/Header";
import DashboardLayout from "../layouts/DocumentDetailLayout";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();
// --- Interfaces ---

const PDFDetailView: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [numPages, setNumPages] = useState<number>(0);
  const [pdfFile, setPdfFile] = useState<Blob | null>(null);
  const [docInfor, setdocInfor] = useState<DocumentInfor | null>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);

  //  Lấy File từ API
  const { docId } = useParams<{ docId: string }>();
  useEffect(() => {
    if (docId) {
      apiClient
        .getFile(`/document/download/${docId}`)
        .then((data) => setPdfFile(data))
        .catch((err) => console.error("Lỗi tải file:", err));
      apiClient
        .get<DocumentInfor>(`document/detail/${docId}`)
        .then((data) => setdocInfor(data))
        .catch((err) => console.error("Lỗi lấy infor doc:", err));
    }
  }, []);

  // Xử lý khi PDF load thành công
  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setCurrentPage(1);
  }

  // Điều hướng trang
  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= numPages) {
      setCurrentPage(pageNumber);
      // Cuộn lên đầu nội dung khi đổi trang
      if (mainContentRef.current) {
        mainContentRef.current.scrollTop = 0;
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="font-sans bg-[#f8f9fb] text-[#111318] min-h-screen flex flex-col ">
        {/* --- HEADER --- */}
        <Header
          currentPage={currentPage}
          numPages={numPages}
          goToPage={goToPage}
        />
        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 mt-2">
          {/* Left Column: Document Details */}
          <div className="flex-1 flex flex-col gap-6 ">
            {/* show file */}
            <main
              ref={mainContentRef}
              className="flex-1 flex justify-center items-start w-full border border-black rounded-lg"
            >
              <Document
                file={pdfFile}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                  <div className="text-center p-10">Đang tải tài liệu...</div>
                }
              >
                <div className="relative bg-white shadow-2xl rounded-sm aspect-[1/1.414] w-full ring-1 ring-black/5 overflow-hidden">
                  <Page
                    pageNumber={currentPage}
                    width={900}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                  />
                </div>
              </Document>
            </main>
            {/* thông tin file */}
            <Detail docInfor={docInfor} />
          </div>
          {/* Right Column: Sidebar (Related Docs) */}
          <RelatedDoc />
        </main>
      </div>
    </DashboardLayout>
  );
};

export default PDFDetailView;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/HomeLayout";
import { apiClient } from "../utils/apiClient";
import type { DocumentDetailEdit } from "../interfaces/DocumentTypes";
import EditForm from "../components/EditDocument/EditForm";
import PreviewPanel from "../components/EditDocument/PreviewPanel";
import toast from "react-hot-toast";

const EditDocumentPage: React.FC = () => {
  const { docId } = useParams<{ docId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [document, setDocument] = useState<DocumentDetailEdit | null>(null);

  const [pendingFileDelete, setPendingFileDelete] = useState(false);
  const [pendingNewFile, setPendingNewFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Public",
    tags: null as string[] | null,
    universityId: null as number | null,
    universitySectionId: null as number | null,
  });

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true);
        const data = await apiClient.get<DocumentDetailEdit>(
          `/documents/${docId}/edit`,
        );
        setDocument(data);
        setFormData({
          title: data.title,
          description: data.description || "",
          status: data.status,
          tags: data.tags,
          universityId: data.universityId ?? null,
          universitySectionId: data.universitySectionId ?? null,
        });
      } catch (err) {
        console.error("Error fetching document:", err);
      } finally {
        setLoading(false);
      }
    };

    if (docId) {
      fetchDocument();
    }
  }, [docId]);

  const handleFieldChange = (field: string, value: string | string[] | number | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (pendingFileDelete && document?.id) {
        await apiClient.delete(`/documents/${document.id}/file`, {});
      }

      const form = new FormData();
      form.append("Title", formData.title);
      form.append("Description", formData.description);
      form.append("Status", formData.status);
      if (pendingNewFile && document?.id) {
        form.append("File", pendingNewFile);
      }
      if (formData.tags && Array.isArray(formData.tags)) {
        formData.tags.forEach((tag) => {
          form.append(`Tags`, tag);
        });
      }
      if (formData.universityId) {
        form.append("UniversityId", formData.universityId.toString());
      }
      if (formData.universitySectionId) {
        form.append("UniversitySectionId", formData.universitySectionId.toString());
      }
      await apiClient.patchFormdata(`/documents/${docId}`, form);
      toast.success("Tài liệu đã được cập nhật thành công.");
      navigate("/my-documents");
    } catch (err) {
      console.error("Error updating document:", err);
      toast.error("Có lỗi xảy ra khi lưu. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  const handleMarkDelete = () => {
    setPendingFileDelete(true);
    setPendingNewFile(null);
  };

  const handleCancelDelete = () => {
    setPendingFileDelete(false);
  };

  const handleSelectNewFile = (file: File) => {
    setPendingNewFile(file);
    setPendingFileDelete(false);
  };

  const handleCancelNewFile = () => {
    setPendingNewFile(null);
  };

  const handleCancel = () => {
    setPendingFileDelete(false);
    setPendingNewFile(null);
    navigate(-1);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-10 h-10 border-4 border-[#13ecec] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex-1 overflow-y-auto bg-[#f6f8f8] dark:bg-[#102222] p-6 md:p-10 scroll-smooth">
        {/* Breadcrumbs & Header Section */}
        <div className="px-4 py-5">
          <div className="w-full flex flex-col gap-6">
            {/* Page Heading */}
            <div className="flex flex-col gap-2">
              <h1 className="text-[#111818] dark:text-white tracking-tight text-[32px] font-bold leading-tight">
                Chỉnh sửa thông tin tài liệu
              </h1>
              <p className="text-[#618989] text-base font-normal leading-normal">
                Cập nhật thông tin chi tiết và cài đặt quyền riêng tư cho tệp
                PDF của bạn.
              </p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-4  flex flex-1 justify-center pb-10">
          <div className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Edit Form */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                <EditForm
                  data={formData}
                  onChange={handleFieldChange}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  saving={saving}
                />
              </div>

              {/* Right Column: Preview Panel */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                <PreviewPanel
                  document={document}
                  pendingDelete={pendingFileDelete}
                  pendingNewFile={pendingNewFile}
                  onMarkDelete={handleMarkDelete}
                  onCancelDelete={handleCancelDelete}
                  onSelectNewFile={handleSelectNewFile}
                  onCancelNewFile={handleCancelNewFile}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditDocumentPage;

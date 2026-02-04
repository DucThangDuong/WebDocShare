
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/HomeLayout";
import { apiClient } from "../utils/apiClient";
import type { DocumentInfor } from "../interfaces/Types";
import EditForm from "../components/EditDocument/EditForm";
import PreviewPanel from "../components/EditDocument/PreviewPanel";
const EditDocumentPage: React.FC = () => {
  const { docId } = useParams<{ docId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [document, setDocument] = useState<DocumentInfor | null>(null);
  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Public",
    tags: null as string[] | null,
  });

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true);
        const data = await apiClient.get<DocumentInfor>(
          `/document/detail/${docId}`,
        );
        setDocument(data);
        setFormData({
          title: data.title,
          description: data.description || "",
          status: data.status,
          tags: data.tags,
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

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const form = new FormData();
      form.append("Title", formData.title);
      form.append("Description", formData.description);
      form.append("Status", formData.status);
      if (formData.tags && Array.isArray(formData.tags)) {
        formData.tags.forEach((tag, index) => {
          form.append(`Tags[${index}]`, tag);
        });
      }

      await apiClient.patchForm(`/document/${docId}`, form);
      navigate("/files");
    } catch (err) {
      console.error("Error updating document:", err);
    } finally {
      setSaving(false);
    }
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
                  onCancel={() => navigate(-1)}
                  saving={saving}
                />
              </div>

              {/* Right Column: Preview Panel */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                <PreviewPanel document={document} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditDocumentPage;

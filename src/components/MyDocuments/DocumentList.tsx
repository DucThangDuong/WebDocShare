import React from "react";
import { Link } from "react-router-dom"; // Dùng Link cho SPA mượt hơn
import type { FileData, UserStorageFile } from "../../interfaces/Types";
import { apiClient } from "../../utils/apiClient";
import { useStore } from "../../zustand/store";
interface FileTableProps {
  files: FileData[];
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
export const FileTable: React.FC<FileTableProps> = ({ files }) => {
  const { setFiles, setUserStorageFiles } = useStore();
  const handlePatch = async (docId: string) => {
    try {
      await apiClient.patch(`/document/${docId}/movetotrash`, {
        isDeleted: true,
      });
      const fetchFiles = apiClient.get<FileData[]>("/documents?skip=0&take=10");
      const fetchUserStoragefiles =
        apiClient.get<UserStorageFile>("/user/documents");
      Promise.all([fetchFiles, fetchUserStoragefiles])
        .then(([filesData, userStorageFilesData]) => {
          setFiles(filesData);
          setUserStorageFiles(userStorageFilesData);
        })
        .catch((error) => {
          console.error("Error fetching files or user storage files:", error);
        });
    } catch (error) {
      console.error("Lỗi xóa file:", error);
      alert("Không thể xóa tài liệu này.");
    }
  };
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        {/* Table Head */}
        <thead>
          <tr className="border-b border-[#dbdfe6] bg-gray-50">
            <th className="py-3 px-6 text-xs font-semibold text-[#616f89] uppercase tracking-wider w-[40%]">
              Tên tệp
            </th>
            <th className="py-3 px-6 text-xs font-semibold text-[#616f89] uppercase tracking-wider hidden md:table-cell">
              Ngày tải lên
            </th>
            <th className="py-3 px-6 text-xs font-semibold text-[#616f89] uppercase tracking-wider hidden sm:table-cell">
              Kích thước
            </th>
            <th className="py-3 px-6 text-xs font-semibold text-[#616f89] uppercase tracking-wider text-right">
              Hành động
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-[#dbdfe6]">
          {files.map((file) => (
            <tr
              key={file.id}
              className="group hover:bg-gray-50 transition-colors"
            >
              <td className="py-4 px-6">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-[#111318] truncate">
                      {file.title}
                    </span>
                  </div>
                </div>
              </td>
              <td className="py-4 px-6 text-sm text-[#616f89] hidden md:table-cell">
                {file.createdAt ? file.createdAt.substring(0, 10) : "N/A"}
              </td>
              <td className="py-4 px-6 text-sm text-[#616f89] hidden sm:table-cell">
                {formatFileSize(Number.parseInt(file.sizeInBytes) || 0)}
              </td>

              {/* Actions */}
              <td className="py-4 px-6 text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ActionButton
                    icon="visibility"
                    title="Xem"
                    url={`/PDFfile/${file.id}`}
                  />
                  <ActionButton
                    icon="delete"
                    title="Xóa"
                    hoverColor="red"
                    action={() => handlePatch(file.id)}
                  />
                  <ActionButton
                    icon="more_vert"
                    title="Chỉnh sửa"
                    hoverColor="green"
                    url={`/edit-document/${file.id}`}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ActionButton = ({
  icon,
  title,
  hoverColor = "primary",
  url,
  action,
}: {
  icon: string;
  title: string;
  hoverColor?: string;
  url?: string;
  action?: () => void;
}) => {
  const colorClass =
    hoverColor === "red"
      ? "hover:text-red-600 hover:bg-red-100"
      : hoverColor === "green"
        ? "hover:text-green-600 hover:bg-green-100"
        : "hover:text-primary hover:bg-primary/10";

  const baseClass = `p-2 text-[#616f89] ${colorClass} rounded-full transition-colors flex items-center justify-center`;
  if (url) {
    return (
      <Link to={url} className={baseClass} title={title}>
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      </Link>
    );
  }
  return (
    <button onClick={action} className={baseClass} title={title} type="button">
      <span className="material-symbols-outlined text-[20px]">{icon}</span>
    </button>
  );
};

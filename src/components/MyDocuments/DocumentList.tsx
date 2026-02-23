import React from "react";
import { Link } from "react-router-dom";
import type { DocumentDetailEdit } from "../../interfaces/DocumentTypes";
import type { UserStorageFile } from "../../interfaces/UserTypes";
import { apiClient } from "../../utils/apiClient";
import { useStore } from "../../zustand/store";
import toast from "react-hot-toast";

interface FileTableProps {
  files: DocumentDetailEdit[];
}
export const FileTable: React.FC<FileTableProps> = ({ files }) => {
  const { setFiles, setUserStorageFiles } = useStore();
  const handlePatch = async (docId: string) => {
    try {
      await apiClient.patch(`/documents/${docId}/trash`, {
        isDeleted: true,
      });
      const [filesData, userStorageFilesData] = await Promise.all([
        apiClient.get<DocumentDetailEdit[]>("/documents?skip=0&take=10"),
        apiClient.get<UserStorageFile>("/user/me/storage"),
      ]);
      setFiles(filesData);
      setUserStorageFiles(userStorageFilesData);
      toast.success("Tài liệu đã được xóa thành công.");
    } catch (error) {
      toast.error("Không thể xóa tài liệu này.Vui lòng thử lại sau.");
    }
  };
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        {/* Table Head */}
        <thead>
          <tr className="border-b border-[#dbdfe6] bg-gray-50">
            <th className="py-3 px-6 text-xs font-semibold text-muted uppercase tracking-wider w-[40%]">
              Tên tệp
            </th>
            <th className="py-3 px-6 text-xs font-semibold text-muted uppercase tracking-wider hidden md:table-cell">
              Ngày tải lên
            </th>
            <th className="py-3 px-6 text-xs font-semibold text-muted uppercase tracking-wider hidden md:table-cell">
              Cập nhật lần cuối
            </th>
            <th className="py-3 px-6 text-xs font-semibold text-muted uppercase tracking-wider hidden sm:table-cell">
              Trạng thái
            </th>
            <th className="py-3 px-6 text-xs font-semibold text-muted uppercase tracking-wider text-right">
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
                    <span className="text-sm font-medium text-body truncate">
                      {file.title}
                    </span>
                  </div>
                </div>
              </td>
              <td className="py-4 px-6 text-sm text-muted hidden md:table-cell">
                {file.createdAt ? file.createdAt.substring(0, 10) : "N/A"}
              </td>
              <td className="py-4 px-6 text-sm text-muted hidden md:table-cell">
                {file.updatedAt ? file.updatedAt.substring(0, 10) : "N/A"}
              </td>
              <td className="py-4 px-6 text-sm text-muted hidden sm:table-cell">
                {file.status === "Public" ? "Công khai" : "Riêng tư"}
              </td>

              {/* Actions */}
              <td className="py-4 px-6 text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ActionButton
                    icon="visibility"
                    title="Xem"
                    url={`/documents/${file.id}`}
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
                    url={`/documents/${file.id}/edit`}
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

  const baseClass = `p-2 text-muted ${colorClass} rounded-full transition-colors flex items-center justify-center`;
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

import React from "react";
import type { FileData } from "../../interfaces/Types";

interface FileTableProps {
  files: FileData[];
}

export const FileTable: React.FC<FileTableProps> = ({ files }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
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
        <tbody className="divide-y divide-[#dbdfe6]">
          {files.map((file) => (
            <tr
              key={file.id}
              className="group hover:bg-gray-50 transition-colors"
            >
              <td className="py-4 px-6">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                    <span className="material-symbols-outlined">
                      picture_as_pdf
                    </span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-[#111318] truncate">
                      {file.name}
                    </span>
                    <span className="text-xs text-[#616f89] md:hidden">
                      {file.date} • {file.size}
                    </span>
                  </div>
                </div>
              </td>
              <td className="py-4 px-6 text-sm text-[#616f89] hidden md:table-cell">
                {file.date}
              </td>
              <td className="py-4 px-6 text-sm text-[#616f89] hidden sm:table-cell">
                {file.size}
              </td>
              <td className="py-4 px-6 text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ActionButton icon="visibility" title="Xem" />
                  <ActionButton
                    icon="download"
                    title="Tải xuống"
                    hoverColor="green"
                  />
                  <ActionButton icon="delete" title="Xóa" hoverColor="red" />
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
}: {
  icon: string;
  title: string;
  hoverColor?: string;
}) => {
  const colorClass =
    hoverColor === "red"
      ? "hover:text-red-600 hover:bg-red-100"
      : hoverColor === "green"
      ? "hover:text-green-600 hover:bg-green-100"
      : "hover:text-primary hover:bg-primary/10";

  return (
    <button
      className={`p-2 text-[#616f89] ${colorClass} rounded-full transition-colors`}
      title={title}
    >
      <span className="material-symbols-outlined text-[20px]">{icon}</span>
    </button>
  );
};

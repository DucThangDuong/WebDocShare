import { useRef } from "react";
import type { FileDocument } from "../../interfaces/DocumentTypes";
import { useStore } from "../../zustand/store";
import { formatFileSize } from "../../utils/formatUtils";
import UniversitySectionPicker from "../shared/UniversitySectionPicker";

interface DocumentListUploadProps {
  expandedIndex: number | null;
  setExpandedIndex: (index: number | null) => void;
  setTempEditData: (data: FileDocument | null) => void;
  tempEditData: FileDocument | null;
}

export default function DocumentListUpload({
  expandedIndex,
  setExpandedIndex,
  setTempEditData,
  tempEditData,
}: DocumentListUploadProps) {
  const { fileList, setFileList } = useStore();
  // xóa file khỏi danh sách
  const handleRemoveFile = (e: React.MouseEvent, indexToRemove: number) => {
    e.stopPropagation();
    const newListFile = fileList.filter((_, index) => index !== indexToRemove);
    setFileList(newListFile);
    if (expandedIndex === indexToRemove) {
      setExpandedIndex(null);
      setTempEditData(null);
    } else if (expandedIndex !== null && expandedIndex > indexToRemove) {
      setExpandedIndex(expandedIndex - 1);
    }
  };

  // Khi bấm vào file để mở form
  const handleStartEdit = (index: number) => {
    if (expandedIndex === index) {
      handleCancelEdit();
    } else {
      const currentFileList = useStore.getState().fileList;
      const metaData = { ...currentFileList[index].metaData };
      setExpandedIndex(index);
      setTempEditData(metaData);
      tempEditDataRef.current = metaData;
    }
  };
  const tempEditDataRef = useRef(tempEditData);

  const handleInputChange = (field: keyof FileDocument, value: string | string[] | number | null) => {
    const current = tempEditDataRef.current;
    if (current) {
      const updated = { ...current, [field]: value };
      setTempEditData(updated);
      tempEditDataRef.current = updated;
    }
  };

  // Khi bấm LƯU
  const handleSaveEdit = () => {
    if (expandedIndex !== null && tempEditData) {
      const idx = expandedIndex;
      const dataToSave = { ...tempEditData };
      const currentList = useStore.getState().fileList;
      const newList = [...currentList];
      newList[idx] = {
        ...newList[idx],
        metaData: dataToSave,
      };
      setFileList(newList);
      setExpandedIndex(null);
      setTempEditData(null);
    }
  };

  // Khi bấm HỦY
  const handleCancelEdit = () => {
    setExpandedIndex(null);
    setTempEditData(null);
  };


  return (
    fileList.length > 0 && (
      <div className="flex flex-col gap-3 animate-in slide-in-from-top-2 duration-300">
        <h3 className="text-sm font-semibold text-body uppercase tracking-wider mb-1">
          Danh sách tệp ({fileList.length})
        </h3>
        {/* vòng lặp hiện các file đã up lên */}
        {fileList.map((item, index) => {
          const isExpanded = expandedIndex === index;

          return (
            <div key={item.id} className="flex flex-col gap-0 transition-all">
              {/* FILE CARD */}
              <div
                onClick={() => handleStartEdit(index)}
                className={`flex items-center gap-4 rounded-lg p-3 border cursor-pointer relative transition-colors
                        ${isExpanded
                    ? "bg-primary/5 border-primary ring-1 ring-primary rounded-b-none border-b-0"
                    : "bg-[#f6f6f8] border-[#f0f2f4] hover:border-primary/50"
                  }
                      `}
              >
                {/* icon file */}
                <div className="text-[#eb3b3b] flex items-center justify-center rounded-lg bg-white size-12 shadow-sm">
                  <span className="material-symbols-outlined text-[28px]">
                    picture_as_pdf
                  </span>
                </div>
                {/* thông tin file */}
                <div className="flex flex-col justify-center flex-1 min-w-0 gap-1">
                  {/* tên file */}
                  <div className="flex justify-between items-center">
                    <p className="text-body text-sm font-medium line-clamp-1">
                      {item.metaData.title || item.file.name}
                    </p>
                    <button
                      onClick={(e) => handleRemoveFile(e, index)}
                      className="text-muted hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors z-20"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        close
                      </span>
                    </button>
                  </div>
                  {/* tiến trình */}
                  <div className="flex flex-col gap-1 w-full mt-1">
                    <div className="flex items-center justify-between text-xs">
                      {/* Dung lượng file */}
                      <span className="text-muted font-medium">
                        {formatFileSize(item.file.size)}
                      </span>
                      {/* Trạng thái Upload */}
                      <div className="flex items-center gap-1.5">
                        {item.uploadStatus === "pending" && (
                          <span className="text-gray-500 font-medium flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                            Sẵn sàng
                          </span>
                        )}
                        {item.uploadStatus === "uploading" && (
                          <span className="text-blue-600 font-medium flex items-center gap-1 animate-pulse">
                            <span className="material-symbols-outlined text-[14px] animate-spin">
                              progress_activity
                            </span>
                            Đang xử lý...
                          </span>
                        )}
                        {item.uploadStatus === "success" && (
                          <span className="text-green-600 font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">
                              check_circle
                            </span>
                            Thành công
                          </span>
                        )}
                        {item.uploadStatus === "error" && (
                          <span className="text-red-500 font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">
                              error
                            </span>
                            Lỗi
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* khi mà click vào file thì hiện form chỉnh sửa */}
              {isExpanded && tempEditData && (
                <div className="border border-t-0 border-primary/30 rounded-b-lg bg-[#f9fafb] p-4  shadow-sm flex flex-col gap-4">
                  <div className="card">
                    <div className="mb-6">
                      <label className="label-text">
                        Tiêu đề tài liệu
                      </label>
                      <input
                        className="input"
                        placeholder="Nhập tiêu đề tài liệu"
                        type="text"
                        value={tempEditData.title}
                        onChange={(e) =>
                          handleInputChange("title", e.target.value)
                        }
                      />
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                      <label className="label-text">
                        Mô tả chi tiết
                      </label>
                      <textarea
                        className="input min-h-[120px]  resize-y"
                        placeholder="Nhập mô tả chi tiết về nội dung tài liệu..."
                        value={tempEditData.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                      ></textarea>
                    </div>
                    {/* status  */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="label-text">
                          Chế độ hiển thị
                        </label>
                        <div className="flex gap-4 items-center h-12">
                          <label className="inline-flex items-center cursor-pointer group">
                            <input
                              type="radio"
                              name={`visibility-${index}`}
                              className="hidden peer"
                              checked={tempEditData.status === "Public"}
                              onChange={() =>
                                handleInputChange("status", "Public")
                              }
                            />
                            <span className="radio-dot">
                              <span className="radio-dot-inner"></span>
                            </span>
                            <span className="radio-label">
                              <span className="material-symbols-outlined text-[20px]">
                                public
                              </span>
                              Công khai
                            </span>
                          </label>
                          <label className="inline-flex items-center cursor-pointer group">
                            <input
                              type="radio"
                              name={`visibility-${index}`}
                              className="hidden peer"
                              checked={tempEditData.status !== "Public"}
                              onChange={() =>
                                handleInputChange("status", "Private")
                              }
                            />
                            <span className="radio-dot">
                              <span className="radio-dot-inner"></span>
                            </span>
                            <span className="radio-label">
                              <span className="material-symbols-outlined text-[20px]">
                                lock
                              </span>
                              Riêng tư
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <UniversitySectionPicker
                        universityId={tempEditData.universityId}
                        sectionId={tempEditData.universitySectionId}
                        onUniversityChange={(id) =>
                          handleInputChange("universityId", id)
                        }
                        onSectionChange={(id) =>
                          handleInputChange("universitySectionId", id)
                        }
                      />
                    </div>

                    {/* Tags Input */}
                    <div>
                      <label className="label-text">
                        Thẻ (Tags)
                      </label>
                      <div className="input min-h-[56px] h-auto flex flex-wrap gap-2 items-center">
                        {tempEditData.tags
                          .filter((t: string) => t.trim())
                          .map((tag: string, tagIndex: number) => (
                            <span
                              key={tagIndex}
                              className="tag-chip bg-[#f3f4f6]"
                            >
                              #{tag.trim()}
                              <button
                                type="button"
                                onClick={() => {
                                  const newTags = [...tempEditData.tags];
                                  newTags.splice(tagIndex, 1);
                                  handleInputChange("tags", newTags);
                                }}
                                className="ml-1.5 hover:text-red-500 flex items-center justify-center"
                              >
                                <span className="material-symbols-outlined text-[16px]">
                                  close
                                </span>
                              </button>
                            </span>
                          ))}

                        <input
                          className="tag-input-inline"
                          placeholder="Thêm thẻ mới..."
                          type="text"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              const val = e.currentTarget.value.trim();
                              if (val) {
                                handleInputChange("tags", [...tempEditData.tags, val]);
                                e.currentTarget.value = "";
                              }
                            }
                          }}
                        />
                      </div>
                      <p className="text-xs text-[#6b7280] mt-2">
                        Nhấn Enter để thêm thẻ.
                      </p>
                    </div>
                  </div>

                  {/* hành động lưu các chỉnh sửa */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button onClick={handleCancelEdit} className="btn-cancel">
                      Hủy bỏ
                    </button>
                    <button onClick={handleSaveEdit} className="btn-edit">
                      <span className="material-symbols-outlined">save</span>
                      Lưu thay đổi
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    )
  );
}

import React, { useState } from "react";

interface EditFormProps {
  data: {
    title: string;
    description: string;
    status: string;
    tags: string[] | null;
  };
  onChange: (field: string, value: string | string[]) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
}

const EditForm: React.FC<EditFormProps> = ({
  data,
  onChange,
  onSave,
  onCancel,
  saving,
}) => {
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      onChange("tags", [...(data.tags || []), tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    onChange(
      "tags",
      (data.tags || []).filter((_, index) => index !== indexToRemove),
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="card">
        {/* Document Title */}
        <div className="mb-6">
          <label className="label-text">
            Tiêu đề tài liệu
          </label>
          <input
            className="input"
            placeholder="Nhập tiêu đề tài liệu"
            type="text"
            value={data.title}
            onChange={(e) => onChange("title", e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="label-text">
            Mô tả chi tiết
          </label>
          <textarea
            className="input min-h-[120px] resize-y"
            placeholder="Nhập mô tả chi tiết về nội dung tài liệu..."
            value={data.description}
            onChange={(e) => onChange("description", e.target.value)}
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* status*/}
          <div>
            <label className="label-text">
              Chế độ hiển thị
            </label>
            <div className="flex gap-4 items-center h-12">
              <label className="inline-flex items-center cursor-pointer group">
                <input
                  type="radio"
                  name="visibility"
                  className="hidden peer"
                  checked={data.status === "Public"}
                  onChange={() => onChange("status", "Public")}
                />
                <span className="radio-dot">
                  <span className="radio-dot-inner"></span>
                </span>
                <span className="text-[#111818]  group-hover:text-primary transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">
                    public
                  </span>
                  Công khai
                </span>
              </label>
              <label className="inline-flex items-center cursor-pointer group">
                <input
                  type="radio"
                  name="visibility"
                  className="hidden peer"
                  checked={data.status === "Private"}
                  onChange={() => onChange("status", "Private")}
                />
                <span className="radio-dot">
                  <span className="radio-dot-inner"></span>
                </span>
                <span className="text-[#111818] group-hover:text-primary transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">
                    lock
                  </span>
                  Riêng tư
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Tags Input */}
        <div>
          <label className="label-text dark:text-gray-200">
            Thẻ (Tags)
          </label>
          <div className="input min-h-[56px] flex flex-wrap gap-2 ">
            {(data.tags || []).map((tag, index) => (
              <span
                key={index}
                className="tag-chip bg-[#f6f8f8] text-[#111818] py-1"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(index)}
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
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
            />
          </div>
          <p className="text-xs text-[#618989] mt-2">Nhấn Enter để thêm thẻ.</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row items-center gap-4 justify-end mt-2">
        <button
          type="button"
          onClick={onCancel}
          className="btn-cancel text-black hover:text-white"
        >
          Hủy bỏ
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="btn-change bg-green-500 hover:text-white"
        >
          {saving && (
            <span className="w-4 h-4 border-2 border-[#102222] border-t-transparent rounded-full animate-spin"></span>
          )}
          <span className="material-symbols-outlined">save</span>
          Lưu thay đổi
        </button>
      </div>
    </div>
  );
};

export default EditForm;

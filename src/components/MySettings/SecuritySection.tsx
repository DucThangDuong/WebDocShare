import React, { useState } from "react";
import { apiClient } from "../../utils/apiClient";
import { ApiError } from "../../interfaces/Types";

interface InputFieldProps {
  icon: string;
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const InputField = ({
  label,
  icon,
  type = "password",
  placeholder,
  value,
  onChange,
}: InputFieldProps) => (
  <div>
    <label className="block text-sm font-bold text-[#111818] mb-2">
      {label}
    </label>
    <div className="input flex ">
      <span className="material-symbols-outlined text-[20px]">{icon}</span>
      <input
        className=" text-l font-bold text-left outline-none bg-transparent w-full p-1"
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={onChange}
      />
    </div>
  </div>
);

export const SecuritySection: React.FC = () => {
  const [EditPassWord, setEditPassWord] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
  ) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (error) setError(null);
  };

  const validateForm = (): boolean => {
    const { currentPassword, newPassword, confirmPassword } = formData;
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return false;
    }
    if (currentPassword === newPassword) {
      setError("Mật khẩu mới không được trùng với mật khẩu hiện tại.");
      return false;
    }
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return false;
    }
    if (newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return false;
    }
    const hasLetterAndNumber = /^(?=.*[a-zA-Z])(?=.*\d).+$/.test(newPassword);
    if (!hasLetterAndNumber) {
      setError("Mật khẩu phải bao gồm cả chữ cái và số.");
      return false;
    }
    return true;
  };

  const handleChangePassword = async () => {
    setError(null);
    setSuccess(null);
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      await apiClient.patch("/user/update/password", {
        OldPassword: formData.currentPassword,
        NewPassword: formData.newPassword,
      });
      setSuccess("Đổi mật khẩu thành công!");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => {
        setEditPassWord(false);
        setSuccess(null);
      }, 3500);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu cũ.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditPassWord(false);
    setError(null);
    setSuccess(null);
    setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <section
      className="section-card scroll-mt-24"
      id="security"
    >
      <div className="section-header">
        <h2 className="text-lg font-bold text-[#111818]">Bảo mật</h2>
        <p className="text-sm text-muted-alt">
          Quản lý mật khẩu và bảo mật tài khoản.
        </p>
      </div>

      {EditPassWord ? (
        <div className="p-6">
          <div className="flex flex-col gap-6 max-w-2xl border-b-2 pb-4 border-[#f0f4f4]">
            {(error || success) && (
              <div
                className={`p-3 rounded-lg text-sm font-medium flex items-center gap-2 ${error
                  ? "bg-red-50 text-red-600 border border-red-200"
                  : "bg-green-50 text-green-600 border border-green-200"
                  }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {error ? "error" : "check_circle"}
                </span>
                {error || success}
              </div>
            )}

            <InputField
              label="Nhập mật khẩu hiện tại"
              icon="vpn_key"
              placeholder="••••••••"
              value={formData.currentPassword}
              onChange={(e) => handleChange(e, "currentPassword")}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Nhập mật khẩu mới"
                icon="lock_reset"
                placeholder="Mật khẩu mới"
                value={formData.newPassword}
                onChange={(e) => handleChange(e, "newPassword")}
              />
              <InputField
                label="Xác nhận mật khẩu mới"
                icon="check_circle"
                placeholder="Xác nhận lại"
                value={formData.confirmPassword}
                onChange={(e) => handleChange(e, "confirmPassword")}
              />
            </div>

            <div className="text-sm text-[#618989] bg-[#f0f4f4] p-3 rounded-lg border border-transparent">
              <p className="flex items-center gap-2 font-medium mb-1">
                <span className="material-symbols-outlined text-[18px]">
                  info
                </span>{" "}
                Yêu cầu mật khẩu:
              </p>
              <ul className="list-disc list-inside pl-1 space-y-1 text-xs">
                <li
                  className={
                    formData.newPassword.length >= 6
                      ? "text-green-600 font-bold transition-colors"
                      : ""
                  }
                >
                  Ít nhất 6 ký tự
                </li>
                <li
                  className={
                    /^(?=.*[a-zA-Z])(?=.*\d).+$/.test(formData.newPassword)
                      ? "text-green-600 font-bold transition-colors"
                      : ""
                  }
                >
                  Bao gồm chữ cái và số
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-[#fcfdfd] pt-4 flex">
            <button
              onClick={handleChangePassword}
              disabled={isLoading}
              className="btn-change mr-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-bold transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading && (
                <span className="material-symbols-outlined animate-spin text-sm">
                  progress_activity
                </span>
              )}
              <span>{isLoading ? "Đang xử lý..." : "Đổi mật khẩu"}</span>
            </button>

            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="btn-cancel bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-bold transition-colors"
            >
              Hủy
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-[#fcfdfd] border-t border-[#f0f4f4] px-6 py-4 flex flex-col items-start gap-3">
          <div className="font-bold text-sm text-[#111818]">Đổi mật khẩu</div>
          <button onClick={() => setEditPassWord(true)} className="btn-edit ">
            <span className="material-symbols-outlined ">edit</span>
            Chỉnh sửa mật khẩu
          </button>
        </div>
      )}
    </section>
  );
};

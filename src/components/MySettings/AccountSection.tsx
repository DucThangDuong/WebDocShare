const Minio_url = import.meta.env.VITE_MinIO_URL;
import React, { useState, useRef } from "react";
import { useStore } from "../../zustand/store";
import { apiClient } from "../../utils/apiClient";
import { ApiError, type UserProfilePrivate } from "../../interfaces/Types";
export const AccountSection: React.FC = () => {
  const { user, setUser } = useStore();
  const [newName, setNewName] = useState<string>(user?.fullname || "");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newUsername, setNewUsername] = useState<string>(user?.username || "");
  const [Error, setError] = useState<string>("");
  const [Success, setSuccess] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setAvatarPreview(objectUrl);
    }
  };
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  const handleSave = async () => {
    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append("avatar", selectedFile);
        await apiClient.patchFormdata("/user/update/avatar", formData);
      }
      if (newName !== user?.fullname) {
        await apiClient.patch("/user/update/profile", { Fullname: newName });
      }
      if (newUsername !== user?.username) {
        await apiClient.patch("/user/update/username", {
          Username: newUsername,
        });
      }
      const newUser = await apiClient.get<UserProfilePrivate>(
        "/user/privateprofile",
      );
      setUser(newUser);
      setNewName(user?.fullname || "");
      setAvatarPreview(null);
      setSelectedFile(null);
      setError("");
      setSuccess("Cập nhật hồ sơ thành công!");
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error instanceof ApiError) {
        switch (error.status) {
          case 400:
            setError(
              error.message ||
                "Dữ liệu nhập không hợp lệ. Vui lòng kiểm tra lại.",
            );
            break;
          case 409:
            setError("Tên người dùng này đã tồn tại. Vui lòng chọn tên khác.");
            break;
          case 500:
            setError("Hệ thống đang gặp sự cố. Vui lòng thử lại sau.");
            break;
          default:
            setError("Đã có lỗi không xác định xảy ra.");
        }
      }
    }
  };
  const displayAvatar = avatarPreview
    ? avatarPreview
    : user?.isGoogle
      ? user.avatarurl
      : `${Minio_url}/avatar-storage/${user?.avatarurl}?v=${new Date().getTime()}`;
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] overflow-hidden">
      <div className="border-b border-[#f0f4f4] px-6 py-4">
        <h2 className="text-lg font-bold text-[#111818]">Thông tin hồ sơ</h2>
        <p className="text-sm text-[#618989]">
          Cập nhật thông tin chi tiết và ảnh đại diện của bạn.
        </p>
      </div>

      <div className="p-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-5 border-b-2 mb-4">
          <form className="grid grid-cols-1 gap-6 text-black max-w-[70%]">
            <div>
              <label className="block text-sm">Tên hiển thị</label>
              <div
                className="b-1 w-full flex justify-center items-center rounded-[5px] border border-black 
              focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary px-2"
              >
                <span className="material-symbols-outlined text-[20px] ">
                  person
                </span>
                <input
                  onChange={(e) => setNewName(e.target.value)}
                  className=" text-l font-bold text-left  outline-none bg-transparent w-full p-1"
                  placeholder="Nhập tên hiển thị của bạn"
                  type="text"
                  defaultValue={newName}
                />
              </div>
              <span className="text-xs text-gray-500">
                Tên đầy đủ để hiển thị cho người dùng
              </span>
            </div>
            <div>
              <label className="block text-sm">Tên người dùng</label>
              <div
                className="b-1 w-full flex justify-center items-center rounded-[5px] border border-black 
              focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary px-2"
              >
                <span className="material-symbols-outlined text-[20px] ">
                  alternate_email
                </span>
                <input
                  onChange={(e) => setNewUsername(e.target.value)}
                  className=" text-l font-bold text-left  outline-none bg-transparent w-full p-1"
                  placeholder="Nhập tên người dùng của bạn"
                  type="text"
                  defaultValue={newUsername}
                />
              </div>
              <span className="text-xs text-gray-500">
                Tên người dùng duy nhất cho tài khoản của bạn
              </span>
            </div>
          </form>

          <div className="relative group mb-4">
            <div
              className="w-52 h-52 rounded-full bg-cover bg-center shadow-md ring-4 ring-white transition-all duration-300"
              style={{ backgroundImage: ` url("${displayAvatar}")` }}
            ></div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleAvatarChange}
              ref={fileInputRef}
            />
            <button
              onClick={triggerFileInput}
              className="absolute bottom-1 right-1 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-primary-dark transition-colors cursor-pointer z-10"
              title="Đổi ảnh đại diện"
            >
              <span className="material-symbols-outlined text-[18px]">
                photo_camera
              </span>
            </button>
          </div>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-700  px-6 py-2.5 rounded-lg font-bold text-sm  transition-all transform active:scale-95"
        >
          <span>Lưu thay đổi</span>
        </button>
        {(Error || Success) && (
          <div
            className={`mt-2 text-sm font-medium flex items-center gap-2 transition-all duration-500 ${
              Error ? "text-red-600" : "text-green-600"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {Error ? "error" : "check_circle"}
            </span>
            <span>{Error || Success}</span>
          </div>
        )}
      </div>
    </section>
  );
};

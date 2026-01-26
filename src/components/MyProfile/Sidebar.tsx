import React, { useState, useRef } from "react";
import { useStore } from "../../zustand/store";
import { apiClient } from "../../services/apiClient";
import type { UserProfilePrivate } from "../../interfaces/Types";
export const ProfileSidebar = () => {
  const { user, setUser } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState<string>(user?.fullname || "");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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

  const handleCancel = () => {
    setIsEditing(false);
    setNewName(user?.fullname || "");
    setAvatarPreview(null);
    setSelectedFile(null);
  };

  const handleSave = async () => {
    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append("avatar", selectedFile);
        await apiClient.patchForm("/user/update/avatar", formData);
      }
      if (newName !== user?.fullname) {
        await apiClient.patch("/user/update/profile", { Fullname: newName });
      }

      const newUser = await apiClient.get<UserProfilePrivate>(
        "/user/privateprofile",
      );
      setUser(newUser);
      console.log(newUser.avatarurl);
      setIsEditing(false);
      setNewName(user?.fullname || "");
      setAvatarPreview(null);
      setSelectedFile(null);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
  const displayAvatar = avatarPreview
    ? `url("${avatarPreview}")`
    : `url("http://localhost:9000/avatar-storage/${user?.avatarurl}?v=${new Date().getTime()}")`;

  return (
    <aside className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6 sticky top-24">
      <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100 flex flex-col items-center text-center">
        <div className="relative group mb-4">
          <div
            className="w-32 h-32 rounded-full bg-cover bg-center shadow-md ring-4 ring-white transition-all duration-300"
            style={{ backgroundImage: displayAvatar }}
          ></div>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleAvatarChange}
          />

          {isEditing && (
            <button
              onClick={triggerFileInput}
              className="absolute bottom-1 right-1 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-primary-dark transition-colors cursor-pointer z-10"
              title="Đổi ảnh đại diện"
            >
              <span className="material-symbols-outlined text-[18px]">
                photo_camera
              </span>
            </button>
          )}
        </div>

        <div className="mb-1 w-full flex justify-center">
          {isEditing ? (
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="text-l font-bold text-text-main text-left border border-black focus:border-primary rounded-l outline-none bg-transparent w-full max-w-[200px] p-1"
              autoFocus
            />
          ) : (
            <h1 className="text-2xl font-bold text-text-main overflow-hidden">
              {user?.fullname}
            </h1>
          )}
        </div>

        {!isEditing && (
          <div className="w-full grid gap-3 mb-8 mt-2">
            <button
              onClick={() => setIsEditing(true)}
              className="btn-edit w-full"
            >
              <span className="material-symbols-outlined text-[20px]">
                edit
              </span>
              Chỉnh sửa hồ sơ
            </button>
          </div>
        )}

        {isEditing && (
          <div className="w-full flex gap-3 mb-8 mt-2">
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-xl transition-all shadow-md"
            >
              <span className="material-symbols-outlined text-[20px]">
                check
              </span>
              Lưu
            </button>
            <button onClick={handleCancel} className="btn-cancel">
              <span className="material-symbols-outlined text-[20px]">
                close
              </span>
              Hủy
            </button>
          </div>
        )}

        <div className="w-full flex flex-col gap-4 pt-6 border-t border-gray-100">
          <ContactItem icon="mail" label="Email" value={user?.email} />
        </div>
        <div className="w-full flex flex-col gap-4 pt-6 border-t border-gray-100">
          <ContactItem
            icon="person"
            label="Người dùng"
            value={`@${user?.username}`}
          />
        </div>
      </div>
    </aside>
  );
};

const ContactItem = ({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string | undefined;
}) => (
  <div className="flex items-center gap-3 text-sm">
    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-text-secondary">
      <span className="material-symbols-outlined text-[18px]">{icon}</span>
    </div>
    <div className="flex flex-col items-start">
      <span className="text-xs text-text-secondary uppercase font-bold tracking-wider">
        {label}
      </span>
      <span className="text-text-main font-medium truncate max-w-[180px]">
        {value}
      </span>
    </div>
  </div>
);

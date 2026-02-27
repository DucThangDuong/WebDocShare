import React, { useState, useRef, useEffect } from "react";
import { useStore } from "../../zustand/store";
import { apiClient } from "../../utils/apiClient";
import { ApiError } from "../../interfaces/CommonTypes";
import type { UserProfilePrivate } from "../../interfaces/UserTypes";
import type { Universities } from "../../interfaces/UniversityTypes";

export const AccountSection: React.FC = () => {
  const { user, setUser } = useStore();
  const [newName, setNewName] = useState<string>(user?.fullname || "");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newUsername, setNewUsername] = useState<string>(user?.username || "");
  const [newUniversityId, setNewUniversityId] = useState<number | undefined>(
    user?.universityId
  );
  const [universities, setUniversities] = useState<Universities[]>([]);
  const [loadingUniversities, setLoadingUniversities] = useState(false);
  const [Error, setError] = useState<string>("");
  const [Success, setSuccess] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch danh sách trường đại học
  useEffect(() => {
    const fetchUniversities = async () => {
      setLoadingUniversities(true);
      try {
        const data = await apiClient.get<Universities[]>("/universities");
        setUniversities(data);
      } catch {
        setUniversities([]);
      } finally {
        setLoadingUniversities(false);
      }
    };
    fetchUniversities();
  }, []);

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
  const Avatar =
    avatarPreview ? avatarPreview : `${user?.avatarUrl}?t=${Date.now}`;

  const handleSave = async () => {
    setError("");
    setSuccess("");
    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append("avatar", selectedFile);
        await apiClient.patchFormdata("/user/me/avatar", formData);
      }

      // Build profile update payload
      const profilePayload: Record<string, unknown> = {};
      if (newName !== user?.fullname) {
        profilePayload.Fullname = newName;
      }
      if (newUniversityId !== user?.universityId) {
        profilePayload.UniversityId = newUniversityId ?? null;
      }
      if (Object.keys(profilePayload).length > 0) {
        await apiClient.patch("/user/me/profile", profilePayload);
      }

      if (newUsername !== user?.username) {
        await apiClient.patch("/user/me/username", {
          Username: newUsername,
        });
      }

      const newUser = await apiClient.get<UserProfilePrivate>(
        "/user/me/profile"
      );
      setUser(newUser);
      setNewName(newUser.fullname || "");
      setNewUsername(newUser.username || "");
      setNewUniversityId(newUser.universityId);
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
              "Dữ liệu nhập không hợp lệ. Vui lòng kiểm tra lại."
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

  const inputWrapperClass =
    "b-1 w-full flex justify-center items-center rounded-[5px] border border-black focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary px-2";
  const inputClass =
    "text-l font-bold text-left outline-none bg-transparent w-full p-1";

  return (
    <section className="section-card">
      <div className="section-header">
        <h2 className="text-lg font-bold text-[#111818]">Thông tin hồ sơ</h2>
        <p className="text-sm text-muted-alt">
          Cập nhật thông tin chi tiết và ảnh đại diện của bạn.
        </p>
      </div>

      <div className="p-4">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 pb-5 border-b-2 mb-4">
          <form className="grid grid-cols-1 gap-5 text-black w-full md:max-w-[70%]">
            {/* Tên hiển thị */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Tên hiển thị
              </label>
              <div className={inputWrapperClass}>
                <span className="material-symbols-outlined text-[20px]">
                  person
                </span>
                <input
                  onChange={(e) => setNewName(e.target.value)}
                  className={inputClass}
                  placeholder="Nhập tên hiển thị của bạn"
                  type="text"
                  defaultValue={newName}
                />
              </div>
              <span className="text-xs text-gray-500">
                Tên đầy đủ để hiển thị cho người dùng
              </span>
            </div>

            {/* Tên người dùng */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Tên người dùng
              </label>
              <div className={inputWrapperClass}>
                <span className="material-symbols-outlined text-[20px]">
                  alternate_email
                </span>
                <input
                  onChange={(e) => setNewUsername(e.target.value)}
                  className={inputClass}
                  placeholder="Nhập tên người dùng của bạn"
                  type="text"
                  defaultValue={newUsername}
                />
              </div>
              <span className="text-xs text-gray-500">
                Tên người dùng duy nhất cho tài khoản của bạn
              </span>
            </div>

            {/* Email (chỉ đọc) */}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <div className={`${inputWrapperClass} bg-gray-100 opacity-70`}>
                <span className="material-symbols-outlined text-[20px]">
                  mail
                </span>
                <input
                  className={`${inputClass} cursor-not-allowed`}
                  type="email"
                  value={user?.email || ""}
                  disabled
                  readOnly
                />
              </div>
              <span className="text-xs text-gray-500">
                Địa chỉ email không thể thay đổi trực tiếp
              </span>
            </div>

            {/* Trường đại học */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Trường đại học
              </label>
              <div className={inputWrapperClass}>
                <span className="material-symbols-outlined text-[20px]">
                  school
                </span>
                <select
                  className={`${inputClass} cursor-pointer`}
                  value={newUniversityId ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNewUniversityId(val ? Number(val) : undefined);
                  }}
                  disabled={loadingUniversities}
                >
                  <option value="">
                    {loadingUniversities
                      ? "Đang tải..."
                      : "-- Chọn trường đại học --"}
                  </option>
                  {universities.map((uni) => (
                    <option key={uni.id} value={uni.id}>
                      {uni.name} ({uni.code})
                    </option>
                  ))}
                </select>
              </div>
              <span className="text-xs text-gray-500">
                Trường đại học bạn đang theo học hoặc đã tốt nghiệp
              </span>
            </div>
          </form>

          {/* Avatar */}
          <div className="relative group mb-4 flex-shrink-0">
            <div
              className="w-52 h-52 rounded-full bg-cover bg-center shadow-md ring-4 ring-white transition-all duration-300"
              style={{ backgroundImage: ` url("${Avatar}")` }}
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
          className="flex items-center gap-2 bg-green-500 hover:bg-green-700 px-6 py-2.5 rounded-lg font-bold text-sm transition-all transform active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">save</span>
          <span>Lưu thay đổi</span>
        </button>
        {(Error || Success) && (
          <div
            className={`mt-2 text-sm font-medium flex items-center gap-2 transition-all duration-500 ${Error ? "text-red-600" : "text-green-600"
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

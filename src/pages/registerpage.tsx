import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import RegisterLayout from "../layouts/registerlayout";
import { apiClient, ApiError } from "../services/apiClient";
import { InputField } from "../components/inputfield";
import type { UserRegister } from "../interfaces/Types";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    setIsLoading(true);
    const userregister: UserRegister = {
      username: displayName,
      email: email,
      password: password,
    };
    try {
      await apiClient.post("/register", userregister);
      navigate("/login");
    } catch (err) {
      if (err instanceof ApiError) {
        switch (err.status) {
          case 409:
            setError("Email này đã được đăng ký. Bạn có muốn đăng nhập không?");
            break;
          case 400:
            setError(
              err.message || "Dữ liệu nhập không hợp lệ. Vui lòng kiểm tra lại."
            );
            break;
          case 500:
            setError("Hệ thống đang bảo trì. Vui lòng thử lại sau.");
            break;
          case 404:
            setError("Không tìm thấy đường dẫn yêu cầu.");
            break;
          default:
            setError("Lỗi không xác định: " + err.message);
        }
      } else {
        setError(
          "Không thể kết nối đến máy chủ. Vui lòng kiểm tra đường truyền."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RegisterLayout>
      <div className="w-full max-w-[520px] bg-white rounded-xl shadow-sm border border-[#e5e7eb] p-6 md:p-8">
        {/* Heading */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-[#111318] text-3xl font-black tracking-tight mb-2">
            Tạo tài khoản mới
          </h1>
          <p className="text-[#616f89] text-base">
            Nhập thông tin chi tiết của bạn để bắt đầu
          </p>
        </div>

        {/* Hiển thị lỗi nếu có */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">error</span>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <InputField
            label="Tên hiển thị"
            placeholder="Nhập tên hiển thị của bạn"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />

          <InputField
            label="Email"
            placeholder="vidu@email.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <InputField
            label="Mật khẩu"
            placeholder="Nhập mật khẩu"
            isPassword={true}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <InputField
            label="Xác nhận mật khẩu"
            placeholder="Nhập lại mật khẩu"
            isPassword={true}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {/* Terms Checkbox */}
          <div className="flex items-start gap-3 mt-2">
            <div className="flex items-center h-5">
              <input
                id="terms"
                type="checkbox"
                required
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
              />
            </div>
            <label
              htmlFor="terms"
              className="text-sm text-[#616f89] cursor-pointer select-none"
            >
              Tôi đồng ý với{" "}
              <a href="#" className="text-primary hover:underline font-medium">
                Điều khoản dịch vụ
              </a>{" "}
              và{" "}
              <a href="#" className="text-primary hover:underline font-medium">
                Chính sách bảo mật
              </a>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`mt-4 w-full h-12 text-white text-base font-bold rounded-lg transition-all shadow-md flex items-center justify-center gap-2
              ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary hover:bg-blue-700 hover:shadow-lg"
              }`}
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Đang xử lý...</span>
              </>
            ) : (
              <>
                <span>Đăng ký</span>
                <span className="material-symbols-outlined text-sm">
                  arrow_forward
                </span>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex py-6 items-center">
          <div className="flex-grow border-t border-[#e5e7eb]"></div>
          <span className="flex-shrink-0 mx-4 text-sm text-[#616f89]">
            Hoặc đăng ký bằng
          </span>
          <div className="flex-grow border-t border-[#e5e7eb]"></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            className="flex items-center justify-center gap-3 h-12 rounded-lg border border-[#e5e7eb] hover:bg-gray-50 transition-colors"
            type="button"
          >
            <img
              alt="Google"
              className="w-5 h-5"
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
            />
            <span className="text-sm font-medium text-[#111318]">Google</span>
          </button>
          <button
            className="flex items-center justify-center gap-3 h-12 rounded-lg border border-[#e5e7eb] hover:bg-gray-50 transition-colors"
            type="button"
          >
            <img
              alt="Facebook"
              className="w-5 h-5"
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg"
            />
            <span className="text-sm font-medium text-[#111318]">Facebook</span>
          </button>
        </div>

        {/* Footer Link */}
        <div className="mt-8 text-center">
          <p className="text-sm text-[#616f89]">
            Bạn đã có tài khoản?{" "}
            <Link
              to="/login"
              className="text-primary font-bold hover:underline ml-1"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </RegisterLayout>
  );
};

export default RegisterPage;

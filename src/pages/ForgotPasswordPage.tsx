import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginLayout from "../layouts/LoginLayout";
import { apiClient } from "../utils/apiClient";

const ForgotPasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await apiClient.post("/auth/forgot-password", {
                email: inputValue,
            });
            navigate("/otp-verification", { state: { email: inputValue } });
        } catch {
            setError("Gửi mã xác nhận thất bại. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <LoginLayout>
            <div className="w-full max-w-[480px] bg-white rounded-xl shadow-lg border border-[#e5e7eb] overflow-hidden">
                <div className="p-8 flex flex-col items-center text-center">
                    {/* Icon */}
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6 text-primary">
                        <span className="material-symbols-outlined text-3xl">
                            lock_reset
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-[#111318] text-3xl font-bold leading-tight mb-3">
                        Khôi phục mật khẩu
                    </h1>
                    <p className="text-gray-500 text-base font-normal leading-relaxed mb-8">
                        Vui lòng chọn phương thức và nhập thông tin để nhận mã xác nhận đặt
                        lại mật khẩu của bạn.
                    </p>

                    {/* Method Selector */}
                    <div className="w-full flex h-12 flex-1 items-center justify-center rounded-lg bg-gray-100 p-1 mb-6 border border-[#e5e7eb]">
                        <label
                            className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-md px-2 text-sm font-semibold leading-normal transition-all bg-white shadow-sm text-[#111318]`}
                        >
                            <span className="material-symbols-outlined mr-2 text-xl">
                                mail
                            </span>
                            <span className="truncate">Email</span>
                            <input
                                className="invisible w-0"
                                name="recovery-method"
                                type="radio"
                                value="email"
                                onChange={() => {
                                    setInputValue("");
                                    setError(null);
                                }}
                            />
                        </label>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="w-full bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined text-lg">error</span>
                            {error}
                        </div>
                    )}



                    {/* Input Form */}
                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
                        <div className="flex flex-col text-left">
                            <label
                                className="text-[#111318] text-sm font-medium leading-normal mb-2"
                                htmlFor="recovery-input"
                            >
                                Địa chỉ Email
                            </label>
                            <div className="relative group flex items-center">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                                    alternate_email
                                </span>
                                <input
                                    className="input pl-12 pr-4 text-base w-full"
                                    id="recovery-input"
                                    placeholder="Nhập email của bạn"
                                    required
                                    type="email"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                />
                            </div>
                        </div>
                        <button
                            disabled={isLoading}
                            className={`flex w-full items-center justify-center rounded-lg h-12 px-6 text-white text-base font-bold transition-all shadow-md mt-2
                ${isLoading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-primary hover:bg-blue-700 hover:shadow-lg"
                                }`}
                            type="submit"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    <span>Đang xử lý...</span>
                                </div>
                            ) : (
                                <>
                                    <span>Gửi mã xác nhận</span>
                                    <span className="material-symbols-outlined ml-2 text-xl">
                                        send
                                    </span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Back to Login */}
                    <div className="mt-8">
                        <Link
                            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary transition-colors"
                            to="/login"
                        >
                            <span className="material-symbols-outlined text-lg mr-1">
                                arrow_back
                            </span>
                            Quay lại Đăng nhập
                        </Link>
                    </div>
                </div>
            </div>
        </LoginLayout>
    );
};

export default ForgotPasswordPage;

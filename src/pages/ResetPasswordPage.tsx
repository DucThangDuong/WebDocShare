import React, { useState, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LoginLayout from "../layouts/LoginLayout";
import { apiClient } from "../utils/apiClient";

interface PasswordStrength {
    level: "weak" | "medium" | "strong" | "very-strong";
    label: string;
    color: string;
    bars: number;
    rules: { label: string; passed: boolean }[];
}

const evaluatePasswordStrength = (password: string): PasswordStrength => {
    const rules = [
        { label: "Ít nhất 8 ký tự", passed: password.length >= 8 },
        {
            label: "Chứa chữ hoa và chữ thường",
            passed: /[a-z]/.test(password) && /[A-Z]/.test(password),
        },
        {
            label: "Chứa số hoặc ký tự đặc biệt",
            passed: /[\d!@#$%^&*(),.?":{}|<>]/.test(password),
        },
    ];

    const passedCount = rules.filter((r) => r.passed).length;

    if (passedCount <= 1) {
        return { level: "weak", label: "Yếu", color: "#EF4444", bars: 1, rules };
    }
    if (passedCount === 2) {
        return {
            level: "medium",
            label: "Trung bình",
            color: "#F59E0B",
            bars: 2,
            rules,
        };
    }
    if (passedCount === 3 && password.length >= 12) {
        return {
            level: "very-strong",
            label: "Rất mạnh",
            color: "#059669",
            bars: 4,
            rules,
        };
    }
    return { level: "strong", label: "Mạnh", color: "#10B981", bars: 3, rules };
};

const ResetPasswordPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as { email?: string; resetToken?: string } | null;
    const email = state?.email || "";
    const resetToken = state?.resetToken || "";

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const strength = useMemo(
        () => evaluatePasswordStrength(newPassword),
        [newPassword]
    );

    React.useEffect(() => {
        if (!email || !resetToken) {
            navigate("/forgot-password", { replace: true });
        } else {
            window.history.replaceState({}, "");
        }
    }, [email, resetToken, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (newPassword !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp.");
            return;
        }

        if (strength.level === "weak") {
            setError("Mật khẩu quá yếu. Vui lòng chọn mật khẩu mạnh hơn.");
            return;
        }

        setIsLoading(true);
        try {
            await apiClient.post("/auth/reset-password", {
                email,
                resetToken,
                newPassword,
            });
            setIsSuccess(true);
        } catch {
            setError("Đặt lại mật khẩu thất bại. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    };

    // Success view
    if (isSuccess) {
        return (
            <LoginLayout>
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#e5e7eb] overflow-hidden">
                    <div className="px-8 pt-10 pb-8 flex flex-col items-center justify-center text-center gap-4">
                        <div className="w-16 h-16 bg-[#10B981]/10 text-[#10B981] rounded-full flex items-center justify-center mb-2">
                            <span className="material-symbols-outlined text-4xl">
                                check_circle
                            </span>
                        </div>
                        <h2 className="text-2xl font-bold text-[#111318]">Thành công!</h2>
                        <p className="text-gray-500 mb-4">
                            Mật khẩu của bạn đã được cập nhật thành công. Vui lòng đăng nhập
                            lại với mật khẩu mới.
                        </p>
                        <Link
                            to="/login"
                            className="w-full flex items-center justify-center rounded-xl h-12 px-4 bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-md"
                        >
                            Tiếp tục đến Đăng nhập
                        </Link>
                    </div>
                </div>
            </LoginLayout>
        );
    }

    return (
        <LoginLayout>
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#e5e7eb] overflow-hidden">
                <div className="px-8 pt-10 pb-8 flex flex-col gap-8">
                    {/* Header */}
                    <div className="text-center">
                        <div className="mx-auto w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined text-3xl">
                                lock_reset
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight mb-3 text-[#111318]">
                            Đặt lại mật khẩu
                        </h1>
                        <p className="text-gray-500 text-sm">
                            Vui lòng nhập mật khẩu mới của bạn và xác nhận để tiếp tục sử
                            dụng DocShare.
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="w-full bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">error</span>
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        {/* New Password */}
                        <div className="flex flex-col gap-2">
                            <label
                                className="text-sm font-semibold text-[#111318]"
                                htmlFor="new-password"
                            >
                                Mật khẩu mới
                            </label>
                            <div className="relative flex w-full items-stretch group">
                                <input
                                    className="input pl-4 pr-12 text-base w-full"
                                    id="new-password"
                                    placeholder="Nhập mật khẩu mới"
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                                <button
                                    className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 hover:text-primary cursor-pointer"
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                    <span className="material-symbols-outlined text-[20px]">
                                        {showNewPassword ? "visibility" : "visibility_off"}
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Password Strength Indicator */}
                        {newPassword.length > 0 && (
                            <div className="flex flex-col gap-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-medium text-gray-500">
                                        Độ mạnh mật khẩu
                                    </span>
                                    <span
                                        className="text-xs font-bold"
                                        style={{ color: strength.color }}
                                    >
                                        {strength.label}
                                    </span>
                                </div>
                                <div className="flex gap-1 h-1.5 w-full">
                                    {[1, 2, 3, 4].map((bar) => (
                                        <div
                                            key={bar}
                                            className="h-full flex-1 rounded-full transition-colors duration-300"
                                            style={{
                                                backgroundColor:
                                                    bar <= strength.bars ? strength.color : "#e5e7eb",
                                            }}
                                        />
                                    ))}
                                </div>
                                <ul className="text-[11px] mt-2 space-y-1">
                                    {strength.rules.map((rule, i) => (
                                        <li
                                            key={i}
                                            className={`flex items-center gap-1.5 ${rule.passed ? "text-[#10B981]" : "text-gray-400"
                                                }`}
                                        >
                                            <span className="material-symbols-outlined text-[14px]">
                                                {rule.passed
                                                    ? "check_circle"
                                                    : "radio_button_unchecked"}
                                            </span>
                                            {rule.label}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Confirm Password */}
                        <div className="flex flex-col gap-2">
                            <label
                                className="text-sm font-semibold text-[#111318]"
                                htmlFor="confirm-password"
                            >
                                Xác nhận mật khẩu mới
                            </label>
                            <div className="relative flex w-full items-stretch group">
                                <input
                                    className="input pl-4 pr-12 text-base w-full"
                                    id="confirm-password"
                                    placeholder="Nhập lại mật khẩu mới"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <button
                                    className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 hover:text-primary cursor-pointer"
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    <span className="material-symbols-outlined text-[20px]">
                                        {showConfirmPassword ? "visibility" : "visibility_off"}
                                    </span>
                                </button>
                            </div>
                            {confirmPassword.length > 0 &&
                                newPassword !== confirmPassword && (
                                    <p className="text-xs text-red-500 mt-1">
                                        Mật khẩu xác nhận không khớp
                                    </p>
                                )}
                        </div>

                        {/* Submit Button */}
                        <button
                            disabled={isLoading}
                            className={`mt-4 flex w-full cursor-pointer items-center justify-center rounded-xl h-12 px-4 text-base font-bold shadow-md transition-all duration-200 ${isLoading
                                ? "bg-gray-400 cursor-not-allowed text-white"
                                : "bg-primary text-white hover:bg-primary/90 hover:-translate-y-0.5"
                                }`}
                            type="submit"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    <span>Đang cập nhật...</span>
                                </div>
                            ) : (
                                "Cập nhật mật khẩu"
                            )}
                        </button>

                        {/* Back to Login */}
                        <div className="text-center mt-2">
                            <Link
                                className="text-sm font-medium text-gray-500 hover:text-primary transition-colors flex items-center justify-center gap-1"
                                to="/login"
                            >
                                <span className="material-symbols-outlined text-[16px]">
                                    arrow_back
                                </span>
                                Quay lại đăng nhập
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </LoginLayout>
    );
};

export default ResetPasswordPage;

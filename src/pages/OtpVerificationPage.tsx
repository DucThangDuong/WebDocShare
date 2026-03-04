import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LoginLayout from "../layouts/LoginLayout";
import { apiClient } from "../utils/apiClient";
import type { ResResetPassDto } from "../interfaces/UserTypes";

const OTP_LENGTH = 6;
const COUNTDOWN_SECONDS = 300;

const OtpVerificationPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const email = (location.state as { email?: string })?.email || "";

    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (!email) {
            navigate("/forgot-password", { replace: true });
        } else {
            window.history.replaceState({}, "");
        }
    }, [email, navigate]);

    useEffect(() => {
        if (countdown <= 0) {
            setCanResend(true);
            return;
        }
        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [countdown]);

    const formatTime = useCallback((seconds: number) => {
        const m = Math.floor(seconds / 60)
            .toString()
            .padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return { minutes: m, seconds: s };
    }, []);

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        setError(null);

        if (value && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
        if (!pastedData) return;

        const newOtp = [...otp];
        for (let i = 0; i < pastedData.length; i++) {
            newOtp[i] = pastedData[i];
        }
        setOtp(newOtp);

        const nextIndex = Math.min(pastedData.length, OTP_LENGTH - 1);
        inputRefs.current[nextIndex]?.focus();
    };

    const handleSubmit = async () => {
        const otpCode = otp.join("");
        if (otpCode.length < OTP_LENGTH) {
            setError("Vui lòng nhập đầy đủ mã OTP.");
            return;
        }

        setError(null);
        setIsLoading(true);
        try {
            const data = await apiClient.post<ResResetPassDto>("/auth/verify-otp", {
                email,
                otp: otpCode,
            });
            navigate("/reset-password", { state: { email, resetToken: data.resetToken } });
        } catch {
            setError("Mã OTP không hợp lệ. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (!canResend) return;
        try {
            await apiClient.post("/auth/forgot-password", { email });
            setCountdown(COUNTDOWN_SECONDS);
            setCanResend(false);
            setOtp(Array(OTP_LENGTH).fill(""));
            setError(null);
            inputRefs.current[0]?.focus();
        } catch {
            setError("Gửi lại mã thất bại. Vui lòng thử lại.");
        }
    };

    const time = formatTime(countdown);

    return (
        <LoginLayout>
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-[#e5e7eb] overflow-hidden">
                <div className="p-8 flex flex-col items-center text-center">
                    {/* Icon & Title */}
                    <span className="material-symbols-outlined text-primary text-5xl mb-4">
                        lock_reset
                    </span>
                    <h1 className="text-[#111318] text-[32px] font-bold leading-tight mb-2">
                        Xác thực mã OTP
                    </h1>
                    <p className="text-gray-500 text-sm font-normal leading-normal mb-1">
                        Mã xác thực đã được gửi đến email của bạn
                    </p>
                    {email && (
                        <p className="text-primary text-sm font-semibold mb-6">{email}</p>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="w-full bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined text-lg">error</span>
                            {error}
                        </div>
                    )}

                    {/* OTP Inputs */}
                    <div className="flex justify-center px-4 py-6 w-full">
                        <fieldset className="relative flex gap-3 sm:gap-4" onPaste={handlePaste}>
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => { inputRefs.current[index] = el; }}
                                    className="flex h-12 w-10 sm:h-14 sm:w-12 text-center [appearance:textfield] focus:outline-0 focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none border-0 border-b-2 border-gray-200 focus:border-0 focus:border-b-2 focus:border-primary text-xl font-bold leading-normal bg-transparent transition-colors text-[#111318]"
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    autoFocus={index === 0}
                                />
                            ))}
                        </fieldset>
                    </div>

                    {/* Countdown Timer */}
                    <div className="flex items-center justify-center gap-2 py-4 w-full">
                        <span className="material-symbols-outlined text-gray-400 text-sm">
                            timer
                        </span>
                        <div className="flex items-center text-gray-600 font-medium">
                            <span>{time.minutes}</span>:<span>{time.seconds}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col w-full gap-3 mt-4">
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className={`flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 text-base font-bold leading-normal tracking-[0.015em] transition-all shadow-sm ${isLoading
                                ? "bg-gray-400 cursor-not-allowed text-white"
                                : "bg-primary hover:bg-primary/90 text-white"
                                }`}
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    <span>Đang xác thực...</span>
                                </div>
                            ) : (
                                <span>Xác nhận</span>
                            )}
                        </button>
                        <button
                            onClick={handleResend}
                            disabled={!canResend}
                            className={`flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 text-sm font-semibold leading-normal tracking-[0.015em] transition-colors border border-transparent ${canResend
                                ? "bg-transparent hover:bg-gray-50 text-gray-600"
                                : "text-gray-300 cursor-not-allowed"
                                }`}
                        >
                            <span>Chưa nhận được? Gửi lại mã</span>
                        </button>
                    </div>

                    {/* Back to Login */}
                    <div className="mt-6 w-full text-center">
                        <Link
                            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary transition-colors"
                            to="/login"
                        >
                            <span className="material-symbols-outlined text-sm">
                                arrow_back
                            </span>
                            Quay lại trang đăng nhập
                        </Link>
                    </div>
                </div>
            </div>
        </LoginLayout>
    );
};

export default OtpVerificationPage;

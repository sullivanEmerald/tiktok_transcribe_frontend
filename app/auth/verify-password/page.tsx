"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import Button from "@/components/genreral/Button";
import { axiosInstance } from "@/lib/utils";
import { showToaster } from "@/lib/utils";

const RESEND_COOLDOWN = 30; // seconds

export default function VerifyPasswordOtp() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") ?? "";

    const [otp, setOtp] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (!email) {
            router.replace("/auth/forgot-password");
            return;
        }
    }, [email, router]);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const handleVerify = async (code: string) => {
        if (code.length !== 6) return;
        setIsVerifying(true);
        setError(null);
        try {
            const { data } = await axiosInstance.post("/auth/verify-reset-otp", {
                email,
                otp: code,
            });
            router.push(
                `/auth/reset-password?ticket=${encodeURIComponent(data.resetTicket)}`
            );
        } catch (err: any) {
            setError(
                err?.response?.data?.message ?? "Invalid or expired code. Please try again."
            );
            setOtp("");
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResend = async () => {
        if (cooldown > 0) return;
        setIsResending(true);
        setError(null);
        try {
            await axiosInstance.post("/auth/forgot-password", { email });
            showToaster("A new code has been sent to your email.");
            setCooldown(RESEND_COOLDOWN);
            setOtp("");
        } catch (err: any) {
            setError(
                err?.response?.data?.message ?? "Couldn't resend the code. Please try again."
            );
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center px-4">
            <div className="w-full max-w-sm text-center">
                <h1 className="text-2xl font-bold">Check your email</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    We sent a 6-digit code to <span className="font-medium">{email}</span>.
                    Enter it below to continue.
                </p>

                <div className="mt-8 flex justify-center">
                    <InputOTP
                        maxLength={6}
                        value={otp}
                        onChange={(value) => {
                            setOtp(value);
                            setError(null);
                            if (value.length === 6) handleVerify(value);
                        }}
                        disabled={isVerifying}
                    >
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                </div>

                {error && (
                    <p className="mt-4 text-sm text-red-500" role="alert">
                        {error}
                    </p>
                )}

                <Button
                    className="mt-8 w-full"
                    onClick={() => handleVerify(otp)}
                    disabled={otp.length !== 6 || isVerifying}
                >
                    {isVerifying ? "Verifying..." : "Verify code"}
                </Button>

                <div className="mt-6 text-sm text-muted-foreground">
                    Didn't get the code?{" "}
                    <button
                        onClick={handleResend}
                        disabled={cooldown > 0 || isResending}
                        className="font-medium text-primary underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline"
                    >
                        {isResending
                            ? "Sending..."
                            : cooldown > 0
                                ? `Resend in ${cooldown}s`
                                : "Resend code"}
                    </button>
                </div>
            </div>
        </div>
    );
}
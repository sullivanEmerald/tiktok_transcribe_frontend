"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Input from "@/components/genreral/Input";
import Button from "@/components/genreral/Button";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { axiosInstance } from "@/lib/utils";
import { showToaster } from "@/lib/utils";

const rules = [
    { label: "At least 8 characters", test: (pw: string) => pw.length >= 8 },
    { label: "One uppercase letter", test: (pw: string) => /[A-Z]/.test(pw) },
    { label: "One number", test: (pw: string) => /[0-9]/.test(pw) },
];

export default function ResetPassword() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const ticket = searchParams.get("ticket") ?? "";

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!ticket) {
            router.replace("/auth/forgot-password");
        }
    }, [ticket, router]);

    const allRulesPass = rules.every((r) => r.test(password));
    const passwordsMatch = password.length > 0 && password === confirmPassword;
    const canSubmit = allRulesPass && passwordsMatch && !isSubmitting;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;

        setIsSubmitting(true);
        setError(null);
        try {
            await axiosInstance.post("/auth/reset-password", {
                resetTicket: ticket,
                newPassword: password,
            });
            setSuccess(true);
            showToaster("Password reset successful.", "success");
            setTimeout(() => router.push("/auth/login"), 2000);
        } catch (err: any) {
            setError(
                err?.response?.data?.message ??
                "Couldn't reset your password. Please request a new code and try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="flex min-h-screen w-full flex-col items-center justify-center px-4">
                <div className="w-full max-w-sm text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <Check className="h-6 w-6 text-green-600" />
                    </div>
                    <h1 className="mt-4 text-2xl font-bold">Password reset</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Redirecting you to login...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center px-4">
            <div className="w-full max-w-sm">
                <h1 className="text-2xl font-bold">Set a new password</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Choose a strong password you haven't used before.
                </p>

                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <div className="relative">
                            <Input
                                id="password"
                                label="New Password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="new-password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="absolute right-3 top-13 -translate-y-1/2 text-muted-foreground"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                label="Confirm Password"
                                type={showConfirm ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                autoComplete="new-password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm((v) => !v)}
                                className="absolute right-3 top-13 -translate-y-1/2 text-muted-foreground"
                                tabIndex={-1}
                            >
                                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        {confirmPassword.length > 0 && !passwordsMatch && (
                            <p className="text-xs text-red-500">Passwords don't match</p>
                        )}
                    </div>

                    <ul className="space-y-1">
                        {rules.map((rule) => {
                            const pass = rule.test(password);
                            return (
                                <li
                                    key={rule.label}
                                    className={`flex items-center gap-2 text-xs ${pass ? "text-green-600" : "text-muted-foreground"
                                        }`}
                                >
                                    {pass ? <Check size={12} /> : <X size={12} />}
                                    {rule.label}
                                </li>
                            );
                        })}
                    </ul>

                    {error && (
                        <p className="text-sm text-red-500" role="alert">
                            {error}
                        </p>
                    )}

                    <Button type="submit" className="w-full" disabled={!canSubmit}>
                        {isSubmitting ? "Resetting..." : "Reset password"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
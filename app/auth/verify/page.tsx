"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Button from "@/components/genreral/Button";
import { MailCheck } from 'lucide-react'
import { verifyEmailToken, resendVerificationEmail } from "@/services/auth";
import LineLoader from "@/components/genreral/lineLoader";
import { showToaster } from "@/lib/utils";
import Input from "@/components/genreral/Input";
import { emailPattern } from "@/data/constants";
import { AxiosError } from "axios";

type Status = 'loading' | 'success' | 'error' | 'idle';

const RESEND_COOLDOWN_SECONDS = 60;

// 1. Core verification form logic isolated here
function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [status, setStatus] = useState<Status>('idle');
    const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);
    const [resending, setResending] = useState(false);
    const router = useRouter();
    const [showInput, setShowInput] = useState(false);
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (token) {
            setStatus('loading');
            const verifyToken = async () => {
                try {
                    await verifyEmailToken(token);
                    setStatus('success');
                    setTimeout(() => {
                        router.push('/auth/login');
                    }, 3000);
                } catch (error) {
                    setStatus('error');
                }
            };
            verifyToken();
        } else {
            // FIXED: Only redirect if there's no token to verify
            router.push('/auth/login');
        }
    }, [token, router]);

    useEffect(() => {
        if (cooldown <= 0) return;
        const interval = setInterval(() => {
            setCooldown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [cooldown]);

    const handleResend = async () => {
        setEmailError('');
        setMessage('');
        if (!emailPattern.test(email)) {
            setEmailError("Please enter a valid email address.");
            return;
        }
        setResending(true);
        try {
            await resendVerificationEmail(email);
            showToaster("Verification email resent successfully!", "success");
            setMessage("Verification email resent successfully!");
            setEmail('');
            setEmailError('');
            setShowInput(false);
        } catch (error) {
            console.log("verify error", error);
            if (error instanceof AxiosError && error.response?.status === 409) {
                setTimeout(() => {
                    router.push('/auth/login');
                }, 2000);
            }
        } finally {
            setResending(false);
            setCooldown(RESEND_COOLDOWN_SECONDS);
        }
    };

    const isButtonDisabled =
        status === 'loading' || status === 'success' || cooldown > 0 || resending;

    return (
        <div className="flex flex-col shadow-md p-6 rounded-lg bg-background w-full max-w-lg mx-auto mt-10">
            <div className="flex items-center justify-center mb-4 rounded-full bg-green-100 w-16 h-16 mx-auto">
                <MailCheck className="w-6 h-6 text-green-500" />
            </div>
            <h1 className="text-2xl text-foreground font-bold mb-4 text-center">Email Verification</h1>
            {status === 'loading' ? (
                <div className="flex items-center gap-2 mb-4 justify-center">
                    <LineLoader text="primary" />
                    <p className="text-muted-foreground">Verifying your email... Please Wait</p>
                </div>
            ) : status === 'success' ? (
                <p className="text-green-600 mb-4 text-center">Your email has been successfully verified! Redirecting to Login...</p>
            ) : status === 'error' ? (
                <p className="text-red-600 text-center mb-4">There was an error verifying your email. Please try again.</p>
            ) : (
                <div>
                    {message && <p className="text-green-600 mb-4 text-center">{message}</p>}
                    {message === "" && (
                        <div className="text-center mb-4">
                            <p className="text-muted-foreground mb-4">A verification email has been sent to your email address.</p>
                            <p className="text-muted-foreground">If you haven't received the email, please check your spam folder or request a new verification email.</p>
                        </div>
                    )}
                </div>
            )}
            {showInput && (
                <div className="mb-4 w-full md:w-1/2 mx-auto">
                    <Input
                        type="email"
                        placeholder="Enter your email"
                        className=""
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {emailError && <p className="text-red-600 text-xs mt-1">{emailError}</p>}
                </div>
            )}

            {showInput ? (
                <Button onClick={handleResend} disabled={resending || !email || emailError !== ''}>
                    Send Now
                </Button>
            ) : (
                <Button onClick={() => setShowInput(true)} disabled={isButtonDisabled}>
                    {cooldown > 0
                        ? `Resend Verification Email (${cooldown}s)`
                        : 'Resend Verification Email'}
                </Button>
            )}
        </div>
    );
}


export default function VerifyEmailToken() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center p-12 mt-10 w-full max-w-lg mx-auto">
                <p className="text-muted-foreground text-sm">Preparing verification environment...</p>
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
}
"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Button from "@/components/genreral/Button";
import { Settings } from 'lucide-react'
import { resetPassword } from "@/services/auth";
import LineLoader from "@/components/genreral/lineLoader";
import { useRouter } from "next/navigation";
import { showToaster } from "@/lib/utils";
import Input from "@/components/genreral/Input";
import { emailPattern } from "@/data/constants";
import { AxiosError } from "axios";



const RESEND_COOLDOWN_SECONDS = 60;

export default function ForgotPassword() {
    const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);
    const [sending, setSending] = useState(false);
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('')


    useEffect(() => {
        if (cooldown <= 0) return;
        const interval = setInterval(() => {
            setCooldown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [cooldown]);


    const handleResend = async () => {
        setEmailError('');
        if (!emailPattern.test(email)) {
            setEmailError("Please enter a valid email address.");
            return;
        }
        setSending(true)
        try {
            await resetPassword(email);
            setEmail('');
            setEmailError('');
            router.push(`/auth/verify-password?email=${email}`)
        } catch (error) {
            if (error instanceof AxiosError && error.response?.status === 409) {
                setTimeout(() => {
                    router.push('/auth/login');
                }, 2000);
            }
        } finally {
            setSending(false);
            setCooldown(RESEND_COOLDOWN_SECONDS);
        }
    };

    const isButtonDisabled = sending || cooldown > 0

    return (
        <div className="flex flex-col shadow-md p-6 rounded-lg bg-background w-full max-w-lg mx-auto mt-8">
            <div className="flex items-center justify-center mb-4 rounded-full bg-green-100 w-16 h-16 mx-auto">
                <Settings className="w-6 h-6 text-green-500" />
            </div>
            <h1 className="text-2xl text-foreground font-bold mb-2 text-center">Reset Passwrord</h1>
            <div className="my-8 w-full md:w-[70%] mx-auto">
                <Input
                    type="email"
                    placeholder="Enter your email"
                    className=""
                    onChange={(e) => {
                        setEmailError(''),
                            setEmail(e.target.value)
                    }}
                />
                {emailError && <p className="text-red-600">{emailError}</p>}
            </div>
            <Button onClick={handleResend} disabled={isButtonDisabled || emailError !== ''}>
                {cooldown > 0
                    ? `Resend in (${cooldown}s)`
                    : 'Resend'}
            </Button>
        </div>
    );
}
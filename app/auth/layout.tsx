"use client"
import AuthInformations from "@/components/auth/authenticaion";
import Navigation from "@/components/auth/navigation";
import { useAuth } from "@/hooks/useAuth"
import { useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/stores/store";
import { useShallow } from "zustand/react/shallow";
import AuthLoader from "@/components/auth/loader";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const { isloading } = useStore(useShallow((state) => ({
        isloading: state.isRefreshingUser,
    })))

    useLayoutEffect(() => {
        if (isAuthenticated) {
            router.replace('/dashboard')
        }
    }, [isAuthenticated])

    return (
        <div className="w-full min-h-screen">
            <Navigation />
            <div className="min-h-screen w-full flex flex-col md:flex-row bg-background">
                <div className="hidden lg:block w-full md:w-1/2">
                    <AuthInformations />
                </div>
                <div className="w-full lg:w-1/2 flex flex-col justify-center px-6">
                    <div className="">{children}</div>
                </div>
            </div>
        </div>
    );
}
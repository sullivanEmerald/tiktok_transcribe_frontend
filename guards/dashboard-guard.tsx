"use client"
import useAuth from "@/components/auth/intitailizeAuth"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/genreral/logo";
import { useStore } from "@/stores/store";
import { useShallow } from "zustand/react/shallow";
import AuthLoader from "@/components/auth/loader";


export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    const { user, isloading, initialized } = useStore(useShallow((state) => ({
        user: state.user,
        isloading: state.isRefreshingUser,
        initialized: state.initialized
    })))

    const router = useRouter();

    useEffect(() => {
        if (initialized && !isloading && !user) {
            router.push('/auth/login')
        }
    }, [isloading, user, router, initialized])

    if (isloading) return <AuthLoader />

    return <>{children}</>
}
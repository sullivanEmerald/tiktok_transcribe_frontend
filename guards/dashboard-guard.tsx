"use client"
import useAuth from "@/components/auth/intitailizeAuth"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/genreral/logo";
import { useStore } from "@/stores/store";
import { useShallow } from "zustand/react/shallow";
import AuthLoader from "@/components/auth/loader";


export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    const { user, isloading } = useStore(useShallow((state) => ({
        user: state.user,
        isloading: state.isRefreshingUser,
    })))

    const router = useRouter();

    useEffect(() => {
        if (!isloading && !user) {
            router.push('/')
        }
    }, [isloading, user, router])



    if (isloading && !user) return <AuthLoader />

    return <>{children}</>
}
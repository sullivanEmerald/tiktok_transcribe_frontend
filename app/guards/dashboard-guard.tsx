import useAuth from "@/context/AuthProvider"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/genreral/logo";
import { useStore } from "@/stores/store";
import { useShallow } from "zustand/react/shallow";


export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    const { user, isloading } = useStore(useShallow((state) => ({
        user: state.user,
        isloading: state.isRefreshingUser
    })))

    const router = useRouter();

    useEffect(() => {
        if (!isloading && !user) {
            router.push('/auth/login')
        }
    }, [isloading, user])

    if (isloading) {
        return (
            <div className="h-screen w-screen bg-background flex items-center justify-center">
                <Logo />
            </div>
        )
    }

    return <>{children}</>
}
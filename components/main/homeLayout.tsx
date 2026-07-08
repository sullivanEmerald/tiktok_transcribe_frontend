"use client"
import { NavigationBar } from "../ui/NavigationIndex"
import Footer from "../genreral/footer"
import { useEffect } from "react";
import { useStore } from "@/stores/store";
import { useShallow } from "zustand/react/shallow";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import AuthLoader from "../auth/loader";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { isloading } = useStore(useShallow((state) => ({
        isloading: state.isRefreshingUser,
    })))
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            router.replace('/dashboard')
        }
    }, [isAuthenticated])
    return (
        <section>
            <div className="px-8">
                <div className="sticky top-0 z-30">
                    <NavigationBar />
                </div>
                <main className="pt-8 sm:pt-15">
                    {children}
                </main>
            </div>
            <footer className="w-full max-w-full mt-4">
                <Footer />
            </footer>
        </section>
    )
}
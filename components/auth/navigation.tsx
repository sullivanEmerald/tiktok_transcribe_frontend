"use client";
import { Back } from "../genreral/back";
import { GoHome } from "../genreral/home";
import { ThemeToggle } from "../genreral/useToggle";
import { usePathname } from "next/navigation";
import Link from "next/link";

const Navigation = () => {
    const pathname = usePathname();
    return (
        <nav className="flex justify-between items-center p-4 bg-background sticky border-b border-card backdrop-blur-md shadow-sm top-0 z-30">
            <GoHome />
            <div className="flex items-center gap-2">
                <ThemeToggle />
                {pathname === '/auth/register' ? (
                    <div className="flex items-center gap-1">
                        <span className="hidden sm:block text-sm text-muted-foreground">Already have an account? {" "}</span>
                        <Link href="/auth/login" className="text-primary font-semibold hover:underline">
                            Login
                        </Link>
                    </div>
                ) : pathname === '/auth/login' ? (
                    <div className="flex items-center gap-1">
                        <span className="hidden sm:block text-sm text-muted-foreground">Don&apos;t have an account? {" "}</span>
                        <Link href="/auth/register" className="text-primary font-semibold hover:underline">
                            Register
                        </Link>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <Link href="/auth/login" className="text-primary font-semibold hover:underline">
                            Login
                        </Link>
                        <Link href="/auth/register" className="text-primary font-semibold hover:underline">
                            Register
                        </Link>
                    </div>
                )}

            </div>
        </nav>
    );
};

export default Navigation;  

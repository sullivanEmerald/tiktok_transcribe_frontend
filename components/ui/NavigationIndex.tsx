"use client";

import Link from "next/link";
import Image from "next/image";
// import { Button } from "./button";
import { useRouter } from "next/navigation";
import { mainNavigation } from "@/data/constants";
// import { useAuth } from "@/hooks/use-auth";

export function NavigationBar() {
    const router = useRouter();
    // const { isAuthenticated, userRole } = useAuth();

    return (
        <header className="border border-opacity-10 border-gray-200 bg-background/80 backdrop-blur-sm z-50 rounded-lg shadow-sm">
            <div className="flex h-16 items-center px-4 justify-between w-full">
                {/* Logo */}

                {/* Centered Nav */}
                <nav className="hidden md:flex items-center space-x-6">
                    {mainNavigation.map((nav, idx) => (
                        <Link href={nav.href} key={idx} className="text-sm text-[#81838C] hover:text-[#1e40af] hover:bg-gray-50 transition-colors duration-200">{nav.name}</Link>
                    ))}
                </nav>

                {/* Get Started Button */}
                <div className="flex items-center space-x-4">
                    <button
                        className="sm:flex bg-[#0209b2] p-2 rounded-lg text-white"
                        onClick={() => {
                            router.push('/auth/login')
                        }}
                    >
                        {'Get Started'}
                    </button>
                </div>
            </div>
        </header>
    );
}

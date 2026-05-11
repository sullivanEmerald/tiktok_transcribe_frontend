"use client";
import { useRouter } from "next/navigation";
import { mainNavigation } from "@/data/constants";
import { Menu, EyeClosed, EyeIcon } from "lucide-react";
import Logo from "../genreral/logo";
import Link from "next/link";

export function NavigationBar({ onOpen, isOpen }: { onOpen?: () => void, isOpen?: boolean }) {
    const router = useRouter();
    return (
        <header className="border border-opacity-10 border-gray-200 bg-background/80 backdrop-blur-sm z-50 rounded-sm shadow-sm">
            <div className="flex h-16 items-center px-4 justify-between w-full">
                <div className="flex items-center">
                    <Logo />
                </div>
                <div className="flex items-center gap-3">
                    <nav className="hidden md:flex items-center space-x-2">
                        {mainNavigation.map((nav, idx) => (
                            <Link href={nav.href} key={idx} className="text-sm text-primary hover:primary/80 hover:underline hover:bg-gray-50 transition-colors duration-200">
                                <div className="flex item-center gap-1">
                                    <nav.icon className="w-4 h-4" />
                                    <span>{nav.name}</span>
                                </div>
                            </Link>
                        ))}
                    </nav>

                    <button className="hidden md:flex items-center gap-1 cursor-pointer" onClick={onOpen} aria-label="Open sidebar" >
                        {isOpen ? <EyeClosed className="w-5 h-5 text-primary" /> : <EyeIcon className="w-5 h-5 text-primary" />}
                        <span className="text-sm text-primary hover:primary/80 hover:underline hover:bg-gray-50 transition-colors duration-200">Previous Transcripts</span>
                    </button>
                </div>
                <button className="md:hidden" onClick={onOpen} aria-label="Open sidebar">
                    <Menu className="w-6 h-6 text-primary" />
                </button>
            </div>
        </header>
    );
}

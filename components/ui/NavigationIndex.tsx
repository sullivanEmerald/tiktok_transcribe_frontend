"use client";
import { useRouter } from "next/navigation";
import { mainNavigation } from "@/data/constants";
import { EyeClosed, EyeIcon, Menu, History } from "lucide-react";
import Logo from "../genreral/logo";
import Link from "next/link";
import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react";
import { ThemeToggle } from "../genreral/useToggle";

export function NavigationBar({ onOpen, isOpen }: { onOpen?: () => void, isOpen?: boolean }) {
    const router = useRouter();
    const [showPopover, setShowPopover] = useState(false)
    return (
        <header className="bg-card/50 backdrop-blur-sm z-50 rounded-sm shadow-sm shadow-card">
            <div className="flex h-16 items-center px-4 justify-between w-full">
                <div className="flex items-center">
                    <Logo />
                </div>
                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    <nav className="hidden md:flex items-center space-x-2">
                        {mainNavigation.map((nav, idx) => (
                            <Link href={nav.href} key={idx} className="text-sm text-text p-2 rounded-2xl bg-primary hover:bg-primary/80 hover:underline transition-colors duration-200">
                                <div className="flex item-center gap-1">
                                    <nav.icon className="w-4 h-4" />
                                    <span>{nav.name}</span>
                                </div>
                            </Link>
                        ))}
                    </nav>

                    <button className="hidden md:flex items-center text-text p-2 rounded-2xl bg-primary hover:bg-primary/80 hover:underline gap-1 cursor-pointer" onClick={onOpen} aria-label="Open sidebar" >
                        {isOpen ? <EyeClosed className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                        <span className="text-sm transition-colors duration-200">My Transcripts</span>
                    </button>
                </div>

                <Popover open={showPopover} onOpenChange={setShowPopover}>
                    <PopoverTrigger asChild>
                        <button className="md:hidden" aria-label="Open menu">
                            <Menu className="w-6 h-6 text-primary" />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56 p-2 border-none" align="end">
                        <div className="flex flex-col gap-1">
                            {mainNavigation.map((nav, idx) => (
                                <Link
                                    key={idx}
                                    href={nav.href}
                                    onClick={() => setShowPopover(false)}
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-gray-100 hover:text-primary transition-colors duration-200"
                                >
                                    <nav.icon className="text-primary w-4 h-4" />
                                    <span>{nav.name}</span>
                                </Link>
                            ))}

                            <hr className="my-1 border-gray-100" />

                            <button
                                onClick={() => {
                                    onOpen?.();
                                    setShowPopover(false);
                                }}
                                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-gray-100 hover:text-primary transition-colors duration-200 w-full text-left">
                                <History className="w-4 h-4 text-primary" />
                                <span>Previous Transcripts</span>
                            </button>
                        </div>
                    </PopoverContent>
                </Popover>

            </div>
        </header>
    );
}

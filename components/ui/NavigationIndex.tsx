"use client";
import { useRouter } from "next/navigation";
import { mainNavigation } from "@/data/constants";
import { EyeClosed, EyeIcon, Menu, History, LogIn, User, Settings, LogOut, Library, Logs } from "lucide-react";
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
import { useAuth } from "@/hooks/useAuth";
import DisplayAvatar from "../genreral/avatar";


type MenuItem = {
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    to?: string;
};


const menuItems: MenuItem[] = [
    {
        label: "Profile",
        icon: User,
        to: "/dashboard/profile",
    },
    // {
    //     label: "Settings",
    //     icon: Settings,
    //     to: "/dashbaord/account",
    // },
    {
        label: "Logout",
        icon: LogOut,
    },
];

const AuthMenu = [
    {
        label: "blogs",
        icon: Logs,
        to: "/blog",
        redirect: true
    },
    {
        label: "Login",
        icon: LogIn,
        to: "/auth/login",
        redirect: false
    },
    {
        label: "Register",
        icon: User,
        to: "/auth/register",
        redirect: false
    },
];

export function NavigationBar({ onOpen, isOpen }: { onOpen?: () => void, isOpen?: boolean }) {
    const router = useRouter();
    const { isAuthenticated, user, logout } = useAuth();
    const [showPopover, setShowPopover] = useState(false)
    return (
        <header className="bg-card/50 backdrop-blur-sm z-50 rounded-sm shadow-sm shadow-card">
            <div className="flex h-16 items-center px-4 justify-between w-full">
                <div className="flex items-center">
                    <Logo />
                </div>

                {isAuthenticated && (
                    <div className="flex items-center gap-3">
                        <nav className="hidden md:flex items-center space-x-2">
                            {mainNavigation.map((nav, idx) => (
                                <Link href={nav.href} key={idx} target={nav.redirect ? "_blank" : ""} className="text-md text-muted-foreground p-2 hover:text-primary transition duration-200">
                                    <div className="flex items-center gap-1">
                                        <nav.icon className="w-4 h-4" />
                                        <span>{nav.name}</span>
                                    </div>
                                </Link>
                            ))}
                        </nav>

                        {isAuthenticated && (
                            <button className="hidden md:flex items-center text-muted-foreground p-2 rounded-2xl hover:text-primary gap-1 cursor-pointer" onClick={onOpen} aria-label="Open sidebar" >
                                {isOpen ? <EyeClosed className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                <span className="text-sm transition-colors duration-200">History</span>
                            </button>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    {isAuthenticated ? (
                        <Popover>
                            <PopoverTrigger asChild>
                                <div className="hidden sm:block flex items-center gap-2 cursor-pointer">
                                    <DisplayAvatar name={user?.firstName} />
                                </div>
                            </PopoverTrigger>
                            <PopoverContent>
                                <PopoverHeader>
                                    <PopoverTitle>Account menu</PopoverTitle>
                                </PopoverHeader>
                                <div>
                                    {menuItems.map(({ label, icon: Icon, to }, index) => (
                                        <div key={label}>
                                            {to ? (
                                                <>
                                                    <Link href={to} className="flex items-center gap-3 py-3 cursor-pointer hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-primary">
                                                        <Icon size={18} className="text-muted-foreground" />
                                                        <span className="text-sm font-medium text-gray-700">
                                                            {label}
                                                        </span>
                                                    </Link>
                                                    <hr className="border-gray-200 mx-4" />
                                                </>
                                            ) : (
                                                <button className="flex items-center gap-3 py-3 w-full cursor-pointer hover:bg-gray-100 transition border-none outline-none bg-transparent focus:outline-none" onClick={logout}>
                                                    <Icon size={18} className="text-muted-foreground" />
                                                    <span className="text-sm font-medium text-gray-700">
                                                        {label}
                                                    </span>
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </PopoverContent>
                        </Popover>
                    ) : (
                        <div className="hidden md:flex items-center w-full">
                            {
                                AuthMenu.map((nav, idx) => (
                                    <Link
                                        key={idx}
                                        href={nav.to}
                                        onClick={() => setShowPopover(false)}
                                        target={nav.redirect ? '_blank' : ""}
                                        className="flex items-center gap-1 px-2 py-2 rounded-lg text-md text-primary hover:bg-gray-100 hover:text-primary transition-colors duration-200"
                                    >
                                        <nav.icon className="text-primary w-4 h-4" />
                                        <span>{nav.label}</span>
                                    </Link>

                                ))
                            }
                        </div>
                    )}
                </div>

                <Popover open={showPopover} onOpenChange={setShowPopover}>
                    <PopoverTrigger asChild>
                        <button className="md:hidden" aria-label="Open menu" id="mobile-menu-trigger" suppressHydrationWarning>
                            <Menu className="w-6 h-6 text-primary" />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56 p-2 border-none" align="end">
                        <div className="flex flex-col gap-1">
                            {isAuthenticated ? (
                                mainNavigation.map((nav, idx) => (
                                    <Link
                                        key={idx}
                                        href={nav.href}
                                        onClick={() => setShowPopover(false)}
                                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-gray-100 hover:text-primary transition-colors duration-200"
                                    >
                                        <nav.icon className="text-muted-foreground w-4 h-4" />
                                        <span>{nav.name}</span>
                                    </Link>

                                ))) : (
                                AuthMenu.map((nav, idx) => (
                                    <Link
                                        key={idx}
                                        href={nav.to}
                                        onClick={() => setShowPopover(false)}
                                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-gray-100 hover:text-primary transition-colors duration-200"
                                    >
                                        <nav.icon className="text-muted-foreground w-4 h-4" />
                                        <span>{nav.label}</span>
                                    </Link>

                                ))

                            )}

                            <hr className="my-1 border-gray-100" />

                            {isAuthenticated ? (
                                <button
                                    onClick={() => {
                                        onOpen?.();
                                        setShowPopover(false);
                                    }}
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-gray-100 hover:text-primary transition-colors duration-200 w-full text-left">
                                    <History className="w-4 h-4 text-muted-foreground" />
                                    <span>Previous Transcripts</span>
                                </button>
                            ) : (
                                <Link href="/blog" target="_blank" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-gray-100 hover:text-primary transition-colors duration-200">
                                    <div className="flex items-center gap-1">
                                        <Logs className="w-4 h-4" />
                                        <span>Blogs</span>
                                    </div>
                                </Link>
                            )}
                            {isAuthenticated && (
                                <button
                                    onClick={logout}
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-gray-100 hover:text-primary border-t transition-colors duration-200 w-full text-left">
                                    <LogOut className="w-4 h-4 text-muted-foreground" />
                                    <span>logout</span>
                                </button>
                            )}
                        </div>
                    </PopoverContent>
                </Popover>

            </div>
        </header>
    );
}

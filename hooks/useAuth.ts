"use client";
import { useStore } from "@/stores/store";
import { useShallow } from "zustand/react/shallow";
import { useMemo } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL

export function useAuth() {
    const { user, isLoading, logout } = useStore(useShallow((state) => ({
        user: state.user,
        isLoading: state.isRefreshingUser,
        logout: state.logout,
    })))


    const isAuthenticated = useMemo(() => {
        return !!user && !isLoading
    }, [user, isLoading])

    const userlogin = () => window.location.href = `${API_URL}/auth/google`

    return {
        isAuthenticated,
        user,
        logout,
        userlogin
    }
}
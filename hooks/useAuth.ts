"use client";
import { useStore } from "@/stores/store";
import { useShallow } from "zustand/react/shallow";
import { useMemo } from "react";

export function useAuth() {
    const { user, isLoading } = useStore(useShallow((state) => ({
        user: state.user,
        isLoading: state.isRefreshingUser,
    })))


    const isAuthenticated = useMemo(() => {
        return !!user && !isLoading
    }, [user, isLoading])

    return {
        isAuthenticated,
        user
    }
}
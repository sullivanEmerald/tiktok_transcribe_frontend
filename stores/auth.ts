import { StateCreator } from "zustand";
import { create } from 'zustand';
import { axiosInstance } from '@/lib/utils';
import { Store } from "@/types/store";
import { CurrentUser } from "@/services/auth";

interface User {
    id: string;
    email: string;
    firstName: string,
}

type AuthActions = {
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
    refreshUser: () => Promise<void>;
    logout: () => void;
}


export type AuthSlice = {
    user: User | null,
    isRefreshingUser: boolean,
    initialized: boolean,
} & AuthActions;



export const createAuthSlice: StateCreator<Store, [['zustand/immer', never]], [], AuthSlice> = (set, get) => ({
    user: null,
    isRefreshingUser: false,
    error: null,
    initialized: false,

    setUser: (user) => set({ user }),

    setLoading: (isRefreshingUser) => set({ isRefreshingUser }),

    refreshUser: async () => {
        try {
            set({ isRefreshingUser: true });
            const response = await CurrentUser();
            set({ user: response });
        } catch (err: any) {
            set({
                user: null,
            });
        } finally {
            set({ isRefreshingUser: false })
        }
    },

    logout: () => {
        // Optional: call logout API
        // await axiosInstance.post('/auth/logout');
        // You can also clear tokens here if needed
    },
});
import { StateCreator } from "zustand";
import { create } from 'zustand';
import { axiosInstance } from '@/lib/utils';
import { Store } from "@/types/store";
import { CurrentUser } from "@/services/auth";
import { Logout } from "@/services/auth";
import { User } from "@/types/user";


type AuthActions = {
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
    refreshUser: () => Promise<void>;
    logout: () => void;
}


export type AuthSlice = {
    user: User | null,
    isRefreshingUser: boolean,

} & AuthActions;



export const createAuthSlice: StateCreator<Store, [['zustand/immer', never]], [], AuthSlice> = (set, get) => ({
    user: null,
    isRefreshingUser: true,
    error: null,


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

    logout: async () => {
        try {
            await Logout();
        } catch (err) {
            console.log(err)
        } finally {
            set({ user: null, isRefreshingUser: false });
        }
    },
});
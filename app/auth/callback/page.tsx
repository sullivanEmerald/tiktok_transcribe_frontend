'use client';
import { useStore } from '@/stores/store';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useShallow } from 'zustand/react/shallow';
import AuthLoader from '@/components/auth/loader';


export default function AuthCallbackPage() {
    const router = useRouter();
    const { user, isloading, refreshUser } = useStore(useShallow((state) => ({
        user: state.user,
        isloading: state.isRefreshingUser,
        refreshUser: state.refreshUser,
    })))

    useEffect(() => {
        refreshUser().then(() => router.replace('/dashboard'));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isloading && !user) return <AuthLoader />

    return null;
}

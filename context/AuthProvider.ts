"use client";
import { useStore } from "@/stores/store";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/utils";
import { useShallow } from "zustand/react/shallow";


export default function AuthInitializer() {
    const { refreshUser } = useStore(useShallow((state) => ({
        refreshUser: state.refreshUser
    })))

    useEffect(() => {
        refreshUser();
    }, []);

    return null;
    ;
}
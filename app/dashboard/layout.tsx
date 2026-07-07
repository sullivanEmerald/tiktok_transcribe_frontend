import AuthProvider from "@/context/AuthProvider";
import React from "react";
import { AuthGuard } from "../guards/dashboard-guard";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard>
            {children}
        </AuthGuard>
    );
}
import AuthInitializer from "@/components/auth/intitailizeAuth";
import React from "react";
import { AuthGuard } from "../../guards/dashboard-guard";
import { Layout } from "@/components/genreral/layout";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <AuthInitializer />
            <AuthGuard>
                <Layout>
                    {children}
                </Layout>
            </AuthGuard>
        </>
    );
}
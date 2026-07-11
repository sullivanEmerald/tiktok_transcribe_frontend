import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ONLY_ROUTES = [
    "/",
    "/auth/login",
    "/auth/register",
    "/auth/verify",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/auth/verify-password"
];

export function middleware(req: NextRequest) {
    const pathname = req.nextUrl.pathname;

    const hasRefreshToken = !!req.cookies.get("refreshToken");

    const isPublicOnly = PUBLIC_ONLY_ROUTES.includes(pathname);

    const isDashBoardPaae = pathname.startsWith('/dashboard')

    if (hasRefreshToken && isPublicOnly) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (!hasRefreshToken && isDashBoardPaae) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/dashboard/:path*",
        "/auth/:path*",
    ],
};
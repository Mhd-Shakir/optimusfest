import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Protect all admin routes except /admin/login
    if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
        const isAdmin = request.cookies.get("is_admin")?.value

        if (isAdmin !== "true") {
            const loginUrl = new URL("/admin/login", request.url)
            return NextResponse.redirect(loginUrl)
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/admin/:path*"],
}

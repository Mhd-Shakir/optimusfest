import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
    try {
        const { password } = await request.json()

        if (password === process.env.ADMIN_PASSWORD) {
            const cookieStore = await cookies()

            cookieStore.set("is_admin", "true", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 24 * 7, // 1 week
                path: "/",
            })

            return NextResponse.json({ success: true })
        }

        return NextResponse.json({ success: false }, { status: 401 })
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 })
    }
}

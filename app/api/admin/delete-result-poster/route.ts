import { NextRequest, NextResponse } from "next/server"
import { unlink } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function POST(request: NextRequest) {
    try {
        const { posterUrl } = await request.json()

        if (!posterUrl) {
            return NextResponse.json({ error: "No poster URL provided" }, { status: 400 })
        }

        // Convert URL to file path
        const filepath = join(process.cwd(), "public", posterUrl)

        // Check if file exists
        if (existsSync(filepath)) {
            await unlink(filepath)
            return NextResponse.json({ success: true, message: "Poster deleted" })
        } else {
            return NextResponse.json({ error: "File not found" }, { status: 404 })
        }
    } catch (error) {
        console.error("Delete error:", error)
        return NextResponse.json({ error: "Delete failed" }, { status: 500 })
    }
}

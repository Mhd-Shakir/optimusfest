import { NextRequest, NextResponse } from "next/server"
import { unlink } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs" // Keep for legacy cleanup if needed
import cloudinary from "@/lib/cloudinary"

export async function POST(request: NextRequest) {
    try {
        const { posterUrl } = await request.json()

        if (!posterUrl) {
            return NextResponse.json({ error: "No poster URL provided" }, { status: 400 })
        }

        // 1. Check if it's a Cloudinary URL
        if (posterUrl.includes("res.cloudinary.com")) {
            try {
                // Determine Public ID
                // .../optimus_results/filename.png
                const parts = posterUrl.split("/")
                const filenameWithExt = parts.pop()
                const folder = parts.pop()

                const publicId = (folder && !folder.startsWith('v'))
                    ? `${folder}/${filenameWithExt?.split('.')[0]}`
                    : filenameWithExt?.split('.')[0]

                if (publicId) {
                    await cloudinary.uploader.destroy(publicId)
                }
                return NextResponse.json({ success: true, message: "Poster deleted from Cloudinary" })
            } catch (error) {
                console.error("Cloudinary deletion error:", error)
                return NextResponse.json({ error: "Cloudinary delete failed" }, { status: 500 })
            }
        }

        // 2. Fallback: Try local filesystem (for legacy images)
        if (posterUrl.startsWith("/")) {
            try {
                const filepath = join(process.cwd(), "public", posterUrl)
                if (existsSync(filepath)) {
                    await unlink(filepath)
                }
                return NextResponse.json({ success: true, message: "Local poster deleted" })
            } catch (err) {
                console.error("Local file delete error", err)
                // Start clean, end clean
                return NextResponse.json({ success: true, message: "Local file not found or already deleted" })
            }
        }

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error("Delete error:", error)
        return NextResponse.json({ error: "Delete failed" }, { status: 500 })
    }
}

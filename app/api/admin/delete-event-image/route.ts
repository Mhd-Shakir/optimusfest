import { NextRequest, NextResponse } from "next/server"
import { unlink } from "fs/promises"
import { join } from "path"
import { removeEventImage } from "@/lib/events-storage"

export async function DELETE(request: NextRequest) {
    try {
        const { eventId, imageUrl } = await request.json()

        if (!imageUrl) {
            return NextResponse.json({ error: "No image URL provided" }, { status: 400 })
        }

        // Extract filename from URL
        const filename = imageUrl.split("/").pop()
        if (!filename) {
            return NextResponse.json({ error: "Invalid image URL" }, { status: 400 })
        }

        // Delete file from filesystem
        const filepath = join(process.cwd(), "public", "uploads", "events", filename)

        try {
            await unlink(filepath)
        } catch (error) {
            console.error("File deletion error:", error)
            // Continue even if file doesn't exist
        }

        // Update the events data file
        await removeEventImage(eventId, imageUrl)

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Delete error:", error)
        return NextResponse.json({ error: "Delete failed" }, { status: 500 })
    }
}

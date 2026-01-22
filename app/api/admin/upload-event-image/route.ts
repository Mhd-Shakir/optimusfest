import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"
import { updateEventImages } from "@/lib/events-storage"

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get("file") as File
        const eventId = formData.get("eventId") as string

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 })
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Create uploads directory if it doesn't exist
        const uploadsDir = join(process.cwd(), "public", "uploads", "events")
        if (!existsSync(uploadsDir)) {
            await mkdir(uploadsDir, { recursive: true })
        }

        // Generate unique filename
        const timestamp = Date.now()
        const filename = `${eventId}-${timestamp}-${file.name.replace(/\s/g, "-")}`
        const filepath = join(uploadsDir, filename)

        // Save file
        await writeFile(filepath, buffer)

        // Return the public URL
        const imageUrl = `/uploads/events/${filename}`

        // Update the events data file
        await updateEventImages(eventId, imageUrl)

        return NextResponse.json({ imageUrl, success: true })
    } catch (error) {
        console.error("Upload error:", error)
        return NextResponse.json({ error: "Upload failed" }, { status: 500 })
    }
}

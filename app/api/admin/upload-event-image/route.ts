import { NextRequest, NextResponse } from "next/server"
import { updateEventImages } from "@/lib/events-storage"
import cloudinary from "@/lib/cloudinary"

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
        const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`

        const result = await cloudinary.uploader.upload(base64Image, {
            folder: "optimus_events",
        })

        const imageUrl = result.secure_url

        // Update the events data file (DB)
        await updateEventImages(eventId, imageUrl)

        return NextResponse.json({ imageUrl, success: true })
    } catch (error: any) {
        console.error("Upload error:", error)
        return NextResponse.json({
            error: "Upload failed",
            message: error.message || "Unknown error",
            details: error
        }, { status: 500 })
    }
}

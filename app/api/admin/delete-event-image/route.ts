import { NextRequest, NextResponse } from "next/server"
import { removeEventImage } from "@/lib/events-storage"
import cloudinary from "@/lib/cloudinary"

export async function DELETE(request: NextRequest) {
    try {
        const { eventId, imageUrl } = await request.json()

        if (!imageUrl) {
            return NextResponse.json({ error: "No image URL provided" }, { status: 400 })
        }

        // Try to delete from Cloudinary if it's a Cloudinary URL
        if (imageUrl.includes("res.cloudinary.com")) {
            try {
                // Extract public ID from URL
                // URL format: https://res.cloudinary.com/cloud_name/image/upload/v12345/folder/filename.jpg
                // We want: folder/filename (without extension)
                const parts = imageUrl.split("/")
                const filenameWithExt = parts.pop()
                const folder = parts.pop() // e.g., 'optimus_events' or 'v12345' (if versioned)

                // If the folder is a version number (starts with 'v'), look back one more
                const publicId = (folder && !folder.startsWith('v'))
                    ? `${folder}/${filenameWithExt?.split('.')[0]}`
                    : filenameWithExt?.split('.')[0]

                if (publicId) {
                    await cloudinary.uploader.destroy(publicId)
                }
            } catch (error) {
                console.error("Cloudinary deletion error:", error)
                // Continue with DB deletion even if cloud deletion fails
            }
        }

        // Update the events data file
        await removeEventImage(eventId, imageUrl)

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Delete error:", error)
        return NextResponse.json({ error: "Delete failed" }, { status: 500 })
    }
}

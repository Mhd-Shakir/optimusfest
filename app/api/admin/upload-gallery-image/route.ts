import { NextRequest, NextResponse } from "next/server"
import cloudinary from "@/lib/cloudinary"

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get("file") as File

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 })
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Upload to Cloudinary
        const result = await new Promise<any>((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: "optimus_gallery",
                },
                (error: any, result: any) => {
                    if (error) reject(error)
                    else resolve(result)
                }
            ).end(buffer)
        })

        return NextResponse.json({ imageUrl: result.secure_url, success: true })
    } catch (error) {
        console.error("Upload error:", error)
        return NextResponse.json({ error: error instanceof Error ? error.message : "Upload failed" }, { status: 500 })
    }
}
import { NextRequest, NextResponse } from "next/server"
import cloudinary from "@/lib/cloudinary"

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get("file") as File
        const resultId = formData.get("resultId") as string

        if (!file || !resultId) {
            return NextResponse.json(
                { error: "Missing file or result ID" },
                { status: 400 }
            )
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Upload to Cloudinary
        const result = await new Promise<any>((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: "optimus_results",
                },
                (error: any, result: any) => {
                    if (error) reject(error)
                    else resolve(result)
                }
            ).end(buffer)
        })

        const posterUrl = result.secure_url

        return NextResponse.json({ posterUrl, success: true })
    } catch (error) {
        console.error("Poster save error:", error)
        return NextResponse.json(
            { error: "Failed to save poster" },
            { status: 500 }
        )
    }
}

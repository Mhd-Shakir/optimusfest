import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get("file") as File

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 })
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const uploadsDir = join(process.cwd(), "public", "uploads", "gallery")
        if (!existsSync(uploadsDir)) {
            await mkdir(uploadsDir, { recursive: true })
        }

        const timestamp = Date.now()
        const filename = `gallery-${timestamp}-${file.name.replace(/\s/g, "-")}`
        const filepath = join(uploadsDir, filename)

        await writeFile(filepath, buffer)

        const imageUrl = `/uploads/gallery/${filename}`

        return NextResponse.json({ imageUrl, success: true })
    } catch (error) {
        console.error("Upload error:", error)
        return NextResponse.json({ error: "Upload failed" }, { status: 500 })
    }
}

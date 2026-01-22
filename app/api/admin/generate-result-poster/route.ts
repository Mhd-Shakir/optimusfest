import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

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

        // Create directory if it doesn't exist
        const postersDir = join(process.cwd(), "public", "result-posters")
        if (!existsSync(postersDir)) {
            await mkdir(postersDir, { recursive: true })
        }

        // Generate filename
        const filename = `result-${resultId}-${Date.now()}.png`
        const filepath = join(postersDir, filename)

        // Save file
        await writeFile(filepath, buffer)

        // Return poster URL
        const posterUrl = `/result-posters/${filename}`

        return NextResponse.json({ posterUrl, success: true })
    } catch (error) {
        console.error("Poster save error:", error)
        return NextResponse.json(
            { error: "Failed to save poster" },
            { status: 500 }
        )
    }
}

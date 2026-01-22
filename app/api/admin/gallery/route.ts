import { NextRequest, NextResponse } from "next/server"
import { getGalleryData, addGalleryImage } from "@/lib/gallery-storage"

export async function GET() {
    try {
        const gallery = await getGalleryData()
        return NextResponse.json(gallery)
    } catch (error) {
        console.error("Error fetching gallery:", error)
        return NextResponse.json([], { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const newImage = await addGalleryImage(body.image)
        return NextResponse.json(newImage, { status: 201 })
    } catch (error) {
        console.error("Error adding image:", error)
        return NextResponse.json({ error: "Failed to add image" }, { status: 500 })
    }
}

export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server"
import { getGalleryData } from "@/lib/gallery-storage"

export async function GET() {
    try {
        const gallery = await getGalleryData()
        return NextResponse.json(gallery)
    } catch (error) {
        console.error("Error fetching gallery:", error)
        return NextResponse.json([], { status: 500 })
    }
}

export const dynamic = 'force-dynamic'

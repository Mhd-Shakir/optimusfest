import { NextRequest, NextResponse } from "next/server"
import { deleteGalleryImage } from "@/lib/gallery-storage"

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        await deleteGalleryImage(id)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting image:", error)
        return NextResponse.json({ error: "Failed to delete image" }, { status: 500 })
    }
}

export const dynamic = 'force-dynamic'

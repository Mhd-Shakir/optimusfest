import { NextRequest, NextResponse } from "next/server"
import { updateNewsArticle, deleteNewsArticle } from "@/lib/news-storage"

// PUT update article
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()
        await updateNewsArticle(id, body)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error updating article:", error)
        return NextResponse.json({ error: "Failed to update article" }, { status: 500 })
    }
}

// DELETE article
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        await deleteNewsArticle(id)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting article:", error)
        return NextResponse.json({ error: "Failed to delete article" }, { status: 500 })
    }
}

export const dynamic = 'force-dynamic'

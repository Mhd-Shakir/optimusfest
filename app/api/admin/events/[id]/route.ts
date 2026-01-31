import { NextRequest, NextResponse } from "next/server"
import { deleteEvent } from "@/lib/events-storage"

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        await deleteEvent(id)
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete event" }, { status: 500 })
    }
}

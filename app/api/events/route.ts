import { NextResponse } from "next/server"
import { getEventsData } from "@/lib/events-storage"

export async function GET() {
    try {
        const events = await getEventsData()
        return NextResponse.json(events)
    } catch (error) {
        console.error("Error fetching events:", error)
        return NextResponse.json([], { status: 500 })
    }
}

// Enable dynamic rendering
export const dynamic = 'force-dynamic'

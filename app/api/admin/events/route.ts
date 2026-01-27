import { NextRequest, NextResponse } from "next/server"
import { getEventsData, createEvent } from "@/lib/events-storage"

export async function GET() {
    try {
        const events = await getEventsData()
        return NextResponse.json(events)
    } catch (error) {
        return NextResponse.json([], { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const newEvent = await createEvent(body)
        return NextResponse.json(newEvent, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
    }
}

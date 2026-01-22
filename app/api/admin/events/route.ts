import { NextRequest, NextResponse } from "next/server"
import { getEventsData } from "@/lib/events-storage"

export async function GET() {
    const events = await getEventsData()
    return NextResponse.json(events)
}

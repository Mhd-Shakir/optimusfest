import { NextRequest, NextResponse } from "next/server"
import { getResultsData, addResult, updateResult, deleteResult } from "@/lib/results-storage"

export async function GET() {
    try {
        const results = await getResultsData()
        return NextResponse.json(results)
    } catch (error) {
        console.error("Error fetching results:", error)
        return NextResponse.json({ error: "Failed to fetch results" }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { event, category, winners, poster, posters } = body

        if (!event || !category || !winners || !Array.isArray(winners)) {
            return NextResponse.json(
                { error: "Missing required fields: event, category, winners (array)" },
                { status: 400 }
            )
        }

        const newResult = await addResult({ event, category, winners, poster, posters })
        return NextResponse.json(newResult, { status: 201 })
    } catch (error) {
        console.error("Error creating result:", error)
        return NextResponse.json({ error: "Failed to create result" }, { status: 500 })
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { id, ...updates } = body

        if (!id) {
            return NextResponse.json({ error: "Missing result ID" }, { status: 400 })
        }

        await updateResult(id, updates)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error updating result:", error)
        return NextResponse.json({ error: "Failed to update result" }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get("id")

        if (!id) {
            return NextResponse.json({ error: "Missing result ID" }, { status: 400 })
        }

        await deleteResult(id)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting result:", error)
        return NextResponse.json({ error: "Failed to delete result" }, { status: 500 })
    }
}

export const dynamic = 'force-dynamic'

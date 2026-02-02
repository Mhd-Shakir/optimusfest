import { NextResponse } from "next/server"
import { getResultsData, getResultsByCategory, getResultsByEvent, searchResults } from "@/lib/results-storage"

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const category = searchParams.get("category")
        const event = searchParams.get("event")
        const search = searchParams.get("search")

        let results

        if (search) {
            results = await searchResults(search, category || undefined)
        } else if (category) {
            results = await getResultsByCategory(category)
        } else if (event) {
            results = await getResultsByEvent(event)
        } else {
            results = await getResultsData()
        }

        return NextResponse.json(results)
    } catch (error) {
        console.error("Error fetching results:", error)
        return NextResponse.json({ error: "Failed to fetch results" }, { status: 500 })
    }
}

export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server"
import { getPublishedNews } from "@/lib/news-storage"

export async function GET() {
    try {
        const news = await getPublishedNews()
        return NextResponse.json(news)
    } catch (error) {
        console.error("Error fetching news:", error)
        return NextResponse.json([], { status: 500 })
    }
}

// Enable dynamic rendering
export const dynamic = 'force-dynamic'

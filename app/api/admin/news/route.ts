import { NextRequest, NextResponse } from "next/server"
import { getNewsData, addNewsArticle, updateNewsArticle, deleteNewsArticle } from "@/lib/news-storage"

// GET all news (including drafts for admin)
export async function GET() {
    try {
        const news = await getNewsData()
        return NextResponse.json(news)
    } catch (error) {
        console.error("Error fetching news:", error)
        return NextResponse.json([], { status: 500 })
    }
}

// POST create new article
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const newArticle = await addNewsArticle(body)
        return NextResponse.json(newArticle, { status: 201 })
    } catch (error) {
        console.error("Error creating article:", error)
        return NextResponse.json({ error: "Failed to create article" }, { status: 500 })
    }
}

export const dynamic = 'force-dynamic'

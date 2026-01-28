import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import TeamPoint from "@/lib/models/TeamPoint"

export async function POST(request: Request) {
    try {
        const { teamName, points } = await request.json()

        if (!teamName || points === undefined) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        await dbConnect()

        const updatedPoint = await TeamPoint.findOneAndUpdate(
            { teamName },
            { points: Number(points) },
            { upsert: true, new: true }
        )

        return NextResponse.json(updatedPoint)
    } catch (error) {
        console.error("Points update error:", error)
        return NextResponse.json({ error: "Failed to update points" }, { status: 500 })
    }
}

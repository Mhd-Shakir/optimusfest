import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import TeamPoint from "@/lib/models/TeamPoint"

export async function GET() {
    try {
        await dbConnect()
        const points = await TeamPoint.find({})

        // Ensure both teams exist in the response
        const teamNames = ["Auris", "Libras"]
        const result = teamNames.map(name => {
            const team = points.find(p => p.teamName === name)
            return {
                teamName: name,
                points: team ? team.points : 0
            }
        })

        return NextResponse.json(result)
    } catch (error) {
        console.error("Points fetch error:", error)
        return NextResponse.json({ error: "Failed to fetch points" }, { status: 500 })
    }
}

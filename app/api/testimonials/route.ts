import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Testimonial from "@/lib/models/Testimonial"

export async function GET() {
    try {
        await dbConnect()
        const testimonials = await Testimonial.find({}).sort({ createdAt: -1 })
        return NextResponse.json(testimonials)
    } catch (error) {
        console.error("Testimonials fetch error:", error)
        return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 })
    }
}

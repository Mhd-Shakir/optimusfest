import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Testimonial from "@/lib/models/Testimonial"

export async function GET() {
    try {
        await dbConnect()
        const testimonials = await Testimonial.find({}).sort({ createdAt: -1 })
        return NextResponse.json(testimonials)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        await dbConnect()
        const testimonial = await Testimonial.create(body)
        return NextResponse.json(testimonial)
    } catch (error) {
        return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 })
    }
}

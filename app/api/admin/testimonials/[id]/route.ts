import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Testimonial from "@/lib/models/Testimonial"

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()
        await dbConnect()
        const testimonial = await Testimonial.findByIdAndUpdate(id, body, { new: true })
        if (!testimonial) {
            return NextResponse.json({ error: "Testimonial not found" }, { status: 404 })
        }
        return NextResponse.json(testimonial)
    } catch (error) {
        return NextResponse.json({ error: "Failed to update testimonial" }, { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        await dbConnect()
        const testimonial = await Testimonial.findByIdAndDelete(id)
        if (!testimonial) {
            return NextResponse.json({ error: "Testimonial not found" }, { status: 404 })
        }
        return NextResponse.json({ message: "Testimonial deleted" })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 })
    }
}

import mongoose, { Schema, Document } from "mongoose"

export interface ITestimonial extends Document {
    name: string
    role: string
    content: string
    image?: string
    createdAt: Date
    updatedAt: Date
}

const TestimonialSchema = new Schema<ITestimonial>(
    {
        name: { type: String, required: true },
        role: { type: String, required: true },
        content: { type: String, required: true },
        image: { type: String },
    },
    { timestamps: true }
)

const Testimonial = mongoose.models.Testimonial || mongoose.model<ITestimonial>("Testimonial", TestimonialSchema)

export default Testimonial

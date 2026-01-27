import mongoose, { Schema, Document } from "mongoose"

export interface IEvent extends Document {
    title: string
    category: string
    date: string
    time: string
    venue: string
    description: string
    images: string[]
    createdAt: Date
    updatedAt: Date
}

const EventSchema = new Schema<IEvent>(
    {
        title: { type: String, required: true },
        category: { type: String, required: true },
        date: { type: String, required: true },
        time: { type: String, required: true },
        venue: { type: String, required: true },
        description: { type: String, required: true },
        images: { type: [String], default: [] },
    },
    { timestamps: true }
)

const Event = mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema)

export default Event

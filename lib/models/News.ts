import mongoose, { Schema, Document } from "mongoose"

export interface INews extends Document {
    title: string
    excerpt: string
    content: string
    author: string
    date: string
    category: string
    image?: string
    published: boolean
    createdAt: Date
    updatedAt: Date
}

const NewsSchema = new Schema<INews>(
    {
        title: { type: String, required: true },
        excerpt: { type: String, required: true },
        content: { type: String, required: true },
        author: { type: String, required: true },
        date: { type: String, required: true },
        category: { type: String, required: true },
        image: { type: String },
        published: { type: Boolean, default: false },
    },
    { timestamps: true }
)

const News = mongoose.models.News || mongoose.model<INews>("News", NewsSchema)

export default News

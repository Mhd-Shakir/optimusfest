import mongoose, { Schema, Document } from "mongoose"

export interface IResult extends Document {
    studentName: string
    event: string
    category: string
    rank: number
    score?: number
    poster?: string
    createdAt: Date
    updatedAt: Date
}

const ResultSchema = new Schema<IResult>(
    {
        studentName: { type: String, required: true },
        event: { type: String, required: true },
        category: { type: String, required: true },
        rank: { type: Number, required: true },
        score: { type: Number },
        poster: { type: String },
    },
    { timestamps: true }
)

const Result = mongoose.models.Result || mongoose.model<IResult>("Result", ResultSchema)

export default Result

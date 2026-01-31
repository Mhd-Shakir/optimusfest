import mongoose, { Schema, Document } from "mongoose"

export interface IResult extends Document {
    event: string
    category: string
    winners: {
        rank: number
        studentName: string
    }[]
    posters?: string[]
    poster?: string
    createdAt: Date
    updatedAt: Date
}

const ResultSchema = new Schema<IResult>(
    {
        event: { type: String, required: true },
        category: { type: String, required: true },
        winners: [
            {
                rank: { type: Number, required: true },
                studentName: { type: String, required: true },
            }
        ],
        posters: { type: [String] },
        poster: { type: String },
    },
    { timestamps: true }
)

const Result = mongoose.models.Result || mongoose.model<IResult>("Result", ResultSchema)

export default Result

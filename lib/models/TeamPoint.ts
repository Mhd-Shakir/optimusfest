import mongoose, { Schema, Document } from "mongoose"

export interface ITeamPoint extends Document {
    teamName: string
    points: number
    updatedAt: Date
}

const TeamPointSchema = new Schema<ITeamPoint>(
    {
        teamName: { type: String, required: true, unique: true },
        points: { type: Number, default: 0 },
    },
    { timestamps: true }
)

const TeamPoint = mongoose.models.TeamPoint || mongoose.model<ITeamPoint>("TeamPoint", TeamPointSchema)

export default TeamPoint

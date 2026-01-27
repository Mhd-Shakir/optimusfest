import mongoose, { Schema, Document } from "mongoose"

export interface IGallery extends Document {
    image: string
    createdAt: Date
    updatedAt: Date
}

const GallerySchema = new Schema<IGallery>(
    {
        image: { type: String, required: true },
    },
    { timestamps: true }
)

const Gallery = mongoose.models.Gallery || mongoose.model<IGallery>("Gallery", GallerySchema)

export default Gallery

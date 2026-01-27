import dbConnect from "@/lib/mongodb"
import Gallery, { IGallery } from "@/lib/models/Gallery"

export interface GalleryImage {
    _id: string
    image: string
}

function mapDocumentToGallery(doc: IGallery): GalleryImage {
    return {
        _id: doc._id.toString(),
        image: doc.image,
    }
}

export async function getGalleryData(): Promise<GalleryImage[]> {
    try {
        await dbConnect()
        const gallery = await Gallery.find({}).sort({ createdAt: -1 })
        return gallery.map(mapDocumentToGallery)
    } catch (error) {
        console.error("Error fetching gallery from DB:", error)
        return []
    }
}

export async function addGalleryImage(imageUrl: string): Promise<GalleryImage> {
    try {
        await dbConnect()
        const newImage = await Gallery.create({ image: imageUrl })
        return mapDocumentToGallery(newImage)
    } catch (error) {
        console.error("Error adding gallery image to DB:", error)
        throw error
    }
}

export async function deleteGalleryImage(id: string): Promise<void> {
    try {
        await dbConnect()
        await Gallery.findByIdAndDelete(id)
    } catch (error) {
        console.error("Error deleting gallery image from DB:", error)
        throw error
    }
}


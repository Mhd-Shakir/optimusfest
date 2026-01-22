import { readFile, writeFile } from "fs/promises"
import { join } from "path"

const GALLERY_FILE = join(process.cwd(), "lib", "gallery-data.json")

export interface GalleryImage {
    _id: string
    image: string
}

export async function getGalleryData(): Promise<GalleryImage[]> {
    try {
        const data = await readFile(GALLERY_FILE, "utf-8")
        return JSON.parse(data)
    } catch (error) {
        console.error("Error reading gallery data:", error)
        return []
    }
}

export async function addGalleryImage(imageUrl: string): Promise<GalleryImage> {
    try {
        const gallery = await getGalleryData()
        const newImage: GalleryImage = {
            _id: Date.now().toString(),
            image: imageUrl,
        }
        gallery.push(newImage)
        await writeFile(GALLERY_FILE, JSON.stringify(gallery, null, 2))
        return newImage
    } catch (error) {
        console.error("Error adding gallery image:", error)
        throw error
    }
}

export async function deleteGalleryImage(id: string): Promise<void> {
    try {
        const gallery = await getGalleryData()
        const filteredGallery = gallery.filter((img) => img._id !== id)
        await writeFile(GALLERY_FILE, JSON.stringify(filteredGallery, null, 2))
    } catch (error) {
        console.error("Error deleting gallery image:", error)
        throw error
    }
}

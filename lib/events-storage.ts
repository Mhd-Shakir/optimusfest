import { readFile, writeFile } from "fs/promises"
import { join } from "path"

const EVENTS_FILE = join(process.cwd(), "lib", "events-data.json")

export interface EventData {
    _id: string
    title: string
    category: string
    date: string
    time: string
    venue: string
    description: string
    images: string[]
}

export async function getEventsData(): Promise<EventData[]> {
    try {
        const data = await readFile(EVENTS_FILE, "utf-8")
        return JSON.parse(data)
    } catch (error) {
        console.error("Error reading events data:", error)
        return []
    }
}

export async function updateEventImages(eventId: string, imageUrl: string): Promise<void> {
    try {
        const events = await getEventsData()
        const updatedEvents = events.map((event) =>
            event._id === eventId ? { ...event, images: [...event.images, imageUrl] } : event
        )
        await writeFile(EVENTS_FILE, JSON.stringify(updatedEvents, null, 2))
    } catch (error) {
        console.error("Error updating event images:", error)
        throw error
    }
}

export async function removeEventImage(eventId: string, imageUrl: string): Promise<void> {
    try {
        const events = await getEventsData()
        const updatedEvents = events.map((event) =>
            event._id === eventId ? { ...event, images: event.images.filter((img) => img !== imageUrl) } : event
        )
        await writeFile(EVENTS_FILE, JSON.stringify(updatedEvents, null, 2))
    } catch (error) {
        console.error("Error removing event image:", error)
        throw error
    }
}

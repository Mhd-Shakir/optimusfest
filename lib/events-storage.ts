import dbConnect from "@/lib/mongodb"
import Event, { IEvent } from "@/lib/models/Event"

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

function mapDocumentToEvent(doc: IEvent): EventData {
    return {
        _id: doc._id.toString(),
        title: doc.title,
        category: doc.category,
        date: doc.date,
        time: doc.time,
        venue: doc.venue,
        description: doc.description,
        images: doc.images,
    }
}

export async function getEventsData(): Promise<EventData[]> {
    try {
        await dbConnect()
        const events = await Event.find({}).sort({ date: 1 })
        return events.map(mapDocumentToEvent)
    } catch (error) {
        console.error("Error fetching events from DB:", error)
        return []
    }
}

export async function updateEventImages(eventId: string, imageUrl: string): Promise<void> {
    try {
        await dbConnect()
        await Event.findByIdAndUpdate(eventId, { $push: { images: imageUrl } })
    } catch (error) {
        console.error("Error updating event images in DB:", error)
        throw error
    }
}

export async function removeEventImage(eventId: string, imageUrl: string): Promise<void> {
    try {
        await dbConnect()
        await Event.findByIdAndUpdate(eventId, { $pull: { images: imageUrl } })
    } catch (error) {
        console.error("Error removing event image in DB:", error)
        throw error
    }
}


export interface CreateEventInput {
    title: string
    category: string
    date: string
    time: string
    venue: string
    description: string
}

export async function createEvent(data: CreateEventInput): Promise<EventData> {
    try {
        await dbConnect()
        const newEvent = await Event.create({ ...data, images: [] })
        return mapDocumentToEvent(newEvent)
    } catch (error) {
        console.error("Error creating event in DB:", error)
        throw error
    }
}

export async function deleteEvent(id: string): Promise<void> {
    try {
        await dbConnect()
        await Event.findByIdAndDelete(id)
    } catch (error) {
        console.error("Error deleting event from DB:", error)
        throw error
    }
}

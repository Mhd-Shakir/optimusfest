import dbConnect from "@/lib/mongodb"
import Result, { IResult } from "@/lib/models/Result"

export interface ResultData {
    _id: string
    event: string
    category: string
    winners: {
        rank: number
        studentName: string
    }[]
    posters?: string[]
    poster?: string
    createdAt: string
    updatedAt: string
}

function mapDocumentToResult(doc: IResult): ResultData {
    return {
        _id: doc._id.toString(),
        event: doc.event,
        category: doc.category,
        winners: (doc.winners || []).map((w: any) => ({
            rank: w.rank,
            studentName: w.studentName
        })),
        posters: doc.posters || [],
        poster: doc.poster,
        createdAt: doc.createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: doc.updatedAt?.toISOString() || new Date().toISOString(),
    }
}

export async function getResultsData(): Promise<ResultData[]> {
    try {
        await dbConnect()
        const results = await Result.find({}).sort({ createdAt: -1 })
        return results.map(mapDocumentToResult)
    } catch (error) {
        console.error("Error fetching results from DB:", error)
        return []
    }
}

export async function addResult(result: Omit<ResultData, "_id" | "createdAt" | "updatedAt">): Promise<ResultData> {
    try {
        await dbConnect()
        const newResult = await Result.create(result)
        return mapDocumentToResult(newResult)
    } catch (error) {
        console.error("Error adding result to DB:", error)
        throw error
    }
}

export async function updateResult(
    id: string,
    updates: Partial<Omit<ResultData, "_id" | "createdAt">>
): Promise<void> {
    try {
        await dbConnect()
        await Result.findByIdAndUpdate(id, updates)
    } catch (error) {
        console.error("Error updating result in DB:", error)
        throw error
    }
}

export async function deleteResult(id: string): Promise<void> {
    try {
        await dbConnect()
        await Result.findByIdAndDelete(id)
    } catch (error) {
        console.error("Error deleting result from DB:", error)
        throw error
    }
}

export async function getResultsByCategory(category: string): Promise<ResultData[]> {
    try {
        await dbConnect()
        const results = await Result.find({ category: { $regex: new RegExp(`^${category}$`, "i") } }).sort({ createdAt: -1 })
        return results.map(mapDocumentToResult)
    } catch (error) {
        console.error("Error fetching results by category from DB:", error)
        return []
    }
}

export async function getResultsByEvent(event: string): Promise<ResultData[]> {
    try {
        await dbConnect()
        const results = await Result.find({ event: { $regex: new RegExp(`^${event}$`, "i") } }).sort({ createdAt: -1 })
        return results.map(mapDocumentToResult)
    } catch (error) {
        console.error("Error fetching results by event from DB:", error)
        return []
    }
}

export async function searchResults(query: string): Promise<ResultData[]> {
    try {
        await dbConnect()
        const regex = new RegExp(query, "i")
        const results = await Result.find({
            $or: [
                { event: regex },
                { category: regex },
                { "winners.studentName": regex }
            ],
        }).sort({ createdAt: -1 })
        return results.map(mapDocumentToResult)
    } catch (error) {
        console.error("Error searching results in DB:", error)
        return []
    }
}

export async function updateResultPoster(id: string, posterUrl: string): Promise<void> {
    try {
        await dbConnect()
        await Result.findByIdAndUpdate(id, { poster: posterUrl })
    } catch (error) {
        console.error("Error updating result poster in DB:", error)
        throw error
    }
}

export async function removeResultPoster(id: string): Promise<void> {
    try {
        await dbConnect()
        await Result.findByIdAndUpdate(id, { $unset: { poster: 1 } })
    } catch (error) {
        console.error("Error removing result poster in DB:", error)
        throw error
    }
}

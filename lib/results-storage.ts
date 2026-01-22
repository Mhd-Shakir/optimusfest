import { readFile, writeFile } from "fs/promises"
import { join } from "path"

const RESULTS_FILE = join(process.cwd(), "lib", "results-data.json")

export interface ResultData {
    _id: string
    studentName: string
    event: string
    category: string
    rank: number
    score?: number
    poster?: string
    createdAt: string
    updatedAt: string
}

export async function getResultsData(): Promise<ResultData[]> {
    try {
        const data = await readFile(RESULTS_FILE, "utf-8")
        return JSON.parse(data)
    } catch (error) {
        console.error("Error reading results data:", error)
        return []
    }
}

export async function addResult(result: Omit<ResultData, "_id" | "createdAt" | "updatedAt">): Promise<ResultData> {
    try {
        const results = await getResultsData()
        const newResult: ResultData = {
            ...result,
            _id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
        results.push(newResult)
        await writeFile(RESULTS_FILE, JSON.stringify(results, null, 2))
        return newResult
    } catch (error) {
        console.error("Error adding result:", error)
        throw error
    }
}

export async function updateResult(id: string, updates: Partial<Omit<ResultData, "_id" | "createdAt">>): Promise<void> {
    try {
        const results = await getResultsData()
        const updatedResults = results.map((result) =>
            result._id === id
                ? { ...result, ...updates, updatedAt: new Date().toISOString() }
                : result
        )
        await writeFile(RESULTS_FILE, JSON.stringify(updatedResults, null, 2))
    } catch (error) {
        console.error("Error updating result:", error)
        throw error
    }
}

export async function deleteResult(id: string): Promise<void> {
    try {
        const results = await getResultsData()
        const updatedResults = results.filter((result) => result._id !== id)
        await writeFile(RESULTS_FILE, JSON.stringify(updatedResults, null, 2))
    } catch (error) {
        console.error("Error deleting result:", error)
        throw error
    }
}

export async function getResultsByCategory(category: string): Promise<ResultData[]> {
    try {
        const results = await getResultsData()
        return results.filter((result) => result.category.toLowerCase() === category.toLowerCase())
    } catch (error) {
        console.error("Error filtering results by category:", error)
        return []
    }
}

export async function getResultsByEvent(event: string): Promise<ResultData[]> {
    try {
        const results = await getResultsData()
        return results.filter((result) => result.event.toLowerCase() === event.toLowerCase())
    } catch (error) {
        console.error("Error filtering results by event:", error)
        return []
    }
}

export async function searchResults(query: string): Promise<ResultData[]> {
    try {
        const results = await getResultsData()
        const lowerQuery = query.toLowerCase()
        return results.filter(
            (result) =>
                result.studentName.toLowerCase().includes(lowerQuery) ||
                result.event.toLowerCase().includes(lowerQuery) ||
                result.category.toLowerCase().includes(lowerQuery)
        )
    } catch (error) {
        console.error("Error searching results:", error)
        return []
    }
}

export async function updateResultPoster(id: string, posterUrl: string): Promise<void> {
    try {
        const results = await getResultsData()
        const updatedResults = results.map((result) =>
            result._id === id
                ? { ...result, poster: posterUrl, updatedAt: new Date().toISOString() }
                : result
        )
        await writeFile(RESULTS_FILE, JSON.stringify(updatedResults, null, 2))
    } catch (error) {
        console.error("Error updating result poster:", error)
        throw error
    }
}

export async function removeResultPoster(id: string): Promise<void> {
    try {
        const results = await getResultsData()
        const updatedResults = results.map((result) =>
            result._id === id
                ? { ...result, poster: undefined, updatedAt: new Date().toISOString() }
                : result
        )
        await writeFile(RESULTS_FILE, JSON.stringify(updatedResults, null, 2))
    } catch (error) {
        console.error("Error removing result poster:", error)
        throw error
    }
}

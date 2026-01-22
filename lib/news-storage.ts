import { readFile, writeFile } from "fs/promises"
import { join } from "path"

const NEWS_FILE = join(process.cwd(), "lib", "news-data.json")

export interface NewsArticle {
    _id: string
    title: string
    excerpt: string
    content: string
    author: string
    date: string
    category: string
    image?: string
    published: boolean
}

export async function getNewsData(): Promise<NewsArticle[]> {
    try {
        const data = await readFile(NEWS_FILE, "utf-8")
        return JSON.parse(data)
    } catch (error) {
        console.error("Error reading news data:", error)
        return []
    }
}

export async function getPublishedNews(): Promise<NewsArticle[]> {
    try {
        const allNews = await getNewsData()
        return allNews.filter((article) => article.published).sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        )
    } catch (error) {
        console.error("Error reading published news:", error)
        return []
    }
}

export async function addNewsArticle(article: Omit<NewsArticle, "_id">): Promise<NewsArticle> {
    try {
        const news = await getNewsData()
        const newArticle: NewsArticle = {
            ...article,
            _id: Date.now().toString(),
        }
        news.push(newArticle)
        await writeFile(NEWS_FILE, JSON.stringify(news, null, 2))
        return newArticle
    } catch (error) {
        console.error("Error adding news article:", error)
        throw error
    }
}

export async function updateNewsArticle(id: string, updates: Partial<NewsArticle>): Promise<void> {
    try {
        const news = await getNewsData()
        const updatedNews = news.map((article) =>
            article._id === id ? { ...article, ...updates } : article
        )
        await writeFile(NEWS_FILE, JSON.stringify(updatedNews, null, 2))
    } catch (error) {
        console.error("Error updating news article:", error)
        throw error
    }
}

export async function deleteNewsArticle(id: string): Promise<void> {
    try {
        const news = await getNewsData()
        const filteredNews = news.filter((article) => article._id !== id)
        await writeFile(NEWS_FILE, JSON.stringify(filteredNews, null, 2))
    } catch (error) {
        console.error("Error deleting news article:", error)
        throw error
    }
}

export async function updateNewsImage(id: string, imageUrl: string): Promise<void> {
    try {
        await updateNewsArticle(id, { image: imageUrl })
    } catch (error) {
        console.error("Error updating news image:", error)
        throw error
    }
}

import dbConnect from "@/lib/mongodb"
import News, { INews } from "@/lib/models/News"

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

function mapDocumentToNews(doc: INews): NewsArticle {
    return {
        _id: doc._id.toString(),
        title: doc.title,
        excerpt: doc.excerpt,
        content: doc.content,
        author: doc.author,
        date: doc.date,
        category: doc.category,
        image: doc.image,
        published: doc.published,
    }
}

export async function getNewsData(): Promise<NewsArticle[]> {
    try {
        await dbConnect()
        const news = await News.find({}).sort({ date: -1 })
        return news.map(mapDocumentToNews)
    } catch (error) {
        console.error("Error fetching news from DB:", error)
        return []
    }
}

export async function getPublishedNews(): Promise<NewsArticle[]> {
    try {
        await dbConnect()
        const news = await News.find({ published: true }).sort({ date: -1 })
        return news.map(mapDocumentToNews)
    } catch (error) {
        console.error("Error fetching published news from DB:", error)
        return []
    }
}

export async function addNewsArticle(article: Omit<NewsArticle, "_id">): Promise<NewsArticle> {
    try {
        await dbConnect()
        const newArticle = await News.create(article)
        return mapDocumentToNews(newArticle)
    } catch (error) {
        console.error("Error adding news article to DB:", error)
        throw error
    }
}

export async function updateNewsArticle(id: string, updates: Partial<NewsArticle>): Promise<void> {
    try {
        await dbConnect()
        await News.findByIdAndUpdate(id, updates)
    } catch (error) {
        console.error("Error updating news article in DB:", error)
        throw error
    }
}

export async function deleteNewsArticle(id: string): Promise<void> {
    try {
        await dbConnect()
        await News.findByIdAndDelete(id)
    } catch (error) {
        console.error("Error deleting news article from DB:", error)
        throw error
    }
}

export async function updateNewsImage(id: string, imageUrl: string): Promise<void> {
    try {
        await dbConnect()
        await News.findByIdAndUpdate(id, { image: imageUrl })
    } catch (error) {
        console.error("Error updating news image in DB:", error)
        throw error
    }
}


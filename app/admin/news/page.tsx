"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2, ImagePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface NewsArticle {
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

export default function AdminNewsPage() {
    const [news, setNews] = useState<NewsArticle[]>([])
    const [loading, setLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null)
    const [uploading, setUploading] = useState(false)
    const { toast } = useToast()

    const [formData, setFormData] = useState({
        title: "",
        excerpt: "",
        content: "",
        author: "",
        category: "Announcement",
        image: "",
        published: true,
    })

    useEffect(() => {
        fetchNews()
    }, [])

    const fetchNews = async () => {
        try {
            const response = await fetch("/api/admin/news")
            const data = await response.json()
            setNews(data)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load news",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const url = editingArticle ? `/api/admin/news/${editingArticle._id}` : "/api/admin/news"
            const method = editingArticle ? "PUT" : "POST"

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    date: new Date().toISOString().split('T')[0],
                }),
            })

            if (!response.ok) throw new Error("Failed to save article")

            toast({
                title: "Success",
                description: `Article ${editingArticle ? "updated" : "created"} successfully`,
            })

            setIsDialogOpen(false)
            resetForm()
            fetchNews()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save article",
                variant: "destructive",
            })
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this article?")) return

        try {
            const response = await fetch(`/api/admin/news/${id}`, {
                method: "DELETE",
            })

            if (!response.ok) throw new Error("Failed to delete")

            toast({
                title: "Success",
                description: "Article deleted successfully",
            })

            fetchNews()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete article",
                variant: "destructive",
            })
        }
    }

    const handleTogglePublish = async (article: NewsArticle) => {
        try {
            const response = await fetch(`/api/admin/news/${article._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ published: !article.published }),
            })

            if (!response.ok) throw new Error("Failed to update")

            toast({
                title: "Success",
                description: `Article ${!article.published ? "published" : "unpublished"}`,
            })

            fetchNews()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update article",
                variant: "destructive",
            })
        }
    }

    const handleImageUpload = async (file: File) => {
        setUploading(true)
        const formData = new FormData()
        formData.append("file", file)

        try {
            const response = await fetch("/api/admin/upload-news-image", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) throw new Error("Upload failed")

            const data = await response.json()
            setFormData((prev) => ({ ...prev, image: data.imageUrl }))

            toast({
                title: "Success",
                description: "Image uploaded successfully",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to upload image",
                variant: "destructive",
            })
        } finally {
            setUploading(false)
        }
    }

    const handleEdit = (article: NewsArticle) => {
        setEditingArticle(article)
        setFormData({
            title: article.title,
            excerpt: article.excerpt,
            content: article.content,
            author: article.author,
            category: article.category,
            image: article.image || "",
            published: article.published,
        })
        setIsDialogOpen(true)
    }

    const resetForm = () => {
        setEditingArticle(null)
        setFormData({
            title: "",
            excerpt: "",
            content: "",
            author: "",
            category: "Announcement",
            image: "",
            published: true,
        })
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 py-12 px-4">
            <div className="container mx-auto max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 flex items-center justify-between"
                >
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-2">
                            <span className="gradient-text">News Management</span>
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Create and manage festival news articles
                        </p>
                    </div>

                    <Dialog open={isDialogOpen} onOpenChange={(open) => {
                        setIsDialogOpen(open)
                        if (!open) resetForm()
                    }}>
                        <DialogTrigger asChild>
                            <Button className="gap-2">
                                <Plus size={20} />
                                New Article
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border border-border bg-white shadow-2xl text-black">
                            <div className="relative z-10">
                                <DialogHeader>
                                    <DialogTitle>{editingArticle ? "Edit Article" : "Create New Article"}</DialogTitle>
                                    <DialogDescription>
                                        {editingArticle ? "Update the article details below" : "Fill in the details to create a new news article"}
                                    </DialogDescription>
                                </DialogHeader>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <Label htmlFor="title">Title *</Label>
                                        <Input
                                            id="title"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="excerpt">Excerpt *</Label>
                                        <Textarea
                                            id="excerpt"
                                            value={formData.excerpt}
                                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                            rows={2}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="content">Content *</Label>
                                        <Textarea
                                            id="content"
                                            value={formData.content}
                                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                            rows={6}
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <Label htmlFor="author">Author *</Label>
                                            <Input
                                                id="author"
                                                value={formData.author}
                                                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label>Cover Image</Label>
                                        {formData.image ? (
                                            <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                                                <Image src={formData.image} alt="Cover" fill className="object-cover" />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    className="absolute top-2 right-2"
                                                    onClick={() => setFormData({ ...formData, image: "" })}
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        ) : (
                                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-primary/30 rounded-lg cursor-pointer hover:border-primary/60 transition-colors bg-primary/5 hover:bg-primary/10">
                                                {uploading ? (
                                                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                                ) : (
                                                    <>
                                                        <ImagePlus className="w-8 h-8 text-primary mb-2" />
                                                        <p className="text-sm text-muted-foreground">Click to upload image</p>
                                                    </>
                                                )}
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0]
                                                        if (file) handleImageUpload(file)
                                                    }}
                                                    disabled={uploading}
                                                />
                                            </label>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="published"
                                            checked={formData.published}
                                            onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                                            className="w-4 h-4"
                                        />
                                        <Label htmlFor="published" className="cursor-pointer">Publish immediately</Label>
                                    </div>

                                    <div className="flex gap-2 pt-4">
                                        <Button type="submit" className="flex-1">
                                            {editingArticle ? "Update Article" : "Create Article"}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                setIsDialogOpen(false)
                                                resetForm()
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </DialogContent>
                    </Dialog>
                </motion.div>

                {/* News List */}
                <div className="grid gap-6">
                    {news.map((article, index) => (
                        <motion.div
                            key={article._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="glass border-accent/20">
                                <CardContent className="p-6">
                                    <div className="flex gap-6">
                                        {/* Image */}
                                        <div className="relative w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-accent/10 to-primary/10">
                                            {article.image ? (
                                                <Image src={article.image} alt={article.title} fill className="object-cover" />
                                            ) : (
                                                <div className="h-full flex items-center justify-center">
                                                    <ImagePlus className="w-8 h-8 text-muted-foreground opacity-30" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="px-2 py-1 text-xs font-semibold bg-accent/20 text-accent rounded-full">
                                                            {article.category}
                                                        </span>
                                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${article.published
                                                            ? "bg-green-500/20 text-green-500"
                                                            : "bg-yellow-500/20 text-yellow-500"
                                                            }`}>
                                                            {article.published ? "Published" : "Draft"}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-xl font-bold mb-1">{article.title}</h3>
                                                    <p className="text-sm text-muted-foreground mb-2">{article.excerpt}</p>
                                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                        <span>By {article.author}</span>
                                                        <span>•</span>
                                                        <span>{new Date(article.date).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleEdit(article)}
                                            >
                                                <Edit size={16} />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleTogglePublish(article)}
                                            >
                                                {article.published ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleDelete(article._id)}
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}

                    {news.length === 0 && (
                        <Card className="glass">
                            <CardContent className="p-12 text-center">
                                <p className="text-muted-foreground">No news articles yet. Create your first one!</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}

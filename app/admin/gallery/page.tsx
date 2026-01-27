"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Upload, Trash2, Loader2, ImagePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface GalleryImage {
    _id: string
    image: string
}

export default function AdminGalleryPage() {
    const [gallery, setGallery] = useState<GalleryImage[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const { toast } = useToast()

    useEffect(() => {
        fetchGallery()
    }, [])

    const fetchGallery = async () => {
        try {
            const response = await fetch("/api/admin/gallery")
            const data = await response.json()
            setGallery(data)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load gallery",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleImageUpload = async (files: FileList | null) => {
        if (!files || files.length === 0) return

        setUploading(true)

        try {
            // Upload all selected files
            const uploadPromises = Array.from(files).map(async (file) => {
                const formData = new FormData()
                formData.append("file", file)

                const response = await fetch("/api/admin/upload-gallery-image", {
                    method: "POST",
                    body: formData,
                })

                if (!response.ok) throw new Error("Upload failed")

                const data = await response.json()

                // Add to gallery
                await fetch("/api/admin/gallery", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ image: data.imageUrl }),
                })
            })

            await Promise.all(uploadPromises)

            toast({
                title: "Success",
                description: `${files.length} image(s) uploaded successfully`,
            })

            fetchGallery()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to upload images",
                variant: "destructive",
            })
        } finally {
            setUploading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this image?")) return

        try {
            const response = await fetch(`/api/admin/gallery/${id}`, {
                method: "DELETE",
            })

            if (!response.ok) throw new Error("Failed to delete")

            toast({
                title: "Success",
                description: "Image deleted successfully",
            })

            // Remove from selection if deleted
            setSelectedIds(prev => prev.filter(selectedId => selectedId !== id))
            fetchGallery()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete image",
                variant: "destructive",
            })
        }
    }

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return
        if (!confirm(`Are you sure you want to delete ${selectedIds.length} images?`)) return

        setLoading(true)

        try {
            const deletePromises = selectedIds.map(id =>
                fetch(`/api/admin/gallery/${id}`, { method: "DELETE" })
            )

            await Promise.all(deletePromises)

            toast({
                title: "Success",
                description: `${selectedIds.length} images deleted successfully`,
            })

            setSelectedIds([])
            fetchGallery()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete some images",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const toggleSelection = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        )
    }

    const handleSelectAll = () => {
        if (selectedIds.length === gallery.length) {
            setSelectedIds([])
        } else {
            setSelectedIds(gallery.map(img => img._id))
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12 px-4">
            <div className="container mx-auto max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-2">
                                <span className="gradient-text">Gallery Management</span>
                            </h1>
                            <p className="text-muted-foreground text-lg">
                                Upload and manage festival gallery images
                            </p>
                        </div>
                        {/* Bulk Actions */}
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={handleSelectAll}
                                disabled={gallery.length === 0}
                            >
                                {selectedIds.length === gallery.length ? "Deselect All" : "Select All"}
                            </Button>
                            {selectedIds.length > 0 && (
                                <Button
                                    variant="destructive"
                                    onClick={handleBulkDelete}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Selected ({selectedIds.length})
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Upload Area */}
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-primary/30 rounded-3xl cursor-pointer hover:border-primary/60 transition-all duration-300 bg-gradient-to-br from-primary/5 to-accent/5 hover:from-primary/10 hover:to-accent/10 group mb-8">
                        {uploading ? (
                            <div className="text-center">
                                <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-4" />
                                <p className="text-lg font-medium text-primary">Uploading images...</p>
                            </div>
                        ) : (
                            <div className="text-center">
                                <div className="mb-4 p-4 rounded-full bg-primary/10 inline-block group-hover:scale-110 transition-transform">
                                    <Upload className="w-12 h-12 text-primary" />
                                </div>
                                <p className="text-xl font-semibold mb-2">Click to upload images</p>
                                <p className="text-sm text-muted-foreground mb-1">or drag and drop</p>
                                <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB (multiple files supported)</p>
                            </div>
                        )}
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleImageUpload(e.target.files)}
                            disabled={uploading}
                        />
                    </label>
                </motion.div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                    {gallery.map((image, index) => {
                        const isSelected = selectedIds.includes(image._id)
                        return (
                            <motion.div
                                key={image._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className={`relative group cursor-pointer ${isSelected ? 'ring-2 ring-primary rounded-xl' : ''}`}
                                onClick={() => toggleSelection(image._id)}
                            >
                                <Card className="glass border-primary/20 overflow-hidden group h-full">
                                    <CardContent className="p-0 h-full">
                                        <div className="relative aspect-square">
                                            <Image
                                                src={image.image}
                                                alt="Gallery image"
                                                fill
                                                className={`object-cover transition-transform duration-500 group-hover:scale-110 ${isSelected ? 'opacity-80' : ''}`}
                                            />
                                            <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />

                                            {/* Selection Checkbox */}
                                            <div className="absolute top-2 left-2">
                                                <div className={`w-5 h-5 rounded-md border border-white/50 flex items-center justify-center transition-all ${isSelected ? 'bg-primary border-primary' : 'bg-black/30'}`}>
                                                    {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                                                </div>
                                            </div>

                                            {/* Delete Button (Single) */}
                                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <Button
                                                    size="icon"
                                                    variant="destructive"
                                                    className="h-8 w-8 shadow-lg"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleDelete(image._id)
                                                    }}
                                                >
                                                    <Trash2 size={14} />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )
                    })}

                    {gallery.length === 0 && !uploading && (
                        <Card className="glass col-span-full">
                            <CardContent className="p-12 text-center">
                                <ImagePlus size={64} className="mx-auto text-muted-foreground opacity-30 mb-4" />
                                <p className="text-muted-foreground text-lg">No images yet. Upload your first one!</p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Image Count */}
                {gallery.length > 0 && (
                    <div className="mt-8 text-center pb-8">
                        <p className="text-muted-foreground">
                            Total Images: <span className="font-bold text-foreground">{gallery.length}</span>
                            {selectedIds.length > 0 && (
                                <span className="ml-2 text-primary">
                                    ({selectedIds.length} selected)
                                </span>
                            )}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

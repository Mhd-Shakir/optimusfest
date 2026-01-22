"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Upload, X, Loader2, ImagePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface Event {
    _id: string
    title: string
    images: string[]
}

export default function AdminEventsPage() {
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState<string | null>(null)
    const { toast } = useToast()

    useEffect(() => {
        fetchEvents()
    }, [])

    const fetchEvents = async () => {
        try {
            const response = await fetch("/api/admin/events")
            const data = await response.json()
            setEvents(data)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load events",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleImageUpload = async (eventId: string, file: File) => {
        setUploading(eventId)
        const formData = new FormData()
        formData.append("file", file)
        formData.append("eventId", eventId)

        try {
            const response = await fetch("/api/admin/upload-event-image", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) throw new Error("Upload failed")

            const data = await response.json()

            // Update local state
            setEvents((prev) =>
                prev.map((event) =>
                    event._id === eventId ? { ...event, images: [...event.images, data.imageUrl] } : event
                )
            )

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
            setUploading(null)
        }
    }

    const handleImageDelete = async (eventId: string, imageUrl: string) => {
        try {
            const response = await fetch("/api/admin/delete-event-image", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ eventId, imageUrl }),
            })

            if (!response.ok) throw new Error("Delete failed")

            // Update local state
            setEvents((prev) =>
                prev.map((event) =>
                    event._id === eventId
                        ? { ...event, images: event.images.filter((img) => img !== imageUrl) }
                        : event
                )
            )

            toast({
                title: "Success",
                description: "Image deleted successfully",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete image",
                variant: "destructive",
            })
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
                    <h1 className="text-4xl md:text-5xl font-bold mb-2">
                        <span className="gradient-text">Event Photo Management</span>
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Upload and manage photos for festival events
                    </p>
                </motion.div>

                <div className="grid gap-8">
                    {events.map((event, index) => (
                        <motion.div
                            key={event._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="glass border-primary/20">
                                <CardHeader>
                                    <CardTitle className="text-2xl">{event.title}</CardTitle>
                                    <CardDescription>
                                        {event.images.length} photo{event.images.length !== 1 ? "s" : ""} uploaded
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {/* Upload Area */}
                                    <div className="mb-6">
                                        <label
                                            htmlFor={`upload-${event._id}`}
                                            className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-primary/30 rounded-2xl cursor-pointer hover:border-primary/60 transition-colors bg-primary/5 hover:bg-primary/10"
                                        >
                                            {uploading === event._id ? (
                                                <div className="flex flex-col items-center">
                                                    <Loader2 className="w-10 h-10 animate-spin text-primary mb-2" />
                                                    <p className="text-sm text-muted-foreground">Uploading...</p>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center">
                                                    <ImagePlus className="w-10 h-10 text-primary mb-2" />
                                                    <p className="text-sm font-medium">Click to upload photos</p>
                                                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                                                </div>
                                            )}
                                            <input
                                                id={`upload-${event._id}`}
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0]
                                                    if (file) handleImageUpload(event._id, file)
                                                }}
                                                disabled={uploading === event._id}
                                            />
                                        </label>
                                    </div>

                                    {/* Image Gallery */}
                                    {event.images.length > 0 && (
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                            {event.images.map((imageUrl, imgIndex) => (
                                                <div
                                                    key={imgIndex}
                                                    className="group relative aspect-square rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-colors"
                                                >
                                                    <Image
                                                        src={imageUrl}
                                                        alt={`${event.title} - Photo ${imgIndex + 1}`}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors" />
                                                    <Button
                                                        size="icon"
                                                        variant="destructive"
                                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={() => handleImageDelete(event._id, imageUrl)}
                                                    >
                                                        <X size={16} />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}

"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Upload, X, Loader2, ImagePlus, Plus, Trash2, Calendar, Clock, MapPin } from "lucide-react"
import { ImageWithFallback } from "@/components/ui/image-with-fallback"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

interface Event {
    _id: string
    title: string
    category: string
    date: string
    time: string
    venue: string
    description: string
    images: string[]
}

export default function AdminEventsPage() {
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState<string | null>(null)
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [creating, setCreating] = useState(false)
    const [newEvent, setNewEvent] = useState({
        title: "",
        category: "Event",
        date: "",
        time: "",
        venue: "",
        description: ""
    })
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

    const handleCreateEvent = async (e: React.FormEvent) => {
        e.preventDefault()
        setCreating(true)
        try {
            const response = await fetch("/api/admin/events", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newEvent),
            })

            if (!response.ok) throw new Error("Failed to create event")

            const createdEvent = await response.json()
            setEvents(prev => [...prev, createdEvent])
            setIsCreateOpen(false)
            setNewEvent({ title: "", category: "Event", date: "", time: "", venue: "", description: "" })
            toast({
                title: "Success",
                description: "Event created successfully",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create event",
                variant: "destructive",
            })
        } finally {
            setCreating(false)
        }
    }

    const handleDeleteEvent = async (id: string) => {
        if (!confirm("Are you sure you want to delete this event? This action cannot be undone.")) return

        try {
            const response = await fetch(`/api/admin/events/${id}`, {
                method: "DELETE",
            })

            if (!response.ok) throw new Error("Failed to delete event")

            setEvents(prev => prev.filter(e => e._id !== id))
            toast({
                title: "Success",
                description: "Event deleted successfully",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete event",
                variant: "destructive",
            })
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

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Upload failed");
            }

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
            console.error("Upload error detail:", error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to upload image",
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
                    className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-2">
                            <span className="gradient-text">Event Management</span>
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Create events and manage their photo galleries
                        </p>
                    </div>

                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                                <Plus className="w-5 h-5 mr-2" />
                                Add New Event
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px] border border-border bg-white shadow-2xl text-black">
                            <div className="relative z-10">
                                <DialogHeader>
                                    <DialogTitle>Create New Event</DialogTitle>
                                    <DialogDescription>
                                        Fill in the details for the new event.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleCreateEvent} className="space-y-4 mt-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="title">Event Title</Label>
                                        <Input
                                            id="title"
                                            value={newEvent.title}
                                            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                            placeholder="e.g. Grand Opening Ceremony"
                                            required
                                            className="bg-gray-50/50 border-gray-200 text-black"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="date">Date</Label>
                                            <Input
                                                id="date"
                                                type="text"
                                                value={newEvent.date}
                                                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                                                placeholder="e.g. Jan 15, 2026"
                                                required
                                                className="bg-gray-50/50 border-gray-200 text-black"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="time">Time</Label>
                                            <Input
                                                id="time"
                                                value={newEvent.time}
                                                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                                                placeholder="e.g. 10:00 AM"
                                                required
                                                className="bg-gray-50/50 border-gray-200 text-black"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="venue">Venue</Label>
                                        <Input
                                            id="venue"
                                            value={newEvent.venue}
                                            onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                                            placeholder="e.g. Main Auditorium"
                                            required
                                            className="bg-gray-50/50 border-gray-200 text-black"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            value={newEvent.description}
                                            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                            placeholder="Brief description of the event..."
                                            rows={3}
                                            required
                                            className="bg-gray-50/50 border-gray-200 text-black"
                                        />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={creating}>
                                        {creating ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Creating...
                                            </>
                                        ) : (
                                            "Create Event"
                                        )}
                                    </Button>
                                </form>
                            </div>
                        </DialogContent>
                    </Dialog>
                </motion.div>

                {events.length === 0 ? (
                    <Card className="glass border-dashed border-2 border-primary/20">
                        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                            <Calendar className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
                            <h3 className="text-xl font-semibold mb-2">No Events Found</h3>
                            <p className="text-muted-foreground mb-6 max-w-sm">
                                Get started by creating your first event. You can add photos to it after creation.
                            </p>
                            <Button onClick={() => setIsCreateOpen(true)} variant="outline">
                                Create First Event
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-8">
                        {events.map((event, index) => (
                            <motion.div
                                key={event._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="glass border-primary/20">
                                    <CardHeader className="flex flex-row items-start justify-between">
                                        <div>
                                            <CardTitle className="text-2xl mb-2">{event.title}</CardTitle>
                                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <Calendar size={14} className="text-primary" />
                                                    {event.date}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock size={14} className="text-primary" />
                                                    {event.time}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <MapPin size={14} className="text-primary" />
                                                    {event.venue}
                                                </div>
                                                <div className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                                                    {event.category}
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                                            onClick={() => handleDeleteEvent(event._id)}
                                        >
                                            <Trash2 size={20} />
                                        </Button>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground mb-6">{event.description}</p>

                                        {/* Upload Area */}
                                        <div className="mb-6">
                                            <label
                                                htmlFor={`upload-${event._id}`}
                                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-primary/30 rounded-2xl cursor-pointer hover:border-primary/60 transition-colors bg-primary/5 hover:bg-primary/10"
                                            >
                                                {uploading === event._id ? (
                                                    <div className="flex flex-col items-center">
                                                        <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                                                        <p className="text-sm text-muted-foreground">Uploading...</p>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center">
                                                        <ImagePlus className="w-8 h-8 text-primary mb-2" />
                                                        <p className="text-sm font-medium">Add Photos</p>
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
                                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                                {event.images.map((imageUrl, imgIndex) => (
                                                    <div
                                                        key={imgIndex}
                                                        className="group relative aspect-square rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-colors"
                                                    >
                                                        <ImageWithFallback
                                                            src={imageUrl}
                                                            alt={`${event.title} - Photo ${imgIndex + 1}`}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors" />
                                                        <Button
                                                            size="icon"
                                                            variant="destructive"
                                                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8"
                                                            onClick={() => handleImageDelete(event._id, imageUrl)}
                                                        >
                                                            <X size={14} />
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
                )}
            </div>
        </div>
    )
}

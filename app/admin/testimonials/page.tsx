"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Plus, Edit, Trash2, Loader2, ImagePlus, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Testimonial {
    _id: string
    name: string
    role: string
    content: string
    image?: string
}

export default function AdminTestimonialsPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([])
    const [loading, setLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
    const [uploading, setUploading] = useState(false)
    const [testimonialToDelete, setTestimonialToDelete] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const { toast } = useToast()

    const [formData, setFormData] = useState({
        name: "",
        role: "",
        content: "",
        image: "",
    })

    useEffect(() => {
        fetchTestimonials()
    }, [])

    const fetchTestimonials = async () => {
        try {
            const response = await fetch("/api/admin/testimonials")
            const data = await response.json()
            setTestimonials(data)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load testimonials",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const url = editingTestimonial ? `/api/admin/testimonials/${editingTestimonial._id}` : "/api/admin/testimonials"
            const method = editingTestimonial ? "PUT" : "POST"

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (!response.ok) throw new Error("Failed to save testimonial")

            toast({
                title: "Success",
                description: `Testimonial ${editingTestimonial ? "updated" : "created"} successfully`,
            })

            setIsDialogOpen(false)
            resetForm()
            fetchTestimonials()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save testimonial",
                variant: "destructive",
            })
        }
    }

    const handleDelete = async () => {
        if (!testimonialToDelete) return
        setIsDeleting(true)

        try {
            const response = await fetch(`/api/admin/testimonials/${testimonialToDelete}`, {
                method: "DELETE",
            })

            if (!response.ok) throw new Error("Failed to delete")

            toast({
                title: "Success",
                description: "Testimonial deleted successfully",
            })

            fetchTestimonials()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete testimonial",
                variant: "destructive",
            })
        } finally {
            setIsDeleting(false)
            setTestimonialToDelete(null)
        }
    }

    const handleImageUpload = async (file: File) => {
        setUploading(true)
        const formData = new FormData()
        formData.append("file", file)

        try {
            const response = await fetch("/api/admin/upload-testimonial-image", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) throw new Error("Upload failed")

            const data = await response.json()
            if (data.imageUrl) {
                setFormData((prev) => ({ ...prev, image: data.imageUrl }))
                toast({
                    title: "Success",
                    description: "Image uploaded successfully",
                })
            } else {
                throw new Error(data.message || "Upload failed")
            }
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

    const handleEdit = (testimonial: Testimonial) => {
        setEditingTestimonial(testimonial)
        setFormData({
            name: testimonial.name,
            role: testimonial.role,
            content: testimonial.content,
            image: testimonial.image || "",
        })
        setIsDialogOpen(true)
    }

    const resetForm = () => {
        setEditingTestimonial(null)
        setFormData({
            name: "",
            role: "",
            content: "",
            image: "",
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
                            <span className="gradient-text">Testimonial Management</span>
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Manage voices of excellence and success stories
                        </p>
                    </div>

                    <Dialog open={isDialogOpen} onOpenChange={(open) => {
                        setIsDialogOpen(open)
                        if (!open) resetForm()
                    }}>
                        <DialogTrigger asChild>
                            <Button className="gap-2">
                                <Plus size={20} />
                                New Testimonial
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl border border-border bg-white shadow-2xl text-black">
                            <DialogHeader>
                                <DialogTitle>{editingTestimonial ? "Edit Testimonial" : "Create New Testimonial"}</DialogTitle>
                                <DialogDescription>
                                    Fill in the details to showcase a new testimonial.
                                </DialogDescription>
                            </DialogHeader>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name *</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="role">Role/Achievement *</Label>
                                        <Input
                                            id="role"
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                            required
                                            placeholder="e.g. Winner - Music 2026"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="content">Content *</Label>
                                    <Textarea
                                        id="content"
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        rows={4}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Profile Image</Label>
                                    {formData.image ? (
                                        <div className="relative w-24 h-24 rounded-full overflow-hidden border">
                                            <Image src={formData.image} alt="Profile" fill className="object-cover" />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity bg-black/60 rounded-none h-full w-full"
                                                onClick={() => setFormData({ ...formData, image: "" })}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    ) : (
                                        <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-primary/30 rounded-full cursor-pointer hover:border-primary/60 transition-colors bg-primary/5 hover:bg-primary/10">
                                            {uploading ? (
                                                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                            ) : (
                                                <>
                                                    <ImagePlus className="w-6 h-6 text-primary mb-1" />
                                                    <p className="text-[10px] text-muted-foreground">Upload</p>
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

                                <div className="flex gap-2 pt-4">
                                    <Button type="submit" className="flex-1" disabled={uploading}>
                                        {editingTestimonial ? "Update" : "Create"} Testimonial
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
                        </DialogContent>
                    </Dialog>
                </motion.div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="glass h-full flex flex-col relative overflow-hidden group">
                                <div className="absolute top-4 right-4 flex gap-2 z-10">
                                    <Button size="icon" variant="outline" className="bg-white border-gray-200 text-black hover:bg-gray-100" onClick={() => handleEdit(testimonial)}>
                                        <Edit size={16} />
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button size="icon" variant="outline" className="bg-white border-gray-200 text-black hover:bg-gray-100" onClick={() => setTestimonialToDelete(testimonial._id)}>
                                                <Trash2 size={16} />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="bg-white text-black border border-border">
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                <AlertDialogDescription className="text-gray-600">
                                                    This action cannot be undone. This will permanently delete the testimonial
                                                    from the database.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 border-none" onClick={() => setTestimonialToDelete(null)}>Cancel</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={handleDelete}
                                                    className="bg-red-600 hover:bg-red-700 text-white border-none"
                                                    disabled={isDeleting}
                                                >
                                                    {isDeleting ? "Deleting..." : "Delete"}
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                                <CardContent className="p-6 flex flex-col h-full">
                                    <Quote className="text-primary/20 mb-4" size={32} />
                                    <p className="text-muted-foreground italic mb-6 flex-1">"{testimonial.content}"</p>
                                    <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted">
                                            {testimonial.image ? (
                                                <Image src={testimonial.image} alt={testimonial.name} fill className="object-cover" />
                                            ) : (
                                                <div className="h-full flex items-center justify-center text-primary/30">
                                                    <ImagePlus size={20} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="font-bold truncate">{testimonial.name}</h4>
                                            <p className="text-xs text-muted-foreground truncate">{testimonial.role}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}

                    {testimonials.length === 0 && (
                        <Card className="glass md:col-span-2 lg:col-span-3">
                            <CardContent className="p-12 text-center">
                                <p className="text-muted-foreground">No testimonials found. Add your first success story!</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}

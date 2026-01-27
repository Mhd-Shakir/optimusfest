"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight, ImageIcon, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

import { siteConfig, breadcrumbSchema } from "@/lib/seo-config"

interface GalleryImage {
    _id: string
    image: string
}

export default function GalleryPage() {
    const [images, setImages] = useState<GalleryImage[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState<number | null>(null)

    const breadcrumbs = breadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Gallery", url: "/gallery" },
    ]);

    useEffect(() => {
        async function fetchGallery() {
            try {
                const response = await fetch("/api/gallery", { cache: "no-store" })
                const data = await response.json()
                setImages(data)
            } catch (error) {
                console.error("Error fetching gallery:", error)
                setImages([])
            } finally {
                setLoading(false)
            }
        }
        fetchGallery()
    }, [])

    const handlePrevious = () => {
        if (selectedImage !== null) {
            setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1)
        }
    }

    const handleNext = () => {
        if (selectedImage !== null) {
            setSelectedImage(selectedImage === images.length - 1 ? 0 : selectedImage + 1)
        }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "ArrowLeft") handlePrevious()
        if (e.key === "ArrowRight") handleNext()
        if (e.key === "Escape") setSelectedImage(null)
    }

    useEffect(() => {
        if (selectedImage !== null) {
            window.addEventListener("keydown", handleKeyDown)
            return () => window.removeEventListener("keydown", handleKeyDown)
        }
    }, [selectedImage, images.length])

    return (
        <main className="min-h-screen bg-background">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadcrumbs),
                }}
            />
            <Header />

            <div className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
                {/* Background decorations */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-accent/10 to-transparent rounded-full blur-3xl pointer-events-none" />

                <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
                    {/* Header */}
                    <div className="text-center mb-16 md:mb-20">
                        <Link
                            href="/"
                            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-6 group"
                        >
                            <ArrowLeft size={16} className="mr-2 transition-transform group-hover:-translate-x-1" />
                            Back to Home
                        </Link>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-sans font-bold mb-6">
                            <span className="gradient-text">Full Gallery</span>
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Explore every moment captured during Optimus Arts Fest 2026.
                            From stage performances to candid moments, it&apos;s all here.
                        </p>
                    </div>

                    {/* Gallery Grid */}
                    {loading ? (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
                            {[...Array(12)].map((_, i) => (
                                <Skeleton key={i} className="aspect-square rounded-2xl" />
                            ))}
                        </div>
                    ) : images.length === 0 ? (
                        <div className="text-center py-20 bg-accent/5 rounded-3xl border border-white/5">
                            <ImageIcon size={64} className="mx-auto text-muted-foreground opacity-30 mb-4" />
                            <p className="text-muted-foreground text-lg">No images found in the gallery.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {images.map((img, index) => {
                                return (
                                    <motion.div
                                        key={img._id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.4, delay: index * 0.05 }}
                                        className="relative group cursor-pointer overflow-hidden rounded-xl bg-muted aspect-square"
                                        onClick={() => setSelectedImage(index)}
                                    >
                                        <Image
                                            src={img.image}
                                            alt={`Gallery image ${index + 1}`}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                        />

                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                        {/* Zoom Icon */}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-50 group-hover:scale-100">
                                            <div className="bg-white/20 backdrop-blur-md p-3 rounded-full border border-white/30 text-white">
                                                <ImageIcon size={24} />
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>

            <Footer />

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedImage !== null && images[selectedImage] && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
                        onClick={() => setSelectedImage(null)}
                    >
                        {/* Close Button */}
                        <button
                            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                            onClick={() => setSelectedImage(null)}
                        >
                            <X size={24} />
                        </button>

                        {/* Image Counter */}
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm font-medium">
                            {selectedImage + 1} / {images.length}
                        </div>

                        {/* Main Image */}
                        <motion.div
                            key={selectedImage}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            className="relative w-full max-w-6xl h-[85vh] mx-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={images[selectedImage].image}
                                alt={`Gallery image ${selectedImage + 1}`}
                                fill
                                className="object-contain"
                                priority
                            />
                        </motion.div>

                        {/* Navigation Buttons */}
                        {images.length > 1 && (
                            <>
                                <button
                                    className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handlePrevious()
                                    }}
                                >
                                    <ChevronLeft size={32} />
                                </button>

                                <button
                                    className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleNext()
                                    }}
                                >
                                    <ChevronRight size={32} />
                                </button>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    )
}

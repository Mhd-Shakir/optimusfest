"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EventGalleryModalProps {
    isOpen: boolean
    onClose: () => void
    images: string[]
    eventTitle: string
    initialIndex?: number
}

export function EventGalleryModal({
    isOpen,
    onClose,
    images,
    eventTitle,
    initialIndex = 0,
}: EventGalleryModalProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex)

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    }

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowLeft") handlePrevious()
        if (e.key === "ArrowRight") handleNext()
        if (e.key === "Escape") onClose()
    }

    if (!images || images.length === 0) return null

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
                    onClick={onClose}
                    onKeyDown={handleKeyDown}
                    tabIndex={0}
                >
                    {/* Close Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
                        onClick={onClose}
                    >
                        <X size={24} />
                    </Button>

                    {/* Image Counter */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm font-medium">
                        {currentIndex + 1} / {images.length}
                    </div>

                    {/* Event Title */}
                    <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 px-6 py-2 rounded-full bg-black/50 backdrop-blur-sm text-white text-base font-semibold">
                        {eventTitle}
                    </div>

                    {/* Main Image Container */}
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="relative w-full max-w-6xl h-[80vh] mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={images[currentIndex]}
                            alt={`${eventTitle} - Photo ${currentIndex + 1}`}
                            fill
                            className="object-contain"
                            priority
                        />
                    </motion.div>

                    {/* Navigation Buttons */}
                    {images.length > 1 && (
                        <>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 w-12 h-12"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handlePrevious()
                                }}
                            >
                                <ChevronLeft size={32} />
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 w-12 h-12"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleNext()
                                }}
                            >
                                <ChevronRight size={32} />
                            </Button>
                        </>
                    )}

                    {/* Thumbnail Strip */}
                    {images.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-2 max-w-full overflow-x-auto px-4 py-2 rounded-lg bg-black/50 backdrop-blur-sm">
                            {images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setCurrentIndex(index)
                                    }}
                                    className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 transition-all ${index === currentIndex
                                            ? "ring-2 ring-white scale-110"
                                            : "opacity-60 hover:opacity-100"
                                        }`}
                                >
                                    <Image
                                        src={image}
                                        alt={`Thumbnail ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    )
}

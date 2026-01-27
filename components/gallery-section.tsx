"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight, ImageIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface GalleryImage {
  _id: string
  image: string
}

export function GallerySection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

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
    <>
      <section id="gallery" ref={ref} className="relative overflow-hidden py-16 md:py-24">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tl from-accent/10 to-transparent rounded-full blur-3xl" />

        <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-semibold tracking-wider uppercase mb-4">
              Memories
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans font-bold mb-4">
              <span className="gradient-text">Festival Gallery</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Relive the magical moments from our arts festival
            </p>
          </motion.div>

          {/* Gallery Grid with Stack Effect */}
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 mt-10">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-2xl" />
              ))}
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon size={64} className="mx-auto text-muted-foreground opacity-30 mb-4" />
              <p className="text-muted-foreground text-lg">No images yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 mt-10 px-4">
              {images.slice(0, 8).map((img, index) => {
                const hasEnoughImages = images.length > 8

                return (
                  <div key={img._id} className="relative group cursor-pointer mb-8" onClick={() => setSelectedImage(index)}>

                    {/* Background Stack Layer 2 (Furthest) - Always visible */}
                    {hasEnoughImages ? (
                      <div className="absolute inset-x-6 -top-8 bottom-6 z-0 transform scale-90 group-hover:-translate-y-3 transition-transform duration-500 overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-sm">
                        <Image
                          src={images[(index + 9) % images.length].image}
                          alt=""
                          fill
                          className="object-cover opacity-50 grayscale blur-[0.5px]"
                        />
                      </div>
                    ) : (
                      <div className="absolute inset-x-6 -top-8 bottom-6 bg-white/5 rounded-2xl border border-white/5 z-0 transform scale-90 group-hover:-translate-y-3 transition-transform duration-500" />
                    )}

                    {/* Background Stack Layer 1 (Middle) - Always visible */}
                    {hasEnoughImages ? (
                      <div className="absolute inset-x-3 -top-4 bottom-3 z-10 transform scale-95 group-hover:-translate-y-2 transition-transform duration-500 overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-md">
                        <Image
                          src={images[(index + 8) % images.length].image}
                          alt=""
                          fill
                          className="object-cover opacity-70 grayscale-[0.3]"
                        />
                      </div>
                    ) : (
                      <div className="absolute inset-x-3 -top-4 bottom-3 bg-white/10 rounded-2xl border border-white/10 z-10 transform scale-95 group-hover:-translate-y-2 transition-transform duration-500" />
                    )}

                    {/* Main Image Card */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="relative z-20 aspect-square overflow-hidden rounded-2xl shadow-xl border border-white/10 bg-background"
                    >
                      <div className="glass h-full w-full transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-primary/20">
                        <Image
                          src={img.image}
                          alt={`Gallery image ${index + 1}`}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {/* Gradient Overlay on Hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </motion.div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

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
    </>
  )
}

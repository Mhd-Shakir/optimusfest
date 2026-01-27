"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Calendar, Clock, MapPin, Upload } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { EventGalleryModal } from "./event-gallery-modal"
import { ImageWithFallback } from "@/components/ui/image-with-fallback"

interface Event {
  _id: string
  title: string
  category: string
  date: string
  time: string
  venue: string
  description: string
  images?: string[]
}

export function EventsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("/api/events", { cache: "no-store" })
        const data = await response.json()
        setEvents(data)
      } catch (error) {
        console.error("Error fetching events:", error)
        setEvents([])
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  const handleEventClick = (event: Event) => {
    if (event.images && event.images.length > 0) {
      setSelectedEvent(event)
      setIsModalOpen(true)
    }
  }

  return (
    <section id="events" ref={ref} className="relative overflow-hidden py-16 md:py-24">
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
            Optimus Highlights
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans font-bold mb-4">
            <span className="gradient-text">Events</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Experience the grand celebrations of Optimus Arts Festival
          </p>
        </motion.div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-[500px] rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {events.map((event, index) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="group relative"
              >
                <div
                  className={`glass rounded-3xl overflow-hidden h-full hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 border border-transparent hover:border-primary/30 ${event.images && event.images.length > 0 ? 'cursor-pointer' : ''
                    }`}
                  onClick={() => handleEventClick(event)}
                >
                  {/* Image Container with Gallery */}
                  <div className="relative h-36 md:h-48 overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5">
                    {event.images && event.images.length > 0 ? (
                      <div className="relative h-full">
                        <ImageWithFallback
                          src={event.images[0]}
                          alt={event.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        {/* Image count badge */}
                        {event.images.length > 1 && (
                          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-sm text-white text-[10px] font-semibold">
                            +{event.images.length - 1} photos
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                        <Upload size={32} className="mb-1 opacity-50" />
                        <p className="text-xs">Photos coming soon</p>
                      </div>
                    )}
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-4 md:p-5">
                    <h3 className="text-lg md:text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-muted-foreground text-xs md:text-sm mb-4 leading-relaxed line-clamp-2">
                      {event.description}
                    </p>

                    {/* Event Details */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                        <Calendar size={14} className="text-primary flex-shrink-0" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                        <Clock size={14} className="text-primary flex-shrink-0" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                        <MapPin size={14} className="text-primary flex-shrink-0" />
                        <span>{event.venue}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Gallery Modal */}
      {selectedEvent && (
        <EventGalleryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          images={selectedEvent.images || []}
          eventTitle={selectedEvent.title}
        />
      )}
    </section>
  )
}

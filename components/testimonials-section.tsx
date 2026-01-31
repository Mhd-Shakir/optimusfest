"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import { Quote, Star } from "lucide-react"
import { type Testimonial } from "@/lib/actions"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"

const fallbackTestimonials: Testimonial[] = [
  {
    _id: "1",
    name: "Aisha Rahman",
    role: "Winner - Classical Dance 2025",
    content:
      "Optimus Arts Fest gave me a platform to showcase my passion. The experience was transformative and the community incredibly supportive.",
    image: "/young-indian-woman-smiling.jpg",
  },
  {
    _id: "2",
    name: "James Mitchell",
    role: "Participant - Music 2024",
    content:
      "The level of professionalism and the quality of participants here is unmatched. It truly brings out the best in every artist.",
    image: "/young-man-musician-portrait.jpg",
  },
  {
    _id: "3",
    name: "Sophia Lee",
    role: "Winner - Visual Arts 2025",
    content:
      "Being recognized at Optimus was a dream come true. The judges' feedback was invaluable for my artistic growth.",
    image: "/asian-woman-artist-portrait.jpg",
  },
  {
    _id: "4",
    name: "Carlos Mendez",
    role: "Participant - Drama 2024",
    content:
      "The atmosphere at the fest is electric. You can feel the creative energy in every corner. A must-experience for any artist.",
    image: "/hispanic-man-actor-portrait.jpg",
  },
  {
    _id: "5",
    name: "Emily Johnson",
    role: "Winner - Literary Arts 2025",
    content:
      "The poetry slam was intense and inspiring. Optimus celebrates not just winners but every participant's journey.",
    image: "/young-woman-writer-portrait.jpg",
  },
  {
    _id: "6",
    name: "Raj Patel",
    role: "Participant - Music 2025",
    content: "From registration to performance, everything was seamless. The organizing team deserves all the praise.",
    image: "/indian-man-musician-portrait.jpg",
  },
]

export function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [api, setApi] = useState<CarouselApi>()

  useEffect(() => {
    if (!api) return

    const autoplay = setInterval(() => {
      api.scrollNext()
    }, 4000)

    return () => clearInterval(autoplay)
  }, [api])

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const response = await fetch("/api/testimonials")
        const data = await response.json()
        setTestimonials(data.length > 0 ? data : fallbackTestimonials)
      } catch {
        setTestimonials(fallbackTestimonials)
      } finally {
        setLoading(false)
      }
    }
    fetchTestimonials()
  }, [])

  return (
    <section id="testimonials" ref={ref} className="relative pt-16 md:pt-24 pb-32 md:pb-48 overflow-hidden bg-gradient-to-b from-background via-accent/5 to-background">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-accent/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs sm:text-sm font-semibold tracking-wider uppercase mb-4">
            What They Say
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans font-bold mb-4">
            Voices of <span className="gradient-text">Excellence</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Hear from our talented participants and winners who made their mark at Optimus
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-[280px] rounded-3xl" />
            ))}
          </div>
        ) : (
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-6 md:-ml-8 lg:-ml-12">
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={testimonial._id} className="pl-6 md:pl-8 lg:pl-12 md:basis-1/2 lg:basis-1/3">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="h-full py-4"
                  >
                    <div className="bg-white rounded-[2rem] p-8 md:p-10 h-full min-h-[350px] shadow-xl hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 border border-gray-100 flex flex-col group">
                      {/* Quote Icon */}
                      <div className="mb-4">
                        <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20 group-hover:from-accent/30 group-hover:to-primary/30 transition-all duration-300">
                          <Quote className="text-accent" size={24} />
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} className="fill-accent text-accent" />
                        ))}
                      </div>

                      {/* Content */}
                      <p className="text-foreground leading-relaxed mb-6 flex-1 text-sm md:text-base">
                        "{testimonial.content}"
                      </p>

                      {/* Author */}
                      <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                        <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-accent/20 flex-shrink-0">
                          <Image
                            src={testimonial.image || "/placeholder.svg?height=100&width=100&query=person portrait"}
                            alt={testimonial.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-foreground text-base md:text-lg truncate">
                            {testimonial.name}
                          </h4>
                          <p className="text-xs md:text-sm text-muted-foreground truncate">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-8 gap-4">
              <CarouselPrevious className="relative static translate-y-0" />
              <CarouselNext className="relative static translate-y-0" />
            </div>
          </Carousel>
        )}
      </div>
    </section>
  )
}

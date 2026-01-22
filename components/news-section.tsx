"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import { Calendar, User, Tag, ArrowRight, X } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

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

export function NewsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [news, setNews] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null)

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch("/api/news", { cache: "no-store" })
        const data = await response.json()
        setNews(data)
      } catch (error) {
        console.error("Error fetching news:", error)
        setNews([])
      } finally {
        setLoading(false)
      }
    }
    fetchNews()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  return (
    <>
      <section id="news" ref={ref} className="relative overflow-hidden py-20 md:py-32 bg-gradient-to-b from-background to-accent/5">
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
              Latest Updates
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans font-bold mb-4">
              <span className="gradient-text">Festival News</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Stay updated with the latest announcements and happenings at Optimus Arts Festival
            </p>
          </motion.div>

          {/* News Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-[450px] rounded-3xl" />
              ))}
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No news articles yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {news.map((article, index) => (
                <motion.article
                  key={article._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group relative cursor-pointer"
                  onClick={() => setSelectedArticle(article)}
                >
                  <div className="glass rounded-3xl overflow-hidden h-full hover:shadow-2xl hover:shadow-accent/20 transition-all duration-500 border border-transparent hover:border-accent/30 flex flex-col">
                    {/* Image */}
                    <div className="relative h-48 md:h-56 overflow-hidden bg-gradient-to-br from-accent/5 to-primary/5">
                      {article.image ? (
                        <Image
                          src={article.image}
                          alt={article.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="h-full flex items-center justify-center bg-gradient-to-br from-accent/10 to-primary/10">
                          <Tag size={48} className="text-muted-foreground opacity-30" />
                        </div>
                      )}
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1.5 text-xs font-semibold bg-white/90 backdrop-blur-sm text-black rounded-full shadow-lg">
                          {article.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-8 flex-1 flex flex-col">
                      {/* Meta Info */}
                      <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-accent" />
                          <span>{formatDate(article.date)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <User size={14} className="text-accent" />
                          <span>{article.author}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl md:text-2xl font-bold mb-3 text-foreground group-hover:text-accent transition-colors line-clamp-2">
                        {article.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-muted-foreground text-sm md:text-base mb-6 line-clamp-3 flex-1">
                        {article.excerpt}
                      </p>

                      {/* Read More */}
                      <div className="flex items-center gap-2 text-accent text-sm font-medium group-hover:gap-3 transition-all">
                        <span>Read More</span>
                        <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Article Modal */}
      {selectedArticle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setSelectedArticle(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="glass rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
            >
              <X size={20} />
            </button>

            {/* Image */}
            {selectedArticle.image && (
              <div className="relative h-64 md:h-80 overflow-hidden rounded-t-3xl">
                <Image
                  src={selectedArticle.image}
                  alt={selectedArticle.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            )}

            {/* Content */}
            <div className="p-6 md:p-10">
              {/* Category Badge */}
              <span className="inline-block px-3 py-1.5 text-xs font-semibold bg-accent/20 text-accent rounded-full mb-4">
                {selectedArticle.category}
              </span>

              {/* Title */}
              <h2 className="text-2xl md:text-4xl font-bold mb-4 text-foreground">
                {selectedArticle.title}
              </h2>

              {/* Meta */}
              <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-accent" />
                  <span>{formatDate(selectedArticle.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User size={16} className="text-accent" />
                  <span>{selectedArticle.author}</span>
                </div>
              </div>

              {/* Content */}
              <div className="prose prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {selectedArticle.content}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}

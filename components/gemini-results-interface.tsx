"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Sparkles, Trophy, Download, ImageIcon, Loader2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import Image from "next/image"
import eventsData from "@/lib/events-data.json"

type ResultData = {
    _id: string
    studentName: string
    event: string
    category: string
    rank: number
    score?: number
    poster?: string
}

type ViewState = "home" | "events" | "results"

const categoryMap = {
    "Alpha": "ALPHA CATEGORY (JUNIOR DA'WA)",
    "Beta": "BETA CATEGORY (HS1 - BS 1)",
    "Omega": "OMEGA CATEGORY (BS 2 - BS 5)",
    "General-A": "GENARAL CATEGORY-A (JUNIOR DA'WA)",
    "General-B": "GENARAL CATEGORY-B (SENIOR DA'WA)",
}

const categoryIcons = {
    "Alpha": "🏆",
    "Beta": "🎯",
    "Omega": "⭐",
    "General-A": "🎪",
    "General-B": "🎨",
}

export function GeminiResultsInterface() {
    const [viewState, setViewState] = useState<ViewState>("home")
    const [selectedCategory, setSelectedCategory] = useState<string>("")
    const [selectedEvent, setSelectedEvent] = useState<string>("")
    const [results, setResults] = useState<ResultData[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [viewState, results])

    const handleCategoryClick = (category: string) => {
        setSelectedCategory(category)
        setViewState("events")
    }

    const handleEventClick = async (event: string) => {
        setSelectedEvent(event)
        setIsLoading(true)
        setViewState("results")

        try {
            const response = await fetch(`/api/results?event=${encodeURIComponent(event)}`)
            if (response.ok) {
                const data = await response.json()
                setResults(data)
            } else {
                setResults([])
            }
        } catch (error) {
            console.error("Error fetching results:", error)
            setResults([])
        } finally {
            setIsLoading(false)
        }
    }

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!searchQuery.trim()) return

        setIsLoading(true)
        setViewState("results")

        try {
            const response = await fetch(`/api/results?search=${encodeURIComponent(searchQuery)}`)
            if (response.ok) {
                const data = await response.json()
                setResults(data)
                setSelectedEvent("")
            } else {
                setResults([])
            }
        } catch (error) {
            console.error("Error searching:", error)
            setResults([])
        } finally {
            setIsLoading(false)
        }
    }

    const handleBack = () => {
        setViewState("home")
        setSelectedCategory("")
        setSelectedEvent("")
        setResults([])
        setSearchQuery("")
    }

    const getCurrentEvents = () => {
        const categoryData = eventsData.find(
            (cat) => categoryMap[selectedCategory as keyof typeof categoryMap] === cat.category
        )
        return categoryData?.events || []
    }

    const getRankBadge = (rank: number) => {
        const badges = {
            1: { emoji: "🥇", color: "from-yellow-400 to-yellow-600", text: "1st Place" },
            2: { emoji: "🥈", color: "from-gray-300 to-gray-500", text: "2nd Place" },
            3: { emoji: "🥉", color: "from-orange-400 to-orange-600", text: "3rd Place" },
        }
        return badges[rank as keyof typeof badges] || { emoji: "🏅", color: "from-blue-400 to-blue-600", text: `${rank}th Place` }
    }

    return (
        <div className="max-w-3xl mx-auto min-h-screen">
            {/* Gemini-style Interface */}
            <div className="bg-[#131314] min-h-screen">
                <AnimatePresence mode="wait">
                    {/* Home View - Gemini Style */}
                    {viewState === "home" && (
                        <motion.div
                            key="home"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center min-h-screen px-6"
                        >
                            {/* Gemini Icon + Greeting */}
                            <div className="mb-12 text-center">
                                <div className="flex items-center justify-center gap-3 mb-4">
                                    <Sparkles className="text-blue-400" size={32} />
                                    <h1 className="text-3xl font-normal text-[#e3e3e3]">Hi there</h1>
                                </div>
                                <h2 className="text-5xl font-normal text-white">
                                    Where should we start?
                                </h2>
                            </div>

                            {/* Search Box */}
                            <div className="w-full max-w-2xl mb-8">
                                <form onSubmit={handleSearch}>
                                    <div className="relative bg-[#282a2c] rounded-full border border-[#444746] hover:border-[#5f6368] focus-within:border-blue-500 transition-colors">
                                        <Input
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Ask Gemini"
                                            className="w-full bg-transparent border-0 text-white placeholder:text-[#9aa0a6] text-base px-6 py-7 pr-14 focus-visible:ring-0 focus-visible:ring-offset-0"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!searchQuery.trim()}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9aa0a6] hover:text-white disabled:opacity-50 transition-colors"
                                        >
                                            <Send size={20} />
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Category Chips (replacing Gemini suggestions) */}
                            <div className="flex flex-wrap items-center justify-center gap-3 max-w-2xl">
                                {Object.entries(categoryMap).map(([key, fullName]) => (
                                    <motion.button
                                        key={key}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleCategoryClick(key)}
                                        className="bg-[#282a2c] hover:bg-[#303134] border border-[#444746] hover:border-[#5f6368] rounded-full px-5 py-2.5 text-[#e8eaed] text-sm font-medium transition-all"
                                    >
                                        {key}
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Events View */}
                    {viewState === "events" && (
                        <motion.div
                            key="events"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="min-h-screen p-6"
                        >
                            {/* Header with Back */}
                            <div className="mb-8">
                                <button
                                    onClick={handleBack}
                                    className="text-blue-400 hover:text-blue-300 mb-4 flex items-center gap-2"
                                >
                                    ← Back to categories
                                </button>
                                <h2 className="text-3xl font-normal text-white mb-2">
                                    {selectedCategory} Category
                                </h2>
                                <p className="text-[#9aa0a6]">
                                    {getCurrentEvents().length} events available
                                </p>
                            </div>

                            {/* Events Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {getCurrentEvents().map((event, index) => (
                                    <motion.button
                                        key={event}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.03 }}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleEventClick(event)}
                                        className="bg-[#282a2c] hover:bg-[#303134] border border-[#444746] hover:border-blue-500 rounded-3xl p-4 text-left transition-all"
                                    >
                                        <p className="text-white font-medium text-sm">{event}</p>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Results View */}
                    {viewState === "results" && (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="min-h-screen p-6"
                        >
                            {/* Header with Back */}
                            <div className="mb-8">
                                <button
                                    onClick={handleBack}
                                    className="text-blue-400 hover:text-blue-300 mb-4 flex items-center gap-2"
                                >
                                    ← Back to home
                                </button>
                                <h2 className="text-3xl font-normal text-white mb-2">
                                    {selectedEvent || "Search Results"}
                                </h2>
                                <p className="text-[#9aa0a6]">
                                    {isLoading ? "Loading..." : `${results.length} result(s) found`}
                                </p>
                            </div>

                            {/* Results */}
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <Loader2 className="animate-spin text-blue-400 mb-4" size={48} />
                                    <p className="text-[#9aa0a6]">Loading results...</p>
                                </div>
                            ) : results.length > 0 ? (
                                <div className="space-y-6">
                                    {/* Group results by event and show one card per event */}
                                    {(() => {
                                        // Group results by event
                                        const eventGroups = results.reduce((groups, result) => {
                                            const key = `${result.event}-${result.category}`
                                            if (!groups[key]) {
                                                groups[key] = {
                                                    event: result.event,
                                                    category: result.category,
                                                    poster: result.poster,
                                                    winners: []
                                                }
                                            }
                                            groups[key].winners.push(result)
                                            return groups
                                        }, {} as Record<string, { event: string, category: string, poster?: string, winners: ResultData[] }>)

                                        // Sort winners within each group by rank
                                        Object.values(eventGroups).forEach(group => {
                                            group.winners.sort((a, b) => a.rank - b.rank)
                                        })

                                        return Object.values(eventGroups).map((group, index) => (
                                            <motion.div
                                                key={`${group.event}-${group.category}`}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="bg-[#282a2c] rounded-3xl p-6 border border-[#444746]"
                                            >
                                                {/* Event Header */}
                                                <div className="mb-6">
                                                    <div className="flex items-start gap-3 mb-3">
                                                        <Trophy className="text-blue-400 flex-shrink-0 mt-1" size={24} />
                                                        <div>
                                                            <h3 className="text-2xl font-semibold text-white mb-2">
                                                                {group.event}
                                                            </h3>
                                                            <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-medium">
                                                                {group.category}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Winners List */}
                                                <div className="space-y-3 mb-6">
                                                    <p className="text-sm font-medium text-[#9aa0a6] mb-3">Winners:</p>
                                                    {group.winners.map((winner) => {
                                                        const badge = getRankBadge(winner.rank)
                                                        return (
                                                            <div
                                                                key={winner._id}
                                                                className="flex items-center gap-4 bg-[#1e1f20] rounded-2xl p-4"
                                                            >
                                                                <div
                                                                    className={cn(
                                                                        "w-12 h-12 rounded-full bg-gradient-to-br flex items-center justify-center text-2xl shadow-lg flex-shrink-0",
                                                                        badge.color
                                                                    )}
                                                                >
                                                                    {badge.emoji}
                                                                </div>
                                                                <div className="flex-1">
                                                                    <p className="text-lg font-semibold text-white">
                                                                        {winner.studentName}
                                                                    </p>
                                                                    <p className="text-sm text-[#9aa0a6]">{badge.text}</p>
                                                                </div>
                                                                <div className="text-2xl font-bold text-blue-400">
                                                                    #{winner.rank}
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>

                                                {/* Single Poster for Event */}
                                                {group.poster && (
                                                    <div className="pt-6 border-t border-[#444746]">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <span className="text-sm font-medium text-[#9aa0a6] flex items-center gap-2">
                                                                <ImageIcon size={14} />
                                                                Event Results Poster
                                                            </span>
                                                            <a
                                                                href={group.poster}
                                                                download
                                                                className="inline-flex items-center gap-1 text-sm font-medium text-blue-400 hover:text-blue-300"
                                                            >
                                                                <Download size={14} />
                                                                Download
                                                            </a>
                                                        </div>
                                                        <div className="relative w-full h-64 rounded-3xl overflow-hidden bg-black/30">
                                                            <Image
                                                                src={group.poster}
                                                                alt="Event Results Poster"
                                                                fill
                                                                className="object-cover cursor-pointer hover:scale-105 transition-transform"
                                                                onClick={() => window.open(group.poster, "_blank")}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </motion.div>
                                        ))
                                    })()}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <div className="w-20 h-20 rounded-full bg-[#282a2c] flex items-center justify-center mb-4">
                                        <Trophy className="text-[#5f6368]" size={40} />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2">No Results Found</h3>
                                    <p className="text-[#9aa0a6] text-center max-w-md">
                                        {selectedEvent
                                            ? `No results have been announced for "${selectedEvent}" yet.`
                                            : "No results found for your search. Try a different query."}
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Trophy, Sparkles, Search, Download, ArrowRight, Grid3X3, Clock, Compass, Image as ImageIcon, Mic, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import Image from "next/image"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type Message = {
    id: string
    type: "bot" | "user"
    content: string
    timestamp: Date
    eventsList?: string[]
    results?: Array<{
        _id: string
        event: string
        category: string
        winners: Array<{
            rank: number
            studentName: string
        }>
        poster?: string
        posters?: string[]
    }>
}

const categories = [
    { id: "Alpha", label: "Alpha", icon: Compass },
    { id: "Beta", label: "Beta", icon: Trophy },
    { id: "Omega", label: "Omega", icon: Sparkles },
    { id: "General-A", label: "General A", icon: Grid3X3 },
    { id: "General-B", label: "General B", icon: Clock },
]

export function GeminiResultsInterface() {
    const [searchResults, setSearchResults] = useState<Message["results"]>([])
    const [eventsList, setEventsList] = useState<string[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string>("")
    const [selectedEvent, setSelectedEvent] = useState<string>("")
    const [isTyping, setIsTyping] = useState(false)
    const [searchType, setSearchType] = useState<'none' | 'category' | 'list'>('none')
    const [searchedQuery, setSearchedQuery] = useState("")

    const fetchResults = async (endpoint: string) => {
        try {
            const response = await fetch(endpoint)
            if (!response.ok) throw new Error("Failed to fetch")
            return await response.json()
        } catch (error) {
            console.error("Error fetching results:", error)
            return []
        }
    }

    const handleSearch = async (query: string, type: 'text' | 'category' | 'event' = 'text') => {
        if (!query.trim()) return

        const displayQuery = type === 'category' ? categories.find(c => c.id === query)?.label || query : query
        setSearchedQuery(displayQuery)
        setIsTyping(true)

        // Don't clear everything if we are just searching for an event within a category context
        if (type === 'category') {
            setSearchResults([])
        }

        let endpoint = `/api/results?search=${encodeURIComponent(query)}`
        let isCategorySearch = type === 'category'
        let currentCategory = selectedCategory

        // If explicitly category search, force endpoint
        if (type === 'category') {
            const categoryMatch = categories.find(c => c.id === query)
            endpoint = `/api/results?category=${encodeURIComponent(categoryMatch?.id || query)}`
            currentCategory = categoryMatch?.id || query
        } else if (type === 'event') {
            endpoint = `/api/results?search=${encodeURIComponent(query)}`
            // Ensure we filter by category if one is selected, though standard search might find it uniquely enough
            // But user asked for specific "category click -> event dropdown" flow.
            if (currentCategory) {
                endpoint += `&category=${encodeURIComponent(currentCategory)}`
            }
        }

        const results = await fetchResults(endpoint)

        setIsTyping(false)
        if (results.length > 0) {
            if (type === 'category') {
                const eventNames = Array.from(new Set(results.map((r: any) => r.event))) as string[]
                setEventsList(eventNames)
                // We don't change view to 'category' results grid, we just populated the dropdown
                setSearchType('none')
            } else {
                setSearchResults(results)
                setSearchType('list')
            }
        } else {
            if (type === 'category') {
                setEventsList([])
            } else {
                setSearchResults([])
            }
            // If event search failed
            if (type !== 'category') setSearchType('list')
        }
    }

    const handleCategoryChange = (val: string) => {
        setSelectedCategory(val)
        setSelectedEvent("")
        setEventsList([])
        setSearchResults([])
        setSearchType('none')
        handleSearch(val, 'category')
    }

    const handleEventChange = (val: string) => {
        setSelectedEvent(val)
        handleSearch(val, 'event')
    }

    const getRankEmoji = (rank: number) => {
        switch (rank) {
            case 1: return "🥇"
            case 2: return "🥈"
            case 3: return "🥉"
            default: return "🏅"
        }
    }

    const handleReset = () => {
        setSearchResults([])
        setEventsList([])
        setSelectedCategory("")
        setSelectedEvent("")
        setSearchType('none')
        setIsTyping(false)
    }

    return (
        <div className="w-full max-w-3xl mx-auto h-[600px] flex flex-col font-sans bg-white dark:bg-[#0E0E0E] border border-gray-200 dark:border-gray-800 shadow-2xl rounded-[32px] relative overflow-hidden ring-4 ring-gray-50 dark:ring-gray-900/50">

            {/* Header / Search Form Area */}
            <div className="bg-white/95 dark:bg-[#0E0E0E]/95 backdrop-blur-md z-40 p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col gap-4">

                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                        Results Finder
                    </h2>
                    {(selectedCategory || selectedEvent || searchType !== 'none') && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleReset}
                            className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 h-8 px-2 text-xs font-medium"
                        >
                            Reset
                        </Button>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                        <SelectTrigger className="w-full sm:w-[200px] h-12 rounded-xl bg-white dark:bg-black/40 border border-gray-200 dark:border-gray-800 ring-0 focus:ring-2 ring-blue-500/20 text-gray-900 dark:text-gray-100">
                            <SelectValue placeholder="Select Category" className="placeholder:text-gray-500 dark:placeholder:text-gray-400" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-[#1E1F20] border-gray-200 dark:border-gray-800">
                            {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id} className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-800 cursor-pointer">
                                    <span>{cat.label}</span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={selectedEvent} onValueChange={handleEventChange} disabled={!selectedCategory || eventsList.length === 0}>
                        <SelectTrigger className="flex-1 h-12 rounded-xl bg-white dark:bg-black/40 border border-gray-200 dark:border-gray-800 ring-0 focus:ring-2 ring-blue-500/20 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                            <SelectValue placeholder={!selectedCategory ? "Select Category first" : eventsList.length === 0 ? "No events found" : "Select Event"} className="placeholder:text-gray-500 dark:placeholder:text-gray-400" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-[#1E1F20] border-gray-200 dark:border-gray-800 max-h-[300px]">
                            {eventsList.map((event, idx) => (
                                <SelectItem key={idx} value={event} className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-800 cursor-pointer">
                                    {event}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col items-center p-0">

                {/* Initial State Placeholder */}
                {searchType === 'none' && !isTyping && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center h-full text-center p-8 opacity-50"
                    >
                        <div className="w-20 h-20 bg-gradient-to-tr from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mb-6">
                            <Sparkles className="w-8 h-8 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">
                            Ready to search
                        </h3>
                        <p className="text-sm text-gray-500 max-w-xs mx-auto">
                            Select a category to view available events.
                        </p>
                    </motion.div>
                )}

                {/* Loading State */}
                {isTyping && (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                        <div className="flex gap-1 h-6 items-center mb-4">
                            <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" />
                            <span className="w-3 h-3 bg-purple-500 rounded-full animate-bounce delay-75" />
                            <span className="w-3 h-3 bg-pink-500 rounded-full animate-bounce delay-150" />
                        </div>
                        <p className="text-sm text-gray-500">Searching...</p>
                    </div>
                )}

                {/* Results Display */}
                {!isTyping && searchType === 'list' && (
                    <div className="w-full max-w-4xl mx-auto px-4 py-6 pb-20">

                        {/* Header for Results */}
                        <div className="mb-6 px-2">
                            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                                Results for "{searchedQuery}"
                            </h3>
                        </div>

                        {/* List View: Results Cards */}
                        {searchResults && searchResults.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {searchResults?.map((result) => (
                                    <motion.div
                                        key={result._id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
                                    >
                                        <div className="p-5">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h4 className="font-bold text-gray-900 dark:text-gray-100">{result.event}</h4>
                                                    <span className="text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-2 py-0.5 rounded-full mt-1 inline-block">
                                                        {result.category}
                                                    </span>
                                                </div>
                                                {result.poster && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => window.open(result.poster, '_blank')}
                                                        className="text-gray-400 hover:text-purple-600"
                                                    >
                                                        <Download size={18} />
                                                    </Button>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                {result.winners.sort((a, b) => a.rank - b.rank).map((winner, idx) => (
                                                    <div key={idx} className="flex items-center gap-3">
                                                        <span className="text-lg">{getRankEmoji(winner.rank)}</span>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium text-sm text-gray-700 dark:text-gray-300 truncate">
                                                                {winner.studentName}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Posters Grid */}
                                            {result.posters && result.posters.length > 0 ? (
                                                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                                    {result.posters.map((posterUrl, pIdx) => (
                                                        <div
                                                            key={pIdx}
                                                            className="relative aspect-[4/5] rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 group cursor-pointer"
                                                            onClick={async (e) => {
                                                                e.stopPropagation();
                                                                try {
                                                                    const response = await fetch(posterUrl);
                                                                    const blob = await response.blob();
                                                                    const url = window.URL.createObjectURL(blob);
                                                                    const link = document.createElement('a');
                                                                    link.href = url;
                                                                    link.download = `Optimus-Poster-${result.event.replace(/\s+/g, '-')}-${pIdx + 1}.png`;
                                                                    document.body.appendChild(link);
                                                                    link.click();
                                                                    document.body.removeChild(link);
                                                                    window.URL.revokeObjectURL(url);
                                                                } catch (error) {
                                                                    console.error("Download failed:", error);
                                                                    window.open(posterUrl, '_blank');
                                                                }
                                                            }}
                                                        >
                                                            <img src={posterUrl} alt={`Poster ${pIdx + 1}`} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110" />
                                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                                            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full shadow-lg">
                                                                    <Download size={14} />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : result.poster ? (
                                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                                    <div
                                                        className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 group cursor-pointer"
                                                        onClick={async (e) => {
                                                            e.stopPropagation();
                                                            try {
                                                                const response = await fetch(result.poster!);
                                                                const blob = await response.blob();
                                                                const url = window.URL.createObjectURL(blob);
                                                                const link = document.createElement('a');
                                                                link.href = url;
                                                                link.download = `Optimus-Poster-${result.event.replace(/\s+/g, '-')}.png`;
                                                                document.body.appendChild(link);
                                                                link.click();
                                                                document.body.removeChild(link);
                                                                window.URL.revokeObjectURL(url);
                                                            } catch (error) {
                                                                console.error("Download failed:", error);
                                                                window.open(result.poster!, '_blank');
                                                            }
                                                        }}
                                                    >
                                                        <img src={result.poster} alt="Event Poster" className="object-cover w-full h-full" />
                                                        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Button variant="secondary" size="icon" className="h-10 w-10 rounded-full shadow-xl">
                                                                <Download size={18} />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : null}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {/* Empty State */}
                        {searchType === 'list' && (!searchResults || searchResults.length === 0) && (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No results found for "{searchedQuery}".</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

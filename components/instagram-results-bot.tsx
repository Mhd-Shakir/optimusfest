"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Trophy, Sparkles, Search, Download, ArrowRight, Grid3X3, Clock, Compass, Image as ImageIcon, Mic, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import Image from "next/image"

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
    const [messages, setMessages] = useState<Message[]>([])
    const [inputValue, setInputValue] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isTyping])

    const addBotMessage = (content: string, results?: Message["results"], eventsList?: string[]) => {
        const newMessage: Message = {
            id: Date.now().toString(),
            type: "bot",
            content,
            timestamp: new Date(),
            results,
            eventsList,
        }
        setMessages((prev) => [...prev, newMessage])
    }

    const addUserMessage = (content: string) => {
        const newMessage: Message = {
            id: Date.now().toString(),
            type: "user",
            content,
            timestamp: new Date(),
        }
        setMessages((prev) => [...prev, newMessage])
    }

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

        addUserMessage(query)
        setInputValue("")
        setIsTyping(true)

        // Determine if it's a category search or text search
        let endpoint = `/api/results?search=${encodeURIComponent(query)}`

        // If it's a category search (either explicit type or detected)
        let isCategorySearch = type === 'category'
        if (type === 'text') {
            const categoryMatch = categories.find(c => c.id.toLowerCase() === query.toLowerCase() || c.label.toLowerCase() === query.toLowerCase())
            if (categoryMatch) {
                endpoint = `/api/results?category=${encodeURIComponent(categoryMatch.id)}`
                isCategorySearch = true
                query = categoryMatch.label // Normalize query to label for nicer display
            }
        } else if (type === 'category') {
            const categoryMatch = categories.find(c => c.id === query)
            endpoint = `/api/results?category=${encodeURIComponent(categoryMatch?.id || query)}`
            if (categoryMatch) query = categoryMatch.label
        }


        const results = await fetchResults(endpoint)

        setTimeout(() => {
            setIsTyping(false)
            if (results.length === 0) {
                addBotMessage(`I couldn't find any results for "${query}". \nTry checking the spelling or browse by category.`)
            } else {
                if (isCategorySearch) {
                    // Extract unique event names
                    const eventNames = Array.from(new Set(results.map((r: any) => r.event))) as string[]
                    addBotMessage(
                        `I found ${eventNames.length} events in ${query}. Which one would you like to check?`,
                        undefined, // Don't show results yet
                        eventNames // Show event list
                    )
                } else {
                    // Show actual results (Event Detail)
                    addBotMessage(
                        `Here are the results for "${results[0]?.event || query}"`,
                        results
                    )
                }
            }
        }, 800)
    }

    const handleCategoryClick = (categoryId: string) => {
        handleSearch(categoryId, 'category')
    }

    const handleEventClick = (eventName: string) => {
        handleSearch(eventName, 'event')
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
        setMessages([])
        setInputValue("")
        setIsTyping(false)
    }

    const isHome = messages.length === 0

    return (

        <div className="w-full max-w-3xl mx-auto h-[600px] flex flex-col font-sans bg-white dark:bg-[#0E0E0E] border border-gray-200 dark:border-gray-800 shadow-2xl rounded-[32px] relative overflow-hidden ring-4 ring-gray-50 dark:ring-gray-900/50">

            {/* Back Button */}
            {!isHome && (
                <div className="absolute top-6 left-6 z-50">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleReset}
                        className="rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-md hover:bg-white dark:hover:bg-black border border-gray-200 dark:border-gray-800 shadow-sm transition-all"
                    >
                        <ArrowLeft size={20} className="text-gray-700 dark:text-gray-200" />
                    </Button>
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col items-center pt-12">

                {/* Greeting & Categories Area (Always Visible) */}
                <div className={cn("transition-all duration-500 w-full", !isHome && "opacity-60 scale-95 origin-top mb-4")}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-start w-full px-8 mb-12"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#4285F4] via-[#9B72CB] to-[#D96570] leading-tight tracking-tight mb-2">
                            Hello there
                        </h1>
                        <h2 className="text-2xl md:text-3xl font-medium text-[#C4C7C5] dark:text-[#444746]">
                            How can I help today?
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:flex gap-3 mb-8 px-6 w-full md:w-fit max-w-full mx-auto">
                        {categories.map((cat, idx) => (
                            <motion.button
                                key={cat.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                onClick={() => handleCategoryClick(cat.id)}
                                className="h-12 w-full md:min-w-[140px] md:w-auto p-3 rounded-xl bg-[#F0F4F9] dark:bg-[#1E1F20] hover:bg-[#E1E5EA] dark:hover:bg-[#333537] text-left flex items-center justify-between transition-colors group relative overflow-hidden border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                            >
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
                                    {cat.label}
                                </span>
                                <div className="bg-white dark:bg-black/20 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ArrowRight size={10} />
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Chat History (Results) */}
                <div className="w-full max-w-4xl mx-auto px-4 py-4 space-y-8 pb-32">
                    {messages.map((message) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn("flex flex-col gap-4", message.type === "user" ? "items-end" : "items-start")}
                        >
                            {/* User Query Bubble (Minimal) */}
                            {message.type === "user" && (
                                <h3 className="text-2xl md:text-3xl font-medium text-gray-800 dark:text-gray-200">
                                    {message.content}
                                </h3>
                            )}

                            {/* Bot Response */}
                            {message.type === "bot" && (
                                <div className="w-full space-y-6">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center shrink-0 mt-1">
                                            <Sparkles className="text-white" size={14} />
                                        </div>
                                        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed pt-1">
                                            {message.content}
                                        </p>
                                    </div>

                                    {/* Event List (Category View) */}
                                    {message.eventsList && (
                                        <div className="flex flex-wrap gap-2 pl-0 md:pl-11">
                                            {message.eventsList.map((eventName, idx) => (
                                                <motion.button
                                                    key={idx}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    onClick={() => handleEventClick(eventName)}
                                                    className="px-4 py-2 bg-white dark:bg-[#1E1F20] border border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-500 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors shadow-sm hover:shadow"
                                                >
                                                    {eventName}
                                                </motion.button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Results Grid (Event Detail View) */}
                                    {message.results && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-0 md:pl-11">
                                            {message.results.map((result) => (
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
                                                                        <Button
                                                                            variant="secondary"
                                                                            size="icon"
                                                                            className="absolute bottom-2 right-2 h-8 w-8 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0"
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
                                                                            <Download size={14} />
                                                                        </Button>
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
                                                                    <Button
                                                                        variant="secondary"
                                                                        size="icon"
                                                                        className="absolute bottom-3 right-3 h-10 w-10 rounded-full shadow-xl"
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
                                                                        <Download size={18} />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    ))}

                    {isTyping && (
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                                <Sparkles className="text-white" size={14} />
                            </div>
                            <div className="flex gap-1 h-6 items-center">
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75" />
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area (Absolute Bottom for Box) */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-[#0E0E0E]/90 backdrop-blur-md z-50">
                <div className="w-full">
                    <div className="relative bg-[#F0F4F9] dark:bg-[#1E1F20] rounded-full flex items-center px-2 py-1.5 transition-all hover:bg-[#E1E5EA] dark:hover:bg-[#333537] ring-1 ring-transparent focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-blue-900 group">

                        {/* Left Icon (Image) */}
                        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-full h-9 w-9 shrink-0">
                            <ImageIcon size={18} />
                        </Button>

                        <Input
                            ref={inputRef}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch(inputValue)}
                            placeholder={isHome ? "Search results..." : "Ask follow up..."}
                            className="flex-1 border-0 shadow-none focus-visible:ring-0 bg-transparent text-base text-gray-800 dark:text-gray-200 h-10 px-2 placeholder:text-gray-500"
                        />

                        <div className="flex items-center gap-0.5">
                            {/* Mic Icon */}
                            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-full h-9 w-9 shrink-0">
                                <Mic size={18} />
                            </Button>

                            {/* Send Icon */}
                            {inputValue.trim() && (
                                <Button
                                    onClick={() => handleSearch(inputValue)}
                                    size="icon"
                                    className="bg-transparent hover:bg-gray-200 dark:hover:bg-[#444746] text-[#004A77] dark:text-[#A8C7FA] rounded-full h-9 w-9 shrink-0 transition-colors"
                                >
                                    <Send size={18} />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

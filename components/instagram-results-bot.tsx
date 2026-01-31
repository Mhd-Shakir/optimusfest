"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Trophy, Award, Sparkles, ChevronRight, Search, Download, ImageIcon, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import Image from "next/image"

type Message = {
    id: string
    type: "bot" | "user"
    content: string
    timestamp: Date
    options?: Array<{ id: string; label: string; icon?: React.ReactNode }>
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

const categories = ["Alpha", "Beta", "Omega", "General-A", "General-B"]

export function InstagramResultsBot() {
    const [messages, setMessages] = useState<Message[]>([])
    const [inputValue, setInputValue] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isTyping])

    useEffect(() => {
        // Welcome message
        setTimeout(() => {
            addBotMessage(
                "Hey! 👋 Welcome to Optimus Results Bot\n\nI can help you find competition results! What would you like to do?",
                [
                    { id: "search", label: "🔍 Search by Name" },
                    { id: "category", label: "📂 Browse by Category" },
                    { id: "all", label: "🏆 View All Results" },
                ]
            )
        }, 500)
    }, [])

    const addBotMessage = (content: string, options?: Message["options"], results?: Message["results"]) => {
        const newMessage: Message = {
            id: Date.now().toString(),
            type: "bot",
            content,
            timestamp: new Date(),
            options,
            results,
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

    const handleOptionClick = async (optionId: string) => {
        if (optionId === "search") {
            addUserMessage("🔍 Search by Name")
            setIsTyping(true)
            setTimeout(() => {
                setIsTyping(false)
                addBotMessage("Type the student name to search for results 👇")
            }, 800)
        } else if (optionId === "category") {
            addUserMessage("📂 Browse by Category")
            setIsTyping(true)
            setTimeout(() => {
                setIsTyping(false)
                addBotMessage(
                    "Select a category:",
                    categories.map((cat) => ({ id: `cat-${cat}`, label: cat }))
                )
            }, 800)
        } else if (optionId === "all") {
            addUserMessage("🏆 View All Results")
            setIsTyping(true)
            const results = await fetchResults("/api/results")
            setTimeout(() => {
                setIsTyping(false)
                if (results.length === 0) {
                    addBotMessage("No results found yet! 😔\n\nCheck back later once results are announced.")
                } else {
                    addBotMessage(`Found results for ${results.length} events! 🎉`, undefined, results)
                }
                setTimeout(() => {
                    addBotMessage("What else can I help you with?", [
                        { id: "search", label: "🔍 Search Again" },
                        { id: "category", label: "📂 Browse Categories" },
                    ])
                }, 1000)
            }, 1000)
        } else if (optionId.startsWith("cat-")) {
            const category = optionId.replace("cat-", "")
            addUserMessage(category)
            setIsTyping(true)
            const results = await fetchResults(`/api/results?category=${encodeURIComponent(category)}`)
            setTimeout(() => {
                setIsTyping(false)
                if (results.length === 0) {
                    addBotMessage(`No results found in ${category} category yet! 😔`)
                } else {
                    addBotMessage(`Here are the results for ${category} category! 🎯`, undefined, results)
                }
                setTimeout(() => {
                    addBotMessage("Want to check another category?", [
                        { id: "category", label: "📂 Browse Categories" },
                        { id: "search", label: "🔍 Search by Name" },
                    ])
                }, 1000)
            }, 1000)
        } else if (optionId === "back") {
            addUserMessage("🔙 Back to Start")
            setIsTyping(true)
            setTimeout(() => {
                setIsTyping(false)
                addBotMessage("What would you like to do?", [
                    { id: "search", label: "🔍 Search by Name" },
                    { id: "category", label: "📂 Browse by Category" },
                    { id: "all", label: "🏆 View All Results" },
                ])
            }, 500)
        }
    }

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return

        const query = inputValue.trim()
        addUserMessage(query)
        setInputValue("")
        setIsTyping(true)

        const results = await fetchResults(`/api/results?search=${encodeURIComponent(query)}`)

        setTimeout(() => {
            setIsTyping(false)
            if (results.length === 0) {
                addBotMessage(`Couldn't find any results for "${query}" 😔\n\nTry searching with a different name or browse by category!`, [
                    { id: "search", label: "🔍 Search Again" },
                    { id: "category", label: "📂 Browse Categories" },
                ])
            } else {
                addBotMessage(
                    `Found ${results.length} event${results.length > 1 ? "s" : ""} matching "${query}"! 🎉`,
                    undefined,
                    results
                )
                setTimeout(() => {
                    addBotMessage("What else can I help you with?", [
                        { id: "search", label: "🔍 Search Again" },
                        { id: "category", label: "📂 Browse Categories" },
                    ])
                }, 1000)
            }
        }, 1000)
    }

    const getRankEmoji = (rank: number) => {
        switch (rank) {
            case 1: return "🥇"
            case 2: return "🥈"
            case 3: return "🥉"
            default: return "🏅"
        }
    }

    const getRankColor = (rank: number) => {
        switch (rank) {
            case 1: return "from-yellow-400 to-yellow-600"
            case 2: return "from-gray-300 to-gray-500"
            case 3: return "from-orange-400 to-orange-600"
            default: return "from-blue-400 to-blue-600"
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            {/* Instagram-style Chat Container */}
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 ring-1 ring-white/20">
                {/* Gradient Header - Instagram Style */}
                <div className="relative bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 p-6 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-16 -mt-16" />

                    <div className="relative flex items-center gap-4">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-white to-gray-200 p-1 shadow-xl">
                                <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                                    <Trophy className="text-white" size={28} />
                                </div>
                            </div>
                            <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-extrabold text-white text-xl tracking-tight flex items-center gap-2">
                                Optimus Results Bot
                                <Sparkles size={16} className="text-yellow-300 animate-pulse" />
                            </h3>
                            <div className="flex items-center gap-1.5">
                                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                <p className="text-white/80 text-xs font-medium uppercase tracking-widest">Active Now</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Messages Area - Instagram Style */}
                <div className="h-[650px] overflow-y-auto bg-[#FAFAFA] dark:bg-[#0A0A0A] p-6 space-y-6 scrollbar-hide">
                    <AnimatePresence>
                        {messages.map((message) => (
                            <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className={cn("flex", message.type === "user" ? "justify-end" : "justify-start")}
                            >
                                <div className={cn("max-w-[90%] space-y-3")}>
                                    {/* Message Bubble */}
                                    <div
                                        className={cn(
                                            "rounded-[1.75rem] px-6 py-4 shadow-md",
                                            message.type === "user"
                                                ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-br-sm ml-auto"
                                                : "bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-bl-sm"
                                        )}
                                    >
                                        <p
                                            className={cn(
                                                "whitespace-pre-line text-[0.95rem] leading-relaxed font-medium",
                                                message.type === "bot" ? "text-gray-800 dark:text-gray-100" : "text-white"
                                            )}
                                        >
                                            {message.content}
                                        </p>
                                        <p
                                            className={cn(
                                                "text-[0.65rem] mt-2 font-bold uppercase tracking-wider opacity-60",
                                                message.type === "user" ? "text-white" : "text-gray-400"
                                            )}
                                        >
                                            {message.timestamp.toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>

                                    {/* Options */}
                                    {message.options && (
                                        <div className="grid grid-cols-1 gap-2">
                                            {message.options.map((option) => (
                                                <motion.button
                                                    key={option.id}
                                                    whileHover={{ scale: 1.02, x: 5 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => handleOptionClick(option.id)}
                                                    className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-900 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 rounded-2xl p-4 text-left transition-all duration-300 group shadow-sm flex items-center justify-between"
                                                >
                                                    <span className="font-bold text-gray-700 dark:text-gray-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                                        {option.label}
                                                    </span>
                                                    <ChevronRight
                                                        className="text-purple-400 group-hover:text-purple-600 dark:group-hover:text-purple-400"
                                                        size={18}
                                                    />
                                                </motion.button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Results Display */}
                                    {message.results && (
                                        <div className="space-y-4 pt-2">
                                            {message.results.map((result) => (
                                                <motion.div
                                                    key={result._id}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800"
                                                >
                                                    {/* Card Header */}
                                                    <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900 p-5 border-b border-gray-100 dark:border-gray-800">
                                                        <div className="flex items-center justify-between gap-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                                                    <Trophy size={20} />
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-extrabold text-foreground text-sm uppercase tracking-tight">{result.event}</h4>
                                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{result.category} Category</p>
                                                                </div>
                                                            </div>
                                                            <Award className="text-pink-500/30" size={24} />
                                                        </div>
                                                    </div>

                                                    {/* Card Content - Winners List */}
                                                    <div className="p-5 space-y-3">
                                                        {result.winners.sort((a, b) => a.rank - b.rank).map((winner, idx) => (
                                                            <div key={idx} className="flex items-center gap-4 bg-gray-50 dark:bg-black/20 p-3 rounded-2xl border border-gray-100 dark:border-gray-800/50">
                                                                <div className={cn(
                                                                    "w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-lg ring-2 ring-white dark:ring-gray-800",
                                                                    getRankColor(winner.rank)
                                                                )}>
                                                                    {getRankEmoji(winner.rank)}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="font-bold text-gray-800 dark:text-gray-100 truncate">{winner.studentName}</p>
                                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                                                                        {winner.rank === 1 ? 'First Place' : winner.rank === 2 ? 'Second Place' : winner.rank === 3 ? 'Third Place' : `${winner.rank}th Place`}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Card Footer - Poster Preview */}
                                                    {/* Card Footer - Poster Preview */}
                                                    {(result.posters && result.posters.length > 0) ? (
                                                        <div className="px-5 pb-5">
                                                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
                                                                {result.posters.map((posterUrl, pIdx) => (
                                                                    <div key={pIdx} className="snap-center shrink-0 w-48 relative group/poster cursor-pointer" onClick={() => window.open(posterUrl, '_blank')}>
                                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/poster:opacity-100 transition-opacity z-10 flex items-end justify-center p-4">
                                                                            <Button variant="secondary" size="sm" className="rounded-full font-bold text-[10px] h-7">
                                                                                View
                                                                            </Button>
                                                                        </div>
                                                                        <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden shadow-inner bg-gray-100 dark:bg-gray-800 border border-gray-100 dark:border-gray-800">
                                                                            <Image src={posterUrl} alt={`Poster ${pIdx + 1}`} fill className="object-cover group-hover/poster:scale-105 transition-transform duration-700" />
                                                                        </div>
                                                                        <div className="absolute top-2 left-2 bg-black/50 text-white text-[8px] px-2 py-0.5 rounded-full font-bold backdrop-blur-md">
                                                                            {pIdx === 0 ? "1st" : pIdx === 1 ? "2nd" : "3rd"}
                                                                        </div>
                                                                        <div className="absolute top-2 right-2 z-20">
                                                                            <a
                                                                                href={posterUrl}
                                                                                download
                                                                                className="w-6 h-6 rounded-full bg-white/90 dark:bg-black/90 flex items-center justify-center text-gray-800 dark:text-white shadow-lg backdrop-blur-sm"
                                                                                onClick={(e) => e.stopPropagation()}
                                                                            >
                                                                                <Download size={10} />
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ) : result.poster ? (
                                                        <div className="px-5 pb-5">
                                                            <div className="relative group/poster cursor-pointer" onClick={() => window.open(result.poster, '_blank')}>
                                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/poster:opacity-100 transition-opacity z-10 flex items-end justify-center p-4">
                                                                    <Button variant="secondary" size="sm" className="rounded-full font-bold">
                                                                        View Poster
                                                                    </Button>
                                                                </div>
                                                                <div className="relative w-full h-48 rounded-2xl overflow-hidden shadow-inner bg-gray-100 dark:bg-gray-800 border border-gray-100 dark:border-gray-800">
                                                                    <Image src={result.poster} alt="Result Poster" fill className="object-cover group-hover/poster:scale-105 transition-transform duration-700" />
                                                                </div>
                                                                <div className="absolute top-3 right-3 z-20">
                                                                    <a
                                                                        href={result.poster}
                                                                        download
                                                                        className="w-8 h-8 rounded-full bg-white/90 dark:bg-black/90 flex items-center justify-center text-gray-800 dark:text-white shadow-lg backdrop-blur-sm"
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    >
                                                                        <Download size={14} />
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : null}
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Typing Indicator */}
                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex justify-start"
                        >
                            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl rounded-bl-sm px-6 py-4 shadow-md">
                                <div className="flex gap-1.5">
                                    {[0, 1, 2].map((i) => (
                                        <motion.div
                                            key={i}
                                            animate={{ y: [0, -6, 0] }}
                                            transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                                            className={cn(
                                                "w-2.5 h-2.5 rounded-full",
                                                i === 0 ? "bg-purple-500" : i === 1 ? "bg-pink-500" : "bg-orange-500"
                                            )}
                                        />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    <div ref={messagesEndRef} className="h-4" />
                </div>

                {/* Input Area - Instagram Style */}
                <div className="border-t border-gray-100 dark:border-gray-900 bg-white dark:bg-[#0A0A0A] p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex-1 relative group">
                            <Input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                                placeholder="Search student name or event..."
                                className="rounded-full border-2 border-gray-100 dark:border-gray-800 focus:border-purple-500 dark:focus:border-purple-500 pl-14 pr-4 h-16 bg-gray-50 dark:bg-black/40 text-[0.95rem] font-medium transition-all"
                            />
                            <Search
                                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors"
                                size={22}
                            />
                        </div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                onClick={handleSendMessage}
                                disabled={!inputValue.trim()}
                                className="rounded-full w-14 h-14 p-0 bg-gradient-to-r from-purple-600 to-pink-500 hover:shadow-lg shadow-purple-500/20"
                            >
                                <Send size={22} />
                            </Button>
                        </motion.div>
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-4 opacity-40">
                        <User size={10} className="text-gray-400" />
                        <p className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-gray-400">
                            Official Optimus Arts Fest Results Bot
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

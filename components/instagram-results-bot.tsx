"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Trophy, Award, Sparkles, ChevronRight, Search, Download, ImageIcon } from "lucide-react"
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
        studentName: string
        event: string
        category: string
        rank: number
        score?: number
        poster?: string
    }>
}

const categories = ["Alpha", "Beta", "Omega"]

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
                    addBotMessage(`Found ${results.length} results! 🎉`, undefined, results)
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
                    `Found ${results.length} result${results.length > 1 ? "s" : ""} for "${query}"! 🎉`,
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
            case 1:
                return "🥇"
            case 2:
                return "🥈"
            case 3:
                return "🥉"
            default:
                return "🏅"
        }
    }

    const getRankColor = (rank: number) => {
        switch (rank) {
            case 1:
                return "from-yellow-400 to-yellow-600"
            case 2:
                return "from-gray-300 to-gray-500"
            case 3:
                return "from-orange-400 to-orange-600"
            default:
                return "from-blue-400 to-blue-600"
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            {/* Instagram-style Chat Container */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border/50">
                {/* Gradient Header - Instagram Style */}
                <div className="relative bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 p-6">
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="relative flex items-center gap-4">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-white to-gray-100 p-1">
                                <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                                    <Trophy className="text-white" size={28} />
                                </div>
                            </div>
                            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-white text-xl flex items-center gap-2">
                                Optimus Results Bot
                                <Sparkles size={18} className="text-yellow-300" />
                            </h3>
                            <p className="text-white/90 text-sm">Active now</p>
                        </div>
                    </div>
                </div>

                {/* Messages Area - Instagram Style */}
                <div className="h-[600px] overflow-y-auto bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 p-6 space-y-4">
                    <AnimatePresence>
                        {messages.map((message) => (
                            <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className={cn("flex", message.type === "user" ? "justify-end" : "justify-start")}
                            >
                                <div className={cn("max-w-[85%] space-y-3")}>
                                    {/* Message Bubble */}
                                    <div
                                        className={cn(
                                            "rounded-3xl px-5 py-3 shadow-lg",
                                            message.type === "user"
                                                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-md ml-auto"
                                                : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-bl-md"
                                        )}
                                    >
                                        <p
                                            className={cn(
                                                "whitespace-pre-line text-sm leading-relaxed",
                                                message.type === "bot" ? "text-foreground" : "text-white"
                                            )}
                                        >
                                            {message.content}
                                        </p>
                                        <div
                                            className={cn(
                                                "text-xs mt-2",
                                                message.type === "user" ? "text-white/80" : "text-muted-foreground"
                                            )}
                                        >
                                            {message.timestamp.toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </div>
                                    </div>

                                    {/* Options */}
                                    {message.options && (
                                        <div className="space-y-2">
                                            {message.options.map((option) => (
                                                <motion.button
                                                    key={option.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.1 }}
                                                    onClick={() => handleOptionClick(option.id)}
                                                    className="w-full bg-white dark:bg-gray-800 border-2 border-purple-500/30 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950/30 rounded-2xl p-4 text-left transition-all duration-200 group shadow-sm flex items-center justify-between"
                                                >
                                                    <span className="font-semibold text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                                        {option.label}
                                                    </span>
                                                    <ChevronRight
                                                        className="text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        size={20}
                                                    />
                                                </motion.button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Results Display */}
                                    {message.results && message.results.length > 0 && (
                                        <div className="space-y-3">
                                            {message.results.map((result) => (
                                                <motion.div
                                                    key={result._id}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: 0.1 }}
                                                    className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div
                                                            className={cn(
                                                                "w-14 h-14 rounded-full bg-gradient-to-br flex items-center justify-center text-2xl shadow-lg flex-shrink-0",
                                                                getRankColor(result.rank)
                                                            )}
                                                        >
                                                            {getRankEmoji(result.rank)}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-bold text-foreground text-lg mb-1">
                                                                {result.studentName}
                                                            </h4>
                                                            <div className="space-y-1 text-sm text-muted-foreground">
                                                                <p className="flex items-center gap-2">
                                                                    <Trophy size={14} className="text-purple-500" />
                                                                    <span className="font-medium">{result.event}</span>
                                                                </p>
                                                                <p className="flex items-center gap-2">
                                                                    <Award size={14} className="text-pink-500" />
                                                                    <span>{result.category} Category</span>
                                                                </p>
                                                                {result.score && (
                                                                    <p className="flex items-center gap-2">
                                                                        <Sparkles size={14} className="text-orange-500" />
                                                                        <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
                                                                            {result.score} pts
                                                                        </span>
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                                                #{result.rank}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Poster Display */}
                                                    {result.poster && (
                                                        <div className="mt-4 pt-4 border-t border-border/50">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <span className="text-xs font-medium flex items-center gap-1 text-muted-foreground">
                                                                    <ImageIcon size={12} />
                                                                    Result Poster
                                                                </span>
                                                                <a
                                                                    href={result.poster}
                                                                    download
                                                                    className="inline-flex items-center gap-1 text-xs font-medium text-purple-600 hover:text-purple-700"
                                                                >
                                                                    <Download size={12} />
                                                                    Download
                                                                </a>
                                                            </div>
                                                            <div className="relative w-full h-32 rounded-lg overflow-hidden bg-secondary">
                                                                <Image
                                                                    src={result.poster}
                                                                    alt="Result Poster"
                                                                    fill
                                                                    className="object-cover cursor-pointer hover:scale-105 transition-transform"
                                                                    onClick={() => window.open(result.poster, '_blank')}
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
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
                            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl rounded-bl-md px-5 py-3 shadow-lg">
                                <div className="flex gap-1">
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                                        className="w-2 h-2 bg-purple-500 rounded-full"
                                    />
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                                        className="w-2 h-2 bg-pink-500 rounded-full"
                                    />
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                                        className="w-2 h-2 bg-orange-500 rounded-full"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area - Instagram Style */}
                <div className="border-t border-border/50 bg-white dark:bg-gray-900 p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex-1 relative">
                            <Input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                                placeholder="Search for student name..."
                                className="rounded-full border-2 border-purple-500/30 focus:border-purple-500 pl-12 pr-4 py-6 bg-gray-50 dark:bg-gray-800"
                            />
                            <Search
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                                size={20}
                            />
                        </div>
                        <Button
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim()}
                            size="lg"
                            className="rounded-full w-12 h-12 p-0 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg"
                        >
                            <Send size={20} />
                        </Button>
                    </div>
                    <p className="text-xs text-center text-muted-foreground mt-3">
                        Powered by Optimus Arts Fest • Results updated in real-time
                    </p>
                </div>
            </div>
        </div>
    )
}

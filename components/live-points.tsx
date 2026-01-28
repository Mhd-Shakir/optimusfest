"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TrendingUp } from "lucide-react"

interface TeamPoint {
    teamName: string
    points: number
}

export function LivePoints() {
    const [points, setPoints] = useState<TeamPoint[]>([])
    const [loading, setLoading] = useState(true)

    const fetchPoints = async () => {
        try {
            const response = await fetch("/api/points")
            if (!response.ok) throw new Error("Failed to fetch")
            const data = await response.json()
            setPoints(data)
        } catch (error) {
            console.error("Failed to fetch points")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPoints()
        const interval = setInterval(fetchPoints, 30000)
        return () => clearInterval(interval)
    }, [])

    if (loading || points.length === 0) return null

    // Sort teams by points descending
    const sortedTeams = [...points].sort((a, b) => b.points - a.points)

    return (
        <section className="py-8 relative">
            <div className="container mx-auto px-4 max-w-3xl">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="flex items-center gap-2 mb-4 px-2"
                >
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50 whitespace-nowrap">Live Standings</span>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />
                </motion.div>

                <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                        {sortedTeams.map((team, index) => (
                            <motion.div
                                key={team.teamName}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 30,
                                    delay: index * 0.1
                                }}
                                className="relative"
                            >
                                <div className="glass rounded-2xl p-4 sm:p-5 border border-white/10 group hover:border-primary/30 transition-all duration-300">
                                    {/* Background Accent */}
                                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl bg-gradient-to-b ${team.teamName === "Auris" ? "from-blue-500 to-cyan-500" : "from-purple-500 to-pink-500"
                                        }`} />

                                    <div className="flex items-center justify-between">
                                        {/* Left Side: Points */}
                                        <div className="flex items-baseline gap-2">
                                            <span className={`text-3xl sm:text-4xl font-black bg-gradient-to-r ${team.teamName === "Auris" ? "from-blue-500 to-cyan-500" : "from-purple-500 to-pink-500"
                                                } bg-clip-text text-transparent`}>
                                                {team.points.toLocaleString()}
                                            </span>
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Points</span>
                                        </div>

                                        {/* Right Side: Team Name with Dot */}
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2.5 h-2.5 rounded-full ${index === 0 ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"}`} />
                                            <span className="text-xl sm:text-2xl font-bold tracking-tight">
                                                {team.teamName}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    )
}

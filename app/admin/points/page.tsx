"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Loader2, Save, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface TeamPoint {
    teamName: string
    points: number
}

export default function AdminPointsPage() {
    const [points, setPoints] = useState<TeamPoint[]>([])
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState<string | null>(null)
    const { toast } = useToast()

    useEffect(() => {
        fetchPoints()
    }, [])

    const fetchPoints = async () => {
        try {
            const response = await fetch("/api/points")
            if (!response.ok) throw new Error("Failed to fetch")
            const data = await response.json()
            setPoints(data)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load points",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleUpdate = async (teamName: string, newPoints: number) => {
        if (isNaN(newPoints)) {
            toast({
                title: "Invalid Input",
                description: "Please enter a valid number",
                variant: "destructive",
            })
            return
        }

        setUpdating(teamName)
        try {
            const response = await fetch("/api/admin/points", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ teamName, points: newPoints }),
            })

            if (!response.ok) throw new Error("Failed to update points")

            toast({
                title: "Success",
                description: `${teamName} points updated successfully`,
            })
            fetchPoints()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update points",
                variant: "destructive",
            })
        } finally {
            setUpdating(null)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 py-12 px-4">
            <div className="container mx-auto max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-2">
                        <span className="gradient-text">Live Points Management</span>
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Update live points for Auris and Libras teams
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                    {points.map((team) => (
                        <motion.div
                            key={team.teamName}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <Card className="glass border-accent/20 overflow-hidden relative">
                                <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${team.teamName === "Auris" ? "from-blue-500 to-cyan-500" : "from-purple-500 to-pink-500"}`} />
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg bg-gradient-to-br ${team.teamName === "Auris" ? "from-blue-500 to-cyan-500" : "from-purple-500 to-pink-500"}`}>
                                            <Trophy size={20} className="text-white" />
                                        </div>
                                        <CardTitle className="text-2xl">{team.teamName}</CardTitle>
                                    </div>
                                    <CardDescription>Current Points: {team.points}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor={`points-${team.teamName}`}>Update Points</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                id={`points-${team.teamName}`}
                                                type="number"
                                                defaultValue={team.points}
                                                className="text-lg font-bold"
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        const val = parseInt((e.target as HTMLInputElement).value)
                                                        handleUpdate(team.teamName, val)
                                                    }
                                                }}
                                            />
                                            <Button
                                                onClick={() => {
                                                    const input = document.getElementById(`points-${team.teamName}`) as HTMLInputElement
                                                    handleUpdate(team.teamName, parseInt(input.value))
                                                }}
                                                disabled={updating === team.teamName}
                                                className="gap-2"
                                            >
                                                {updating === team.teamName ? (
                                                    <Loader2 size={16} className="animate-spin" />
                                                ) : (
                                                    <Save size={16} />
                                                )}
                                                Update
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}

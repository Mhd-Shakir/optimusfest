"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Trash2, Trophy, Search, X, Sparkles, Download, ImageIcon, Upload, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import Image from "next/image"
import eventsData from "@/lib/events-data.json"
import { generateEventPoster, generatePosterVariations, generateResultNumber, EventResultData } from "@/lib/poster-template-generator"

const categoryTemplates: Record<string, string> = {
    "Alpha": "/opt_result_1.png",
    "Beta": "/opt_result_2.png",
    "Omega": "/opt_result_3.png",
    "General-A": "/opt_result_4.png",
    "General-B": "/opt_result_4.png",
}

type StudentWinner = {
    studentName: string
    rank: number
}

type Result = {
    _id: string
    event: string
    category: string

    winners: StudentWinner[]
    posters?: string[] // Added
    poster?: string
    createdAt: string
    updatedAt: string
}

const categories = ["Alpha", "Beta", "Omega", "General-A", "General-B"]

const categoryMap = {
    "Alpha": "ALPHA CATEGORY (JUNIOR DA'WA)",
    "Beta": "BETA CATEGORY (HS1 - BS 1)",
    "Omega": "OMEGA CATEGORY (BS 2 - BS 5)",
    "General-A": "GENARAL CATEGORY-A (JUNIOR DA'WA)",
    "General-B": "GENARAL CATEGORY-B (SENIOR DA'WA)",
}

export default function AdminResultsPage() {
    const [results, setResults] = useState<Result[]>([])
    const [filteredResults, setFilteredResults] = useState<Result[]>([])
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [filterCategory, setFilterCategory] = useState<string>("all")

    // Form state
    const [selectedCategory, setSelectedCategory] = useState("")
    const [selectedEvent, setSelectedEvent] = useState("")
    const [firstPlace, setFirstPlace] = useState<string[]>([""])
    const [secondPlace, setSecondPlace] = useState<string[]>([""])
    const [thirdPlace, setThirdPlace] = useState<string[]>([""])

    const [posterFiles, setPosterFiles] = useState<File[]>([]) // Changed to array
    const [posterPreviews, setPosterPreviews] = useState<string[]>([]) // Changed to array
    const [isUploading, setIsUploading] = useState(false)
    const [isAutoGenerating, setIsAutoGenerating] = useState(false)
    const [customResultNumber, setCustomResultNumber] = useState<string>("01")
    const [eventSearchQuery, setEventSearchQuery] = useState("")
    const [posterMode, setPosterMode] = useState<'auto' | 'manual'>('auto')

    const handleManualFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setPosterFiles([file])
            const reader = new FileReader()
            reader.onloadend = () => {
                setPosterPreviews([reader.result as string])
            }
            reader.readAsDataURL(file)
        }
    }

    // Update result number when dialog opens or results change
    useEffect(() => {
        if (isDialogOpen && results) {
            setCustomResultNumber(generateResultNumber(results.length + 1))
        }
    }, [isDialogOpen, results])

    useEffect(() => {
        fetchResults()
    }, [])

    useEffect(() => {
        filterResults()
    }, [results, searchQuery, filterCategory])

    const fetchResults = async () => {
        try {
            const response = await fetch("/api/admin/results")
            if (response.ok) {
                const data = await response.json()
                setResults(data)
            }
        } catch (error) {
            console.error("Error fetching results:", error)
        }
    }

    const filterResults = () => {
        let filtered = results

        if (filterCategory !== "all") {
            filtered = filtered.filter((r) => r.category === filterCategory)
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(
                (r) =>
                    r.event.toLowerCase().includes(query) ||
                    r.category.toLowerCase().includes(query) ||
                    r.winners.some(w => w.studentName.toLowerCase().includes(query))
            )
        }

        setFilteredResults(filtered)
    }

    const getCategoryEvents = () => {
        const categoryData = eventsData.find(
            (cat) => categoryMap[selectedCategory as keyof typeof categoryMap] === cat.category
        )
        return categoryData?.events || []
    }

    const handleAddWinner = (rank: 1 | 2 | 3) => {
        if (rank === 1) setFirstPlace([...firstPlace, ""])
        else if (rank === 2) setSecondPlace([...secondPlace, ""])
        else setThirdPlace([...thirdPlace, ""])
    }

    const handleRemoveWinner = (rank: 1 | 2 | 3, index: number) => {
        if (rank === 1) setFirstPlace(firstPlace.filter((_, i) => i !== index))
        else if (rank === 2) setSecondPlace(secondPlace.filter((_, i) => i !== index))
        else setThirdPlace(thirdPlace.filter((_, i) => i !== index))
    }

    const handleUpdateWinner = (rank: 1 | 2 | 3, index: number, value: string, type: 'name' | 'team' = 'name') => {
        const updateList = (list: string[], setList: (l: string[]) => void) => {
            const updated = [...list]
            const currentString = updated[index] || ""
            let name = currentString
            let team = ""

            // Parse existing
            if (currentString.includes('(')) {
                const parts = currentString.split('(')
                name = parts[0].trim()
                team = parts[1].replace(')', '').trim()
            }

            if (type === 'name') {
                name = value
            } else {
                team = value
            }

            // Reconstruct
            updated[index] = team ? `${name} (${team})` : name
            setList(updated)
        }

        if (rank === 1) updateList(firstPlace, setFirstPlace)
        else if (rank === 2) updateList(secondPlace, setSecondPlace)
        else updateList(thirdPlace, setThirdPlace)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setPosterFiles([file])
            const reader = new FileReader()
            reader.onloadend = () => {
                setPosterPreviews([reader.result as string])
            }
            reader.readAsDataURL(file)
        }
    }

    const handleAutoGeneratePoster = async () => {
        if (!selectedCategory || !selectedEvent) {
            alert("Please select category and event first")
            return
        }

        const winnersFirst = firstPlace.filter(n => n.trim())
        const winnersSecond = secondPlace.filter(n => n.trim())
        const winnersThird = thirdPlace.filter(n => n.trim())

        if (winnersFirst.length === 0 && winnersSecond.length === 0 && winnersThird.length === 0) {
            alert("Please enter at least one winner before generating poster")
            return
        }

        setIsAutoGenerating(true)
        try {
            const templatePath = categoryTemplates[selectedCategory] || "/opt_result_1.png"
            // Use custom number
            const resultNumber = customResultNumber || generateResultNumber(results.length + 1)

            const posterData: EventResultData = {
                event: selectedEvent,
                category: selectedCategory,
                resultNumber,
                templatePath,
                winners: {
                    first: winnersFirst,
                    second: winnersSecond,
                    third: winnersThird
                }
            }

            // Generate 3 posters variations
            const blobs = await generatePosterVariations(posterData)

            const newFiles: File[] = []
            const newPreviews: string[] = []

            blobs.forEach((blob, idx) => {
                const file = new File([blob], `poster-${selectedEvent.replace(/\s+/g, '-')}-${idx + 1}.png`, { type: 'image/png' })
                newFiles.push(file)

                // Create preview
                newPreviews.push(URL.createObjectURL(blob))
            })

            setPosterFiles(newFiles)
            setPosterPreviews(newPreviews)

            alert("3 Poster variations auto-generated successfully!")
        } catch (error) {
            console.error("Auto-poster generation failed:", error)
            alert("Failed to auto-generate poster. Please try manual upload.")
        } finally {
            setIsAutoGenerating(false)
        }
    }

    const handleSubmit = async () => {
        if (!selectedCategory || !selectedEvent) {
            alert("Please select category and event")
            return
        }

        const winners: StudentWinner[] = [
            ...firstPlace.filter(name => name.trim()).map(name => ({ studentName: name, rank: 1 })),
            ...secondPlace.filter(name => name.trim()).map(name => ({ studentName: name, rank: 2 })),
            ...thirdPlace.filter(name => name.trim()).map(name => ({ studentName: name, rank: 3 })),
        ]

        if (winners.length === 0) {
            alert("Please enter at least one winner")
            return
        }

        setIsLoading(true)

        try {
            const finalPosterUrls: string[] = []
            let filesToUpload = [...posterFiles]

            // 1. Auto-generate posters if not present
            if (filesToUpload.length === 0) {
                try {
                    const templatePath = categoryTemplates[selectedCategory] || "/opt_result_1.png"
                    const resultNumber = customResultNumber || generateResultNumber(results.length + 1)

                    const posterData: EventResultData = {
                        event: selectedEvent,
                        category: selectedCategory,
                        resultNumber,
                        templatePath,
                        winners: {
                            first: firstPlace.filter(n => n.trim()),
                            second: secondPlace.filter(n => n.trim()),
                            third: thirdPlace.filter(n => n.trim())
                        }
                    }

                    const blobs = await generatePosterVariations(posterData)
                    blobs.forEach((blob, idx) => {
                        const file = new File([blob], `poster-${selectedEvent.replace(/\s+/g, '-')}-${idx + 1}.png`, { type: 'image/png' })
                        filesToUpload.push(file)
                    })
                } catch (genError) {
                    console.error("Auto-generation during submit failed:", genError)
                }
            }

            // 2. Upload the posters
            if (filesToUpload.length > 0) {
                setIsUploading(true)

                for (const file of filesToUpload) {
                    const formData = new FormData()
                    formData.append("file", file)
                    formData.append("resultId", `event-${selectedEvent.replace(/\s+/g, '-')}-${Date.now()}`)

                    const uploadRes = await fetch("/api/admin/upload-result-poster", {
                        method: "POST",
                        body: formData,
                    })

                    if (uploadRes.ok) {
                        const uploadData = await uploadRes.json()
                        finalPosterUrls.push(uploadData.posterUrl)
                    }
                }

                setIsUploading(false)
            }

            // 3. Save the result
            const response = await fetch("/api/admin/results", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    event: selectedEvent,
                    category: selectedCategory,
                    winners,
                    posters: finalPosterUrls,
                    poster: finalPosterUrls[0] || "", // Fallback
                }),
            })

            if (response.ok) {
                await fetchResults()
                resetForm()
                alert("Results published and 3 posters created successfully!")
            } else {
                const error = await response.json()
                alert(`Error: ${error.error || "Failed to save results"}`)
            }
        } catch (error) {
            console.error("Error during submission:", error)
            alert("An unexpected error occurred")
        } finally {
            setIsLoading(false)
            setIsUploading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this result?")) return

        try {
            const response = await fetch(`/api/admin/results?id=${id}`, {
                method: "DELETE",
            })

            if (response.ok) {
                await fetchResults()
            }
        } catch (error) {
            console.error("Error deleting result:", error)
        }
    }

    const resetForm = () => {
        setSelectedCategory("")
        setSelectedEvent("")
        setFirstPlace([""])
        setSecondPlace([""])
        setThirdPlace([""])
        setThirdPlace([""])
        setPosterFiles([])
        setPosterPreviews([])
        setIsDialogOpen(false)
        setIsAutoGenerating(false)
        setPosterMode('auto')
    }

    const getRankBadge = (rank: number) => {
        const badges = {
            1: { emoji: "🥇", color: "from-yellow-400 to-yellow-600" },
            2: { emoji: "🥈", color: "from-gray-300 to-gray-500" },
            3: { emoji: "🥉", color: "from-orange-400 to-orange-600" },
        }
        return badges[rank as keyof typeof badges] || { emoji: "🏅", color: "from-blue-400 to-blue-600" }
    }

    const generateAllPosters = async () => {
        // Find results without posters and generate them
        const resultsWithoutPosters = results.filter(r => !r.poster)
        if (resultsWithoutPosters.length === 0) {
            alert("All results already have posters!")
            return
        }

        if (!confirm(`Generate posters for ${resultsWithoutPosters.length} results?`)) return

        setIsLoading(true)
        let successCount = 0

        for (const result of resultsWithoutPosters) {
            try {
                const templatePath = categoryTemplates[result.category] || "/opt_result_1.png"
                const resultNumber = generateResultNumber(results.length - resultsWithoutPosters.indexOf(result))

                const posterData: EventResultData = {
                    event: result.event,
                    category: result.category,
                    resultNumber,
                    templatePath,
                    winners: {
                        first: result.winners.filter(w => w.rank === 1).map(w => w.studentName),
                        second: result.winners.filter(w => w.rank === 2).map(w => w.studentName),
                        third: result.winners.filter(w => w.rank === 3).map(w => w.studentName),
                    }
                }

                const posterBlob = await generateEventPoster(posterData)
                const posterFile = new File([posterBlob], `poster-${result.event.replace(/\s+/g, '-')}.png`, { type: 'image/png' })

                const formData = new FormData()
                formData.append("file", posterFile)
                formData.append("resultId", result._id)

                const uploadRes = await fetch("/api/admin/upload-result-poster", {
                    method: "POST",
                    body: formData,
                })

                if (uploadRes.ok) {
                    const uploadData = await uploadRes.json()
                    await fetch("/api/admin/results", {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id: result._id, poster: uploadData.posterUrl }),
                    })
                    successCount++
                }
            } catch (error) {
                console.error(`Failed to generate poster for ${result.event}:`, error)
            }
        }

        await fetchResults()
        setIsLoading(false)
        alert(`Successfully generated ${successCount} posters!`)
    }

    return (
        <div className="min-h-screen bg-background/50 pb-20">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="bg-card shadow-lg border border-border p-8 mb-6 rounded-3xl">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <Trophy className="text-white" size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">Results Management</h1>
                            <p className="text-muted-foreground text-sm">Manage competition results and student achievements</p>
                        </div>
                    </div>
                </div>

                {/* Actions Bar */}
                <div className="bg-card shadow-md border border-border p-4 mb-6 rounded-2xl">
                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <Input
                                placeholder="Search by student name or event..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 border-white/10 bg-background/50 focus:border-blue-500"
                            />
                        </div>
                        <Select value={filterCategory} onValueChange={setFilterCategory}>
                            <SelectTrigger className="w-full md:w-48 border-white/10 bg-background/50">
                                <SelectValue placeholder="Filter by category" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map((cat) => (
                                    <SelectItem key={cat} value={cat}>
                                        {cat}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button
                            variant="outline"
                            onClick={generateAllPosters}
                            disabled={isLoading}
                            className="border-blue-500 text-blue-500 hover:bg-blue-50 rounded-xl"
                        >
                            <Sparkles className="mr-2" size={20} />
                            Generate All Posters
                        </Button>
                        <Button
                            onClick={() => setIsDialogOpen(true)}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg rounded-xl"
                        >
                            <Plus className="mr-2" size={20} />
                            Publish Results
                        </Button>
                    </div>
                </div>

                {/* Results Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredResults.map((result) => (
                        <motion.div
                            key={result._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-card shadow-md rounded-2xl p-6 hover:shadow-lg transition-shadow border border-border relative overflow-hidden group"
                        >
                            <div className="flex items-start gap-3 mb-4">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl shadow-md flex-shrink-0">
                                    <Trophy className="text-white" size={24} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-lg text-foreground truncate">{result.event}</h3>
                                    <span className="font-semibold px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-full text-[10px] uppercase tracking-wider">
                                        {result.category}
                                    </span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDelete(result._id)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 size={16} />
                                </Button>
                            </div>

                            <div className="space-y-2 mb-4">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Winners</p>
                                <div className="space-y-1.5">
                                    {(result.winners || []).sort((a, b) => a.rank - b.rank).map((winner, idx) => {
                                        const badge = getRankBadge(winner.rank)
                                        return (
                                            <div key={idx} className="flex items-center gap-2 text-sm bg-background/50 p-2 rounded-lg border border-border/50">
                                                <span className="text-lg">{badge.emoji}</span>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-foreground font-medium truncate">{winner.studentName}</p>
                                                </div>
                                                <span className="text-[10px] font-bold text-muted-foreground">
                                                    {winner.rank === 1 ? '1ST' : winner.rank === 2 ? '2ND' : winner.rank === 3 ? '3RD' : `${winner.rank}TH`}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {result.poster && (
                                <div className="pt-4 border-t border-border/50">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                                            <ImageIcon size={10} />
                                            Event Poster
                                        </span>
                                        <button
                                            onClick={async () => {
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
                                            className="text-[10px] font-bold uppercase text-blue-500 hover:text-blue-600 flex items-center gap-1 bg-transparent border-none cursor-pointer"
                                        >
                                            <Download size={10} />
                                            Download
                                        </button>
                                    </div>
                                    <div
                                        className="relative w-full h-40 rounded-xl overflow-hidden bg-gray-100 border border-border group/poster cursor-pointer"
                                        onClick={async () => {
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
                                        <Image src={result.poster} alt="Event Poster" fill className="object-cover group-hover/poster:scale-105 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/poster:opacity-100 transition-opacity flex items-center justify-center">
                                            <Button variant="secondary" size="sm" className="pointer-events-none">
                                                <Download className="mr-2" size={14} /> Download Poster
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>

                {filteredResults.length === 0 && (
                    <div className="bg-card/50 backdrop-blur-sm rounded-3xl shadow-sm border border-border p-20 text-center">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                            <Trophy className="text-muted-foreground/30" size={40} />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">No results found</h3>
                        <p className="text-muted-foreground">
                            {searchQuery || filterCategory !== "all"
                                ? "Try adjusting your filters"
                                : "Start by publishing your first event results"}
                        </p>
                    </div>
                )}

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-[800px] h-[90vh] border border-border bg-white shadow-2xl text-black rounded-3xl p-0 overflow-hidden flex flex-col">
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white relative">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <Sparkles size={120} />
                                </div>
                                <DialogHeader>
                                    <DialogTitle className="text-3xl font-bold flex items-center gap-3 text-white">
                                        Publish New Result
                                    </DialogTitle>
                                    <DialogDescription className="text-blue-50/80 text-lg">
                                        Enter competition winners and let the system generate the poster.
                                    </DialogDescription>
                                </DialogHeader>
                            </div>

                            <div className="p-8 space-y-8">
                                {/* Category & Event */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="font-bold uppercase tracking-widest text-[10px] text-gray-500">Category *</Label>
                                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                            <SelectTrigger className="border-gray-200 bg-gray-50/50 h-12 rounded-xl">
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white">
                                                {categories.map((cat) => (
                                                    <SelectItem key={cat} value={cat}>
                                                        {cat}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="font-bold uppercase tracking-widest text-[10px] text-gray-500">Event *</Label>
                                        <Input
                                            placeholder="Search event name..."
                                            value={eventSearchQuery}
                                            onChange={(e) => setEventSearchQuery(e.target.value)}
                                            className="h-9 mb-2 bg-gray-50/50 border-gray-200 focus:border-blue-500 rounded-lg text-xs"
                                        />
                                        <Select value={selectedEvent} onValueChange={setSelectedEvent} disabled={!selectedCategory}>
                                            <SelectTrigger className="border-gray-200 bg-gray-50/50 h-12 rounded-xl">
                                                <SelectValue placeholder={selectedCategory ? "Select event" : "Select category first"} />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-[200px] bg-white">
                                                {getCategoryEvents()
                                                    .filter(event => event.toLowerCase().includes(eventSearchQuery.toLowerCase()))
                                                    .map((event) => (
                                                        <SelectItem key={event} value={event}>
                                                            {event}
                                                        </SelectItem>
                                                    ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label className="font-bold uppercase tracking-widest text-[10px] text-gray-500">Result Number (Digit on Poster)</Label>
                                        <Input
                                            value={customResultNumber}
                                            onChange={(e) => setCustomResultNumber(e.target.value)}
                                            placeholder="e.g. 05"
                                            className="h-12 bg-gray-50/50 border-gray-200 focus:border-blue-500 rounded-xl"
                                        />
                                    </div>
                                </div>

                                {/* Winners Sections */}
                                {selectedEvent && (
                                    <div className="space-y-6">
                                        {/* 1st Place */}
                                        <div className="bg-yellow-50/50 p-6 rounded-2xl border-2 border-yellow-200/50">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-10 rounded-xl bg-yellow-400 flex items-center justify-center text-xl shadow-sm text-yellow-900 font-bold">1</div>
                                                <h3 className="font-bold text-lg text-yellow-900">First Place</h3>
                                            </div>
                                            <div className="space-y-3">
                                                {firstPlace.map((winnerString, index) => {
                                                    const parts = winnerString.split('(')
                                                    const name = parts[0] ? parts[0].trim() : ""
                                                    const team = parts[1] ? parts[1].replace(')', '').trim() : ""

                                                    return (
                                                        <div key={index} className="flex gap-2">
                                                            <Input
                                                                placeholder="Enter winner name"
                                                                value={name}
                                                                onChange={(e) => handleUpdateWinner(1, index, e.target.value, 'name')}
                                                                className="h-12 bg-white border-yellow-200 focus:border-yellow-400 rounded-xl flex-[2]"
                                                            />
                                                            <Select value={team} onValueChange={(val) => handleUpdateWinner(1, index, val, 'team')}>
                                                                <SelectTrigger className="h-12 w-32 bg-white border-yellow-200 focus:border-yellow-400 rounded-xl">
                                                                    <SelectValue placeholder="Team" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="Libras">Libras</SelectItem>
                                                                    <SelectItem value="Auris">Auris</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            {firstPlace.length > 1 && (
                                                                <Button variant="ghost" size="icon" onClick={() => handleRemoveWinner(1, index)} className="text-red-500">
                                                                    <X size={20} />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleAddWinner(1)}
                                                className="mt-3 text-yellow-700 hover:bg-yellow-100 font-bold flex items-center gap-1"
                                            >
                                                <Plus size={16} /> Add Another
                                            </Button>
                                        </div>

                                        {/* 2nd Place */}
                                        <div className="bg-slate-50/50 p-6 rounded-2xl border-2 border-slate-200/50">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-10 rounded-xl bg-slate-300 flex items-center justify-center text-xl shadow-sm text-slate-700 font-bold">2</div>
                                                <h3 className="font-bold text-lg text-slate-700">Second Place</h3>
                                            </div>
                                            <div className="space-y-3">
                                                {secondPlace.map((winnerString, index) => {
                                                    const parts = winnerString.split('(')
                                                    const name = parts[0] ? parts[0].trim() : ""
                                                    const team = parts[1] ? parts[1].replace(')', '').trim() : ""

                                                    return (
                                                        <div key={index} className="flex gap-2">
                                                            <Input
                                                                placeholder="Enter winner name"
                                                                value={name}
                                                                onChange={(e) => handleUpdateWinner(2, index, e.target.value, 'name')}
                                                                className="h-12 bg-white border-slate-200 focus:border-slate-400 rounded-xl flex-[2]"
                                                            />
                                                            <Select value={team} onValueChange={(val) => handleUpdateWinner(2, index, val, 'team')}>
                                                                <SelectTrigger className="h-12 w-32 bg-white border-slate-200 focus:border-slate-400 rounded-xl">
                                                                    <SelectValue placeholder="Team" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="Libras">Libras</SelectItem>
                                                                    <SelectItem value="Auris">Auris</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            {secondPlace.length > 1 && (
                                                                <Button variant="ghost" size="icon" onClick={() => handleRemoveWinner(2, index)} className="text-red-500">
                                                                    <X size={20} />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleAddWinner(2)}
                                                className="mt-3 text-slate-700 hover:bg-slate-100 font-bold flex items-center gap-1"
                                            >
                                                <Plus size={16} /> Add Another
                                            </Button>
                                        </div>

                                        {/* 3rd Place */}
                                        <div className="bg-orange-50/50 p-6 rounded-2xl border-2 border-orange-200/50">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-10 rounded-xl bg-orange-400 flex items-center justify-center text-xl shadow-sm text-orange-900 font-bold">3</div>
                                                <h3 className="font-bold text-lg text-orange-900">Third Place</h3>
                                            </div>
                                            <div className="space-y-3">
                                                {thirdPlace.map((winnerString, index) => {
                                                    const parts = winnerString.split('(')
                                                    const name = parts[0] ? parts[0].trim() : ""
                                                    const team = parts[1] ? parts[1].replace(')', '').trim() : ""

                                                    return (
                                                        <div key={index} className="flex gap-2">
                                                            <Input
                                                                placeholder="Enter winner name"
                                                                value={name}
                                                                onChange={(e) => handleUpdateWinner(3, index, e.target.value, 'name')}
                                                                className="h-12 bg-white border-orange-200 focus:border-orange-400 rounded-xl flex-[2]"
                                                            />
                                                            <Select value={team} onValueChange={(val) => handleUpdateWinner(3, index, val, 'team')}>
                                                                <SelectTrigger className="h-12 w-32 bg-white border-orange-200 focus:border-orange-400 rounded-xl">
                                                                    <SelectValue placeholder="Team" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="Libras">Libras</SelectItem>
                                                                    <SelectItem value="Auris">Auris</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            {thirdPlace.length > 1 && (
                                                                <Button variant="ghost" size="icon" onClick={() => handleRemoveWinner(3, index)} className="text-red-500">
                                                                    <X size={20} />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleAddWinner(3)}
                                                className="mt-3 text-orange-700 hover:bg-orange-100 font-bold flex items-center gap-1"
                                            >
                                                <Plus size={16} /> Add Another
                                            </Button>
                                        </div>

                                        {/* Poster Section with Tabs */}
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between bg-gray-100 p-1 rounded-xl">
                                                <button
                                                    type="button"
                                                    onClick={() => setPosterMode('auto')}
                                                    className={cn(
                                                        "flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all",
                                                        posterMode === 'auto' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                                                    )}
                                                >
                                                    Auto Generate
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setPosterMode('manual')}
                                                    className={cn(
                                                        "flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all",
                                                        posterMode === 'manual' ? "bg-white text-purple-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                                                    )}
                                                >
                                                    Manual Upload
                                                </button>
                                            </div>

                                            {posterMode === 'auto' ? (
                                                <>
                                                    <div className="flex items-center justify-between">
                                                        <Label className="font-bold uppercase tracking-widest text-[10px] text-gray-500">Live Preview</Label>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={handleAutoGeneratePoster}
                                                            disabled={isAutoGenerating || !selectedEvent}
                                                            className="h-8 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100"
                                                        >
                                                            {isAutoGenerating ? (
                                                                <Loader2 className="mr-1 animate-spin" size={12} />
                                                            ) : (
                                                                <Sparkles className="mr-1" size={12} />
                                                            )}
                                                            Update Preview
                                                        </Button>
                                                    </div>

                                                    {posterPreviews.length > 0 ? (
                                                        <div className="grid grid-cols-2 gap-2">
                                                            {posterPreviews.map((preview, idx) => (
                                                                <div key={idx} className="relative w-full aspect-[4/5] rounded-xl overflow-hidden shadow-md border border-gray-100">
                                                                    <Image src={preview} alt={`Preview ${idx + 1}`} fill className="object-cover" />
                                                                    <div className="absolute top-1 left-1 bg-black/50 text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold">
                                                                        {idx === 0 ? "V1" : idx === 1 ? "V2" : "V3"}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center text-gray-400 bg-gray-50">
                                                            <Sparkles className="mx-auto mb-2 opacity-50" size={40} />
                                                            <p className="text-sm">3 Posters will be auto-generated</p>
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="border-2 border-dashed border-purple-200 bg-purple-50/30 rounded-2xl p-8 hover:bg-purple-50/50 transition-colors block cursor-pointer group relative">
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                        onChange={handleManualFileChange}
                                                    />
                                                    <div className="text-center">
                                                        {posterPreviews.length > 0 ? (
                                                            <div className="w-full aspect-[4/5] relative rounded-xl overflow-hidden shadow-md mx-auto max-w-[200px]">
                                                                <Image src={posterPreviews[0]} alt="Manual Upload Preview" fill className="object-cover" />
                                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <p className="text-white font-bold text-xs flex items-center gap-1">
                                                                        <Upload size={14} /> Change Image
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                                                    <Upload size={24} />
                                                                </div>
                                                                <p className="font-bold text-purple-900 mb-1">Click to Upload Poster</p>
                                                                <p className="text-xs text-purple-600/70">Supports JPG, PNG (Max 5MB)</p>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Fixed Footer */}
                        <div className="p-8 border-t bg-gray-50 flex gap-4">
                            <Button type="button" variant="outline" onClick={resetForm} className="flex-1 h-14 rounded-2xl font-bold uppercase tracking-widest text-xs">
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={isLoading || !selectedCategory || !selectedEvent}
                                className="flex-1 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl hover:scale-[1.02] transition-all text-white font-bold uppercase tracking-widest text-xs rounded-2xl"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="animate-spin" size={20} />
                                        {isUploading ? "Uploading..." : "Publishing..."}
                                    </span>
                                ) : "Publish & Create Poster"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}

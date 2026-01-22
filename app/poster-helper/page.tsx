"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"

export default function PosterPositionHelper() {
    const [showGrid, setShowGrid] = useState(true)
    const [positions, setPositions] = useState({
        resultNumber: { x: 600, y: 250, size: 80, color: '#FF6B35' },
        category: { x: 200, y: 400, size: 24, color: '#666' },
        event: { x: 600, y: 450, size: 48, color: '#333' },
        studentName: { x: 600, y: 550, size: 56, color: '#000' },
        position: { x: 600, y: 620, size: 36, color: '#000' },
    })

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        console.log(`Clicked at: x=${Math.round(x)}, y=${Math.round(y)}`)
    }

    return (
        <div className="min-h-screen p-8 bg-gray-50">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Poster Position Helper</h1>
                <p className="text-muted-foreground mb-8">
                    Click on the template image to get coordinates. Use these values to update the poster generator.
                </p>

                <div className="grid grid-cols-2 gap-8">
                    {/* Template Image */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Template Preview</h2>
                        <div
                            className="relative border-4 border-gray-300 cursor-crosshair"
                            onClick={handleClick}
                        >
                            <Image
                                src="/result.png"
                                alt="Template"
                                width={800}
                                height={600}
                                className="w-full"
                            />
                            {showGrid && (
                                <div className="absolute inset-0 pointer-events-none">
                                    {/* Grid lines */}
                                    {Array.from({ length: 10 }).map((_, i) => (
                                        <div key={`v-${i}`} className="absolute top-0 bottom-0 w-px bg-blue-500/20" style={{ left: `${i * 10}%` }} />
                                    ))}
                                    {Array.from({ length: 10 }).map((_, i) => (
                                        <div key={`h-${i}`} className="absolute left-0 right-0 h-px bg-blue-500/20" style={{ top: `${i * 10}%` }} />
                                    ))}
                                </div>
                            )}
                        </div>
                        <Button onClick={() => setShowGrid(!showGrid)} className="mt-4">
                            {showGrid ? 'Hide' : 'Show'} Grid
                        </Button>
                    </div>

                    {/* Position Settings */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Text Positions</h2>
                        <div className="space-y-4 bg-white p-6 rounded-lg shadow">
                            {Object.entries(positions).map(([key, pos]) => (
                                <div key={key} className="border-b pb-4">
                                    <h3 className="font-medium mb-2 capitalize">{key.replace(/([A-Z])/g, ' $1')}</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <Label>X Position</Label>
                                            <Input
                                                type="number"
                                                value={pos.x}
                                                onChange={(e) => setPositions({
                                                    ...positions,
                                                    [key]: { ...pos, x: parseInt(e.target.value) }
                                                })}
                                            />
                                        </div>
                                        <div>
                                            <Label>Y Position</Label>
                                            <Input
                                                type="number"
                                                value={pos.y}
                                                onChange={(e) => setPositions({
                                                    ...positions,
                                                    [key]: { ...pos, y: parseInt(e.target.value) }
                                                })}
                                            />
                                        </div>
                                        <div>
                                            <Label>Font Size</Label>
                                            <Input
                                                type="number"
                                                value={pos.size}
                                                onChange={(e) => setPositions({
                                                    ...positions,
                                                    [key]: { ...pos, size: parseInt(e.target.value) }
                                                })}
                                            />
                                        </div>
                                        <div>
                                            <Label>Color</Label>
                                            <Input
                                                type="color"
                                                value={pos.color}
                                                onChange={(e) => setPositions({
                                                    ...positions,
                                                    [key]: { ...pos, color: e.target.value }
                                                })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 bg-gray-800 text-white p-4 rounded font-mono text-sm overflow-auto">
                            <pre>{JSON.stringify(positions, null, 2)}</pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

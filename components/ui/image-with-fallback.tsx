"use client"

import { useState, useEffect } from "react"
import Image, { ImageProps } from "next/image"
import { ImageIcon } from "lucide-react"

interface ImageWithFallbackProps extends ImageProps {
    fallbackSrc?: string
}

export function ImageWithFallback({
    src,
    alt,
    fallbackSrc = "/placeholder.svg",
    className,
    ...props
}: ImageWithFallbackProps) {
    const [error, setError] = useState(false)
    const [imgSrc, setImgSrc] = useState(src)

    useEffect(() => {
        setImgSrc(src)
        setError(false)
    }, [src])

    if (error) {
        return (
            <div className={`flex flex-col items-center justify-center bg-secondary/30 border border-border/50 text-muted-foreground p-2 text-center ${className}`}>
                <ImageIcon size={24} className="mb-1 opacity-40" />
                <span className="text-[10px] font-medium uppercase tracking-wider opacity-50">Unavailable</span>
            </div>
        )
    }

    return (
        <Image
            {...props}
            src={imgSrc}
            alt={alt}
            className={className}
            onError={() => {
                setError(true)
            }}
        />
    )
}

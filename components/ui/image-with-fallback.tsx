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
            <div className={`flex items-center justify-center bg-gray-100 text-gray-400 ${className}`}>
                <ImageIcon size={24} />
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

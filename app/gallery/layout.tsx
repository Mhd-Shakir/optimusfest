import type { Metadata } from "next"
import { siteConfig } from "@/lib/seo-config"

export const metadata: Metadata = {
    title: "Photo Gallery",
    description: "Visual journey through Optimus Arts Fest 2026. Browse high-quality photos from stage events, cultural programs, and award ceremonies.",
    alternates: {
        canonical: `${siteConfig.url}/gallery`,
    },
}

export default function GalleryLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

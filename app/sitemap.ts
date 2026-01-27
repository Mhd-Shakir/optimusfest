import { MetadataRoute } from "next"
import { siteConfig } from "@/lib/seo-config"

export default function sitemap(): MetadataRoute.Sitemap {
    const routes = [
        "",
        "/about",
        "/contact",
        "/events",
        "/news",
        "/gallery",
        "/results",
        "/teams",
        "/testimonials",
        "/theme",
    ].map((route) => ({
        url: `${siteConfig.url}${route}`,
        lastModified: new Date().toISOString().split("T")[0],
        changeFrequency: "daily" as const,
        priority: route === "" ? 1 : 0.8,
    }))

    return routes
}

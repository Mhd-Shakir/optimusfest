import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { NewsSection } from "@/components/news-section"
import { siteConfig, breadcrumbSchema } from "@/lib/seo-config"

export const metadata: Metadata = {
    title: "Latest News & Updates",
    description: "Stay updated with the latest news, announcements, and featured stories from Optimus Arts Fest 2026. Official updates from Ihyaul Aman Student Union.",
    alternates: {
        canonical: `${siteConfig.url}/news`,
    },
}

export default function NewsPage() {
    const breadcrumbs = breadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "News", url: "/news" },
    ]);

    return (
        <main className="min-h-screen bg-background">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadcrumbs),
                }}
            />
            <Header />
            <div className="pt-24 pb-12">
                <NewsSection />
            </div>
            <Footer />
        </main>
    )
}

import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ThemeSection } from "@/components/theme-section"
import { siteConfig, breadcrumbSchema } from "@/lib/seo-config"

export const metadata: Metadata = {
    title: "Festival Theme",
    description: "Discover the central theme and vision of Optimus Arts Fest 2026. Understanding the creative philosophy behind Ihyaul Aman Student Union's biggest event.",
    alternates: {
        canonical: `${siteConfig.url}/theme`,
    },
}

export default function ThemePage() {
    const breadcrumbs = breadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Theme", url: "/theme" },
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
                <ThemeSection />
            </div>
            <Footer />
        </main>
    )
}

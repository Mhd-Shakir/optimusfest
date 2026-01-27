import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { About } from "@/components/about"
import { siteConfig, breadcrumbSchema } from "@/lib/seo-config"

export const metadata: Metadata = {
    title: "About Us",
    description: "Learn about the mission, vision, and the team behind Optimus Arts Fest 2026. Discover the legacy of Ihyaul Aman Student Union and Darul Aman.",
    alternates: {
        canonical: `${siteConfig.url}/about`,
    },
}

export default function AboutPage() {
    const breadcrumbs = breadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "About", url: "/about" },
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
                <About />
            </div>
            <Footer />
        </main>
    )
}

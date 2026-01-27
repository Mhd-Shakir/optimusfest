import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { EventsSection } from "@/components/events-section"
import { siteConfig, breadcrumbSchema } from "@/lib/seo-config"

export const metadata: Metadata = {
    title: "Events Schedule",
    description: "Full schedule and details of all competitions at Optimus Arts Fest 2026. Browse through stage events, literary competitions, and more.",
    alternates: {
        canonical: `${siteConfig.url}/events`,
    },
}

export default function EventsPage() {
    const breadcrumbs = breadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Events", url: "/events" },
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
                <EventsSection />
            </div>
            <Footer />
        </main>
    )
}

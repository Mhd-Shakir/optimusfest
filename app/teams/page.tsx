import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { TeamsSection } from "@/components/teams-section"
import { siteConfig, breadcrumbSchema } from "@/lib/seo-config"

export const metadata: Metadata = {
    title: "Competing Teams",
    description: "Meet the teams competing in Optimus Arts Fest 2026. Explore team profiles, leaders, and their journey in the Ihyaul Aman Student Union arts festival.",
    alternates: {
        canonical: `${siteConfig.url}/teams`,
    },
}

export default function TeamsPage() {
    const breadcrumbs = breadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Teams", url: "/teams" },
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
                <TeamsSection />
            </div>
            <Footer />
        </main>
    )
}

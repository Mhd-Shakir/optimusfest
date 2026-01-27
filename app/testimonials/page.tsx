import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { TestimonialsSection } from "@/components/testimonials-section"
import { siteConfig, breadcrumbSchema } from "@/lib/seo-config"

export const metadata: Metadata = {
    title: "Testimonials",
    description: "Read what students, staff, and guests say about Optimus Arts Fest. Heartfelt stories and feedback from the Ihyaul Aman Student Union cultural community.",
    alternates: {
        canonical: `${siteConfig.url}/testimonials`,
    },
}

export default function TestimonialsPage() {
    const breadcrumbs = breadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Testimonials", url: "/testimonials" },
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
                <TestimonialsSection />
            </div>
            <Footer />
        </main>
    )
}

import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ContactSection } from "@/components/contact-section"
import { siteConfig, breadcrumbSchema } from "@/lib/seo-config"

export const metadata: Metadata = {
    title: "Contact Us",
    description: "Get in touch with the Optimus Arts Fest 2026 organizing committee. Contact Ihyaul Aman Student Union for inquiries, partnerships, and support.",
    alternates: {
        canonical: `${siteConfig.url}/contact`,
    },
}

export default function ContactPage() {
    const breadcrumbs = breadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Contact", url: "/contact" },
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
                <ContactSection />
            </div>
            <Footer />
        </main>
    )
}

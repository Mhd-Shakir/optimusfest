import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { GeminiResultsInterface } from "@/components/instagram-results-bot"
import { siteConfig, breadcrumbSchema } from "@/lib/seo-config"
import { Sparkles, Trophy } from "lucide-react"

export const metadata: Metadata = {
  title: "Live Results",
  description: "Official results for Optimus Arts Fest 2026. Explore live point tables, category-wise winners, and competition updates from Ihyaul Aman Student Union.",
  alternates: {
    canonical: `${siteConfig.url}/results`,
  },
}

export default function ResultsPage() {
  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Results", url: "/results" },
  ]);

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbs),
        }}
      />
      <Header />
      <div className="pt-32 pb-24">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-purple-100 text-black">
              <Sparkles size={18} />
              <span className="text-sm font-medium">Interactive Results Bot</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Competition Results
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Meet our interactive results assistant. Search for winners, browse categories, and download official event posters.
            </p>
            <div className="flex items-center justify-center gap-6 mt-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Trophy size={16} className="text-purple-600" />
                <span>160 Events</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span>5 Categories</span>
              </div>
            </div>
          </div>

          {/* New Gemini Style Results Interface */}
          <GeminiResultsInterface />
        </div>
      </div>
      <Footer />
    </main>
  )
}

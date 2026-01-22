import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { GeminiResultsInterface } from "@/components/gemini-results-interface"
import { Sparkles, Trophy } from "lucide-react"

export const metadata: Metadata = {
  title: "Results | Optimus Arts Fest",
  description: "Search and explore competition results using AI-powered natural language search.",
}

export default function ResultsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-purple-950/20 dark:to-pink-950/20">
      <Header />
      <div className="pt-32 pb-24">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
              <Sparkles size={18} />
              <span className="text-sm font-medium">AI-Powered Search</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Competition Results
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ask our AI assistant powered by Google Gemini to find results. Natural language search makes it easy!
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

          {/* Gemini AI Results Interface */}
          <GeminiResultsInterface />
        </div>
      </div>
      <Footer />
    </main>
  )
}

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ThemeSection } from "@/components/theme-section"

export default function ThemePage() {
    return (
        <main className="min-h-screen bg-background">
            <Header />
            <div className="pt-24 pb-12">
                <ThemeSection />
            </div>
            <Footer />
        </main>
    )
}

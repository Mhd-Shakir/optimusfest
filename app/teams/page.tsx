import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { TeamsSection } from "@/components/teams-section"

export default function TeamsPage() {
    return (
        <main className="min-h-screen bg-background">
            <Header />
            <div className="pt-24 pb-12">
                <TeamsSection />
            </div>
            <Footer />
        </main>
    )
}

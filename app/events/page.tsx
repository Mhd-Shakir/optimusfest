import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { EventsSection } from "@/components/events-section"

export default function EventsPage() {
    return (
        <main className="min-h-screen bg-background">
            <Header />
            <div className="pt-24 pb-12">
                <EventsSection />
            </div>
            <Footer />
        </main>
    )
}

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { About } from "@/components/about"

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-background">
            <Header />
            <div className="pt-24 pb-12">
                <About />
            </div>
            <Footer />
        </main>
    )
}

import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { ThemeSection } from "@/components/theme-section"
import { TeamsSection } from "@/components/teams-section"
import { EventsSection } from "@/components/events-section"
import { NewsSection } from "@/components/news-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { GallerySection } from "@/components/gallery-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      <Hero />

      {/* Main Content Wrapper with modern spacing */}
      <div className="relative">
        {/* About Section with modern padding */}
        <div className="py-12 sm:py-16 md:py-20 lg:py-28">
          <About />
        </div>

        {/* Theme Section with accent background */}
        <div className="py-12 sm:py-16 md:py-20 lg:py-28 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
          <ThemeSection />
        </div>

        {/* Teams Section */}
        <div className="py-12 sm:py-16 md:py-20 lg:py-28">
          <TeamsSection />
        </div>

        {/* Events Section with accent */}
        <div className="py-12 sm:py-16 md:py-20 lg:py-28 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />
          <EventsSection />
        </div>

        {/* News Section */}
        <NewsSection />

        {/* Gallery Section */}
        <div className="py-12 sm:py-16 md:py-20 lg:py-28">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <GallerySection />
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="py-12 sm:py-16 md:py-20 lg:py-28">
          <TestimonialsSection />
        </div>

        {/* Contact Section with gradient background */}
        <div className="py-12 sm:py-16 md:py-20 lg:py-28 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" />
          <ContactSection />
        </div>
      </div>

      <Footer />
    </main>
  )
}

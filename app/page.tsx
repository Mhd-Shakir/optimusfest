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
import { FAQSection } from "@/components/faq-section"
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

        {/* FAQ Section */}
        <FAQSection />

        {/* About Section for SEO/AEO */}
        <div className="py-12 bg-background/50 border-t border-border">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="sr-only">About Optimus Arts Fest</h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Welcome to the official <strong>Optimus Arts Fest 2026</strong> portal.
              Organized by the <strong>Ihyaul Aman Student Union</strong>, Optimus is the premier
              arts and cultural festival of <strong>Darul Aman Integrated Islamic Academy</strong> in
              <strong>Edavannappara</strong>. Stay tuned for real-time updates on stage events,
              off-stage competitions, live results, and the final points table.
              Experience the creative spirit of Optimus Fest.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { ThemeSection } from "@/components/theme-section"
import { TeamsSection } from "@/components/teams-section"
import { LivePoints } from "@/components/live-points"
import { EventsSection } from "@/components/events-section"
import { NewsSection } from "@/components/news-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { GallerySection } from "@/components/gallery-section"
import { SocialConnection } from "@/components/social-connection"
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
        <div>
          <About />
        </div>

        {/* Theme Section with accent background */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
          <ThemeSection />
        </div>

        {/* Live Points Section */}
        <LivePoints />

        {/* Teams Section */}
        <div>
          <TeamsSection />
        </div>

        {/* Events Section with accent */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />
          <EventsSection />
        </div>

        {/* News Section */}
        <NewsSection />

        {/* Gallery Section */}
        <div>
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <GallerySection />
          </div>
        </div>

        {/* Testimonials Section */}
        <div>
          <TestimonialsSection />
        </div>

        {/* Social Connection Section */}
        <SocialConnection />

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

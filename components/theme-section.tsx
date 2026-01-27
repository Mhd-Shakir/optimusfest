"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Lightbulb, Waves, Zap } from "lucide-react"

export function ThemeSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="theme" ref={ref} className="relative py-16 md:py-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/50 to-transparent" />
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px]" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <span className="text-primary text-sm font-medium tracking-widest uppercase mb-4 block">
            This Year's Theme
          </span>
          <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-sans font-bold mb-8 whitespace-nowrap">
            <span className="gradient-text">&ldquo;Buffer Less, Listen More&rdquo;</span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed mb-12">
            In a world of constant distractions and endless buffering, we invite you to pause, be present, and truly listen.
            This year's theme celebrates the power of mindful engagement, authentic connection, and the art of active listening.
            Experience performances that demand your full attention and reward you with profound moments of clarity and inspiration.
          </p>
        </motion.div>

        {/* Theme pillars */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {[
            {
              icon: Waves,
              title: "Be Present",
              description:
                "Disconnect from distractions and immerse yourself fully in the moment, experiencing art without interruption.",
            },
            {
              icon: Lightbulb,
              title: "Connect Deeply",
              description:
                "Foster meaningful connections through shared experiences, where every performance creates lasting bonds.",
            },
            {
              icon: Zap,
              title: "Express Authentically",
              description: "Witness raw, unfiltered talent as artists share their truth without filters or barriers.",
            },
          ].map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className="text-center group"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl glass flex items-center justify-center group-hover:glow-primary transition-all duration-300">
                <pillar.icon className="text-primary" size={32} />
              </div>
              <h3 className="text-2xl font-sans font-bold mb-3 text-foreground">{pillar.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{pillar.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Users, Trophy, Target, Sparkles } from "lucide-react"

const teams = [
  {
    id: "1",
    name: "Auris",
    tagline: "The Sound of Excellence",
    description: "Dedicated to musical and auditory arts, Auris brings harmony and rhythm to every performance.",
    color: "from-blue-500 to-cyan-500",
    icon: Sparkles,
    stats: [
      { label: "Participants", value: "45+" },
      { label: "Categories", value: "3" },
      { label: "Events", value: "80+" },
    ],
  },
  {
    id: "2",
    name: "Libras",
    tagline: "Balance in Creativity",
    description: "Focused on literary and visual arts, Libras creates a perfect balance between words and imagery.",
    color: "from-purple-500 to-pink-500",
    icon: Target,
    stats: [
      { label: "Participants", value: "45+" },
      { label: "Categories", value: "3" },
      { label: "Events", value: "80+" },
    ],
  },
]

export function TeamsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="teams" ref={ref} className="relative overflow-hidden py-16 md:py-24">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tl from-accent/10 to-transparent rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-semibold tracking-wider uppercase mb-4">
            Our Teams
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans font-bold mb-4">
            Meet <span className="gradient-text">The Teams</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Two exceptional teams working together to create an unforgettable arts festival experience
          </p>
        </motion.div>

        {/* Teams Grid */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 max-w-6xl mx-auto">
          {teams.map((team, index) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.2 }}
              className="group relative"
            >
              <div className="glass rounded-3xl p-6 sm:p-8 h-full hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 border border-transparent hover:border-primary/30">
                {/* Gradient Background */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${team.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />

                {/* Icon */}
                <div className="relative mb-6">
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${team.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <team.icon className="text-white" size={32} />
                  </div>
                </div>

                {/* Team Name */}
                <h3 className="text-3xl sm:text-4xl font-bold mb-2 relative">
                  <span className={`bg-gradient-to-r ${team.color} bg-clip-text text-transparent`}>
                    {team.name}
                  </span>
                </h3>

                {/* Tagline */}
                <p className="text-base sm:text-lg font-semibold text-foreground mb-4">
                  {team.tagline}
                </p>

                {/* Description */}
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-6">
                  {team.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/50">
                  {team.stats.map((stat, idx) => (
                    <div key={idx} className="text-center">
                      <div className={`text-xl sm:text-2xl font-bold bg-gradient-to-r ${team.color} bg-clip-text text-transparent`}>
                        {stat.value}
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

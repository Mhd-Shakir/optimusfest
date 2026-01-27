"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

export function About() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="about" ref={ref} className="relative overflow-hidden py-16 md:py-24">
      {/* Modern background accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-accent/10 to-transparent rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        {/* Two column layout for larger screens */}
        <div className="grid lg:grid-cols-12 gap-8 md:gap-12 lg:gap-16 items-start">
          {/* Content - Left side */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="lg:col-span-8"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans font-bold mb-4 md:mb-6 leading-tight">
              About <span className="gradient-text">Optimus</span>
            </h2>

            <div className="space-y-3 md:space-y-4">
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                Darul Aman Edavannappara proudly presents the 19th edition of Optimus, organized by the Ihyaul Aman Students Union. This year, we feature over 160+ competitions across three categories: Alpha (Sub Junior), Beta (Junior), and Omega (Senior), showcasing the diverse talents of around 90 contestants.
              </p>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                Optimus serves as a vibrant platform for students to express their creativity, engage in meaningful discussions, and explore important themes that promote personal and academic growth. Participants will step outside their comfort zones through debates, workshops, and cultural performances.
              </p>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                Our goal is to foster not just academic excellence but also ethical values and social responsibility. As we celebrate our achievements, Optimus symbolizes the bright future we envision at Darul Aman Edavannappara. We invite everyone to join us in this enriching experience, where learning and gratitude flourish.
              </p>
            </div>
          </motion.div>

          {/* Stats - Right side, vertical on larger screens */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-4"
          >
            <div className="flex flex-row lg:flex-col gap-6 sm:gap-8 lg:gap-12 justify-center lg:justify-start mt-8 lg:mt-0">
              <div className="text-center lg:text-left flex-1 lg:flex-none">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text mb-1 md:mb-2">19</div>
                <div className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider">Edition</div>
              </div>
              <div className="text-center lg:text-left flex-1 lg:flex-none">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text mb-1 md:mb-2">90+</div>
                <div className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider">Contestants</div>
              </div>
              <div className="text-center lg:text-left flex-1 lg:flex-none">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text mb-1 md:mb-2">160+</div>
                <div className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider">Competitions</div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16 sm:pt-20 pb-20 sm:pb-24"
    >
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full z-0 bg-black">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale"
        >
          <source src="/new_banner_video.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Animated gradient blobs */}
      <div className="absolute inset-0 overflow-hidden z-[1]">
        <motion.div
          style={{ y }}
          className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/20 rounded-full blur-[120px] animate-pulse-glow"
        />
        <motion.div
          style={{ y }}
          className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-accent/15 rounded-full blur-[120px] animate-pulse-glow"
        />
        <motion.div
          style={{ y }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 bg-primary/10 rounded-full blur-[100px]"
        />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] z-[2]"
        style={{
          backgroundImage: `linear-gradient(rgba(110,177,229,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(110,177,229,0.3) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Hero Content Container */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 text-center flex-1 flex flex-col items-center justify-center"
      >
        {/* Mobile Theme Text */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="sm:hidden mb-2"
        >
          <span className="text-primary text-[10px] xs:text-xs font-bold tracking-[0.3em] uppercase drop-shadow-sm brightness-110">
            Buffer Less, Listen More
          </span>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="mb-6 sm:mb-8 md:mb-10"
        >
          <h1 className="sr-only">Optimus Arts Fest 2026 - Ihyaul Aman Student Union</h1>
          <img
            src="/optimus26.png"
            alt="Optimus Arts Fest 2026 Logo - Ihyaul Aman Student Union"
            className="w-80 h-80 xs:w-[22rem] xs:h-[22rem] sm:w-[26rem] sm:h-[26rem] md:w-[30rem] md:h-[30rem] lg:w-[34rem] lg:h-[34rem] xl:w-[38rem] xl:h-[38rem] object-contain drop-shadow-2xl max-w-[90vw] mx-auto transition-all duration-500 hover:scale-105"
          />
        </motion.div>

        {/* View Results Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-8 sm:mb-10"
        >
          <Link href="/results">
            <Button
              size="lg"
              className="bg-white text-black hover:bg-white/90 px-6 sm:px-8 md:px-10 lg:px-12 py-3 sm:py-4 md:py-5 text-sm sm:text-base md:text-lg font-bold rounded-full transition-all duration-300 shadow-2xl hover:shadow-white/30 hover:scale-105 border-2 border-white/20"
            >
              View Results
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 cursor-pointer group"
          onClick={() => {
            document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <span className="text-white text-[10px] xs:text-xs sm:text-sm uppercase tracking-widest drop-shadow-lg font-medium opacity-90 group-hover:opacity-100 transition-opacity">
            Scroll Down
          </span>
          <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white/70 rounded-full flex items-start justify-center p-1.5 sm:p-2 group-hover:border-white transition-colors">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
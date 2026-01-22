"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const mainNavItems = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Events", href: "#events" },
  { name: "Results", href: "/results" },
]

const moreItems = [
  { name: "Theme", href: "#theme" },
  { name: "Teams", href: "#teams" },
  { name: "News", href: "#news" },
  { name: "Gallery", href: "#gallery" },
  { name: "Testimonials", href: "#testimonials" },
  { name: "Contact", href: "#contact" },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)

      const allItems = [...mainNavItems, ...moreItems]
      const sections = allItems.map((item) => item.href.replace("#", "")).filter((id) => id !== "/results")
      for (const section of sections.reverse()) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 150) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-2 right-2 left-2 sm:top-3 sm:right-3 sm:left-3 z-50 max-w-[100vw]"
    >
      {/* Modern Navbar with spacing */}
      <div className="w-full">
        <div
          className={cn(
            "glass-strong backdrop-blur-xl transition-all duration-300 rounded-full",
            isScrolled ? "shadow-xl" : "shadow-lg"
          )}
        >
          <div className="flex items-center justify-between px-3 sm:px-4 md:px-5 py-2">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              <Image src="/images/image.png" alt="Optimus Arts Fest Logo" width={32} height={32} className="rounded-lg w-7 h-7 sm:w-8 sm:h-8" />
              <motion.div whileHover={{ scale: 1.05 }} className="text-sm sm:text-base md:text-lg font-sans font-bold tracking-tight">
                <span className="text-foreground">OPTIMUS</span>
                <span className="gradient-text ml-0.5 sm:ml-1">ARTS</span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {mainNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium transition-all duration-300 relative rounded-full",
                    activeSection === item.href.replace("#", "") ||
                      (item.href === "/results" && activeSection === "results")
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  {item.name}
                </Link>
              ))}

              {/* Dropdown Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium transition-all duration-300 rounded-full flex items-center gap-0.5",
                    isDropdownOpen
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  More
                  <ChevronDown
                    size={14}
                    className={cn("transition-transform duration-300", isDropdownOpen && "rotate-180")}
                  />
                </button>

                {/* Dropdown Content */}
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      onMouseLeave={() => setIsDropdownOpen(false)}
                      className="absolute top-full right-0 mt-2 w-48 glass-strong rounded-2xl shadow-xl overflow-hidden border border-border/50"
                    >
                      <div className="py-2">
                        {moreItems.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsDropdownOpen(false)}
                            className={cn(
                              "block px-4 py-2.5 text-sm font-medium transition-all duration-200",
                              activeSection === item.href.replace("#", "")
                                ? "text-primary bg-primary/10"
                                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                            )}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-foreground rounded-full hover:bg-secondary/50 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="lg:hidden glass-strong mt-2 mx-4 rounded-3xl overflow-hidden shadow-xl max-w-[calc(100vw-2rem)]"
          >
            <div className="py-4 px-4 sm:px-6 flex flex-col gap-1 max-h-[70vh] overflow-y-auto">
              {/* Main Items */}
              {mainNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "py-2.5 px-4 text-sm font-medium transition-all duration-300 rounded-xl",
                    activeSection === item.href.replace("#", "")
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  {item.name}
                </Link>
              ))}

              {/* Divider */}
              <div className="h-px bg-border/50 my-2" />

              {/* More Items */}
              <div className="text-xs font-semibold text-muted-foreground px-4 py-2 uppercase tracking-wider">
                More
              </div>
              {moreItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "py-2.5 px-4 text-sm font-medium transition-all duration-300 rounded-xl",
                    activeSection === item.href.replace("#", "")
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

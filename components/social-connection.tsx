"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Instagram, Youtube, Facebook, ExternalLink } from "lucide-react"

export function SocialConnection() {
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })

    const socials = [
        {
            name: "Instagram",
            icon: Instagram,
            href: "https://www.instagram.com/optimus26_/",
            color: "hover:bg-pink-500/10 hover:text-pink-500 hover:border-pink-500/50",
            description: "Follow us for live updates",
        },
        {
            name: "YouTube",
            icon: Youtube,
            href: "https://youtube.com/@ihyaulamanmedia?si=n2ctV1xmvz4_9Lon",
            color: "hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50",
            description: "Watch event highlights",
        },
        {
            name: "Facebook",
            icon: Facebook,
            href: "https://www.facebook.com/DarulAmanAlislamiya",
            color: "hover:bg-blue-600/10 hover:text-blue-600 hover:border-blue-600/50",
            description: "Join our community",
        },
    ]

    return (
        <section id="social-connect" ref={ref} className="relative py-24 overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-primary/5 via-accent/5 to-transparent rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold tracking-wider uppercase mb-4">
                        Stay Connected
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold mb-6">
                        Let&apos;s <span className="gradient-text">Connect</span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                        Join our vibrant community on social media. Follow us for behind-the-scenes content,
                        live event coverage, and exclusive updates from Optimus Arts Fest.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {socials.map((social, index) => (
                        <motion.a
                            key={social.name}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`group glass p-8 rounded-3xl border border-white/10 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 ${social.color}`}
                        >
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <social.icon size={32} className="transition-colors" />
                            </div>

                            <h3 className="text-xl font-bold mb-2 group-hover:text-foreground transition-colors">
                                {social.name}
                            </h3>

                            <p className="text-sm text-muted-foreground mb-6 group-hover:text-foreground/80 transition-colors">
                                {social.description}
                            </p>

                            <div className="mt-auto flex items-center gap-2 text-sm font-medium opacity-60 group-hover:opacity-100 transition-opacity">
                                <span>Visit Page</span>
                                <ExternalLink size={14} />
                            </div>
                        </motion.a>
                    ))}
                </div>
            </div>
        </section>
    )
}

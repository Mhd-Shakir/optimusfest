"use client"

import Link from "next/link"

const footerLinks = {
  Festival: [
    { name: "About", href: "#about" },
    { name: "Theme", href: "#theme" },
    { name: "Events", href: "#events" },
    { name: "Gallery", href: "#gallery" },
  ],
  Participate: [
    { name: "Register", href: "/register" },
    { name: "Results", href: "/results" },
    { name: "Rules", href: "/rules" },
    { name: "FAQs", href: "/faqs" },
  ],
  Connect: [
    { name: "Contact", href: "#contact" },
    { name: "Press", href: "/press" },
    { name: "Sponsors", href: "/sponsors" },
    { name: "Careers", href: "/careers" },
  ],
}

export function Footer() {
  return (
    <footer className="relative py-16 overflow-hidden border-t border-border">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-primary/5 rounded-full blur-[100px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-sans font-bold">
                <span className="text-foreground">OPTIMUS</span>
                <span className="text-primary ml-1">ARTS</span>
              </span>
            </Link>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Where creativity meets excellence. Celebrating the finest in performing and visual arts.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-foreground font-semibold mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Optimus Arts Fest. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-muted-foreground text-sm hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-muted-foreground text-sm hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

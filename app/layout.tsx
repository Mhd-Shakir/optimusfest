import type React from "react"
import type { Metadata, Viewport } from "next"
import { Poppins, Playfair_Display, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700", "800", "900"]
})
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

export const metadata: Metadata = {
  title: "Optimus Arts Fest | Where Creativity Meets Excellence",
  description:
    "Experience the pinnacle of artistic expression at Optimus Arts Fest. Join us for an extraordinary celebration of music, dance, drama, and visual arts.",
  keywords: ["arts festival", "cultural event", "music", "dance", "drama", "visual arts", "optimus"],
  authors: [{ name: "Optimus Arts Fest Team" }],
  openGraph: {
    title: "Optimus Arts Fest",
    description: "Where Creativity Meets Excellence",
    type: "website",
  },
  generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#0891b2",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${poppins.variable} ${playfair.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

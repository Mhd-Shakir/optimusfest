import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
    title: "Admin - Optimus Arts Festival",
    description: "Admin dashboard for managing Optimus Arts Festival",
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-background">
            {/* Admin Header */}
            <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Site
                            </Button>
                        </Link>
                        <div className="h-6 w-px bg-border" />
                        <h1 className="text-xl font-bold">
                            <span className="gradient-text">Admin Dashboard</span>
                        </h1>
                    </div>

                    {/* Navigation */}
                    <nav className="flex items-center gap-2">
                        <Link href="/admin/events">
                            <Button variant="ghost" size="sm">
                                Events
                            </Button>
                        </Link>
                        <Link href="/admin/results">
                            <Button variant="ghost" size="sm">
                                Results
                            </Button>
                        </Link>
                        <Link href="/admin/news">
                            <Button variant="ghost" size="sm">
                                News
                            </Button>
                        </Link>
                        <Link href="/admin/gallery">
                            <Button variant="ghost" size="sm">
                                Gallery
                            </Button>
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">{children}</main>
        </div>
    )
}

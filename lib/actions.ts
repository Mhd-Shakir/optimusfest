"use server"

export interface Result {
  _id: string
  rank: number
  participant: string
  team?: string
  category: string
  score: number
  event: string
}

export interface Event {
  _id: string
  title: string
  category: string
  date: string
  time: string
  venue: string
  description: string
  image?: string
  images?: string[]
}

export interface TeamMember {
  _id: string
  name: string
  role: string
  department: string
  image?: string
  socials?: {
    instagram?: string
    linkedin?: string
  }
}

export interface NewsArticle {
  _id: string
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  image?: string
  category: string
}

export interface Testimonial {
  _id: string
  name: string
  role: string
  content: string
  image?: string
}

export interface GalleryImage {
  _id: string
  src: string
  alt: string
  category: string
  year: number
}

// Static data for preview
const staticResults: Result[] = [
  {
    _id: "1",
    rank: 1,
    participant: "Aisha Rahman",
    team: "Phoenix Academy",
    category: "Dance",
    score: 98.5,
    event: "Classical Dance",
  },
  {
    _id: "2",
    rank: 2,
    participant: "Marcus Chen",
    team: "Harmony Institute",
    category: "Music",
    score: 97.2,
    event: "Western Vocals",
  },
  {
    _id: "3",
    rank: 3,
    participant: "Priya Sharma",
    team: "Creative Arts School",
    category: "Visual Arts",
    score: 96.8,
    event: "Oil Painting",
  },
  {
    _id: "4",
    rank: 4,
    participant: "James Wilson",
    team: "Metro Arts Academy",
    category: "Drama",
    score: 96.5,
    event: "Monologue",
  },
  {
    _id: "5",
    rank: 5,
    participant: "Sophia Lee",
    team: "Elite Performance",
    category: "Dance",
    score: 95.9,
    event: "Contemporary Dance",
  },
  {
    _id: "6",
    rank: 6,
    participant: "Carlos Mendez",
    team: "Riverside Academy",
    category: "Music",
    score: 95.4,
    event: "Instrumental",
  },
  {
    _id: "7",
    rank: 7,
    participant: "Emily Johnson",
    team: "Writers Guild",
    category: "Literary",
    score: 95.0,
    event: "Poetry Slam",
  },
  {
    _id: "8",
    rank: 8,
    participant: "Raj Patel",
    team: "Virtuoso Academy",
    category: "Music",
    score: 94.7,
    event: "Indian Classical",
  },
]

const staticEvents: Event[] = [
  {
    _id: "1",
    title: "Inauguration Ceremony",
    category: "Ceremony",
    date: "January 25, 2026",
    time: "9:00 AM",
    venue: "Main Auditorium",
    description: "Join us for the grand opening of Optimus Arts Festival 2026. Experience the spectacular inauguration ceremony featuring cultural performances, keynote speeches, and the lighting of the ceremonial lamp.",
    images: ["/inauguration-ceremony.png"],
  },
  {
    _id: "2",
    title: "Shokul Jazeel",
    category: "Competition",
    date: "January 26-27, 2026",
    time: "10:00 AM - 6:00 PM",
    venue: "Multiple Venues",
    description: "The heart of Optimus - witness incredible talent across music, dance, drama, visual arts, and literary categories. Students from various institutions compete for glory in this prestigious arts festival.",
    images: ["/shokul-jazeel.png"],
  },
  {
    _id: "3",
    title: "Closing Ceremony",
    category: "Ceremony",
    date: "January 28, 2026",
    time: "5:00 PM",
    venue: "Main Auditorium",
    description: "Celebrate the culmination of an amazing festival! Join us for the grand finale featuring award presentations, special performances, and a spectacular closing show that you won't forget.",
    images: ["/closing-ceremony.png"],
  },
]

const staticTeamMembers: TeamMember[] = [
  { _id: "1", name: "Sarah Chen", role: "Festival Director", department: "Management" },
  { _id: "2", name: "Marcus Johnson", role: "Creative Lead", department: "Creative" },
  { _id: "3", name: "Priya Sharma", role: "Events Coordinator", department: "Events" },
  { _id: "4", name: "Alex Rivera", role: "Technical Director", department: "Technical" },
  { _id: "5", name: "Emma Thompson", role: "Marketing Head", department: "Marketing" },
  { _id: "6", name: "David Kim", role: "Stage Manager", department: "Production" },
]

const staticNews: NewsArticle[] = [
  {
    _id: "1",
    title: "Optimus Arts Fest 2026 Dates Announced",
    excerpt: "Mark your calendars for the biggest cultural extravaganza.",
    content: "",
    author: "Festival Committee",
    date: "2025-12-01",
    category: "Announcement",
  },
  {
    _id: "2",
    title: "New Categories Added This Year",
    excerpt: "Exciting new competition categories to showcase diverse talents.",
    content: "",
    author: "Events Team",
    date: "2025-12-15",
    category: "Update",
  },
  {
    _id: "3",
    title: "Registration Opens January 5th",
    excerpt: "Early bird registrations get exclusive benefits.",
    content: "",
    author: "Registration Desk",
    date: "2025-12-20",
    category: "Announcement",
  },
]

const staticTestimonials: Testimonial[] = [
  {
    _id: "1",
    name: "Aisha Rahman",
    role: "Winner 2025 - Dance",
    content: "Optimus Arts Fest changed my life. The platform, the judges, the energy - everything was world-class.",
  },
  {
    _id: "2",
    name: "Nikhil Sharma",
    role: "Participant 2024 - Music",
    content: "An incredible experience that pushed me to discover talents I never knew I had.",
  },
  {
    _id: "3",
    name: "Dr. Meera Iyer",
    role: "Judge - Classical Arts",
    content: "The level of talent and organization at Optimus is truly exceptional.",
  },
]

const staticGalleryImages: GalleryImage[] = [
  { _id: "1", src: "/dance-performance-stage-lights.jpg", alt: "Dance Performance", category: "Dance", year: 2025 },
  { _id: "2", src: "/music-concert-stage.png", alt: "Music Concert", category: "Music", year: 2025 },
  { _id: "3", src: "/art-exhibition-gallery.png", alt: "Art Exhibition", category: "Art", year: 2025 },
  { _id: "4", src: "/drama-theatre-performance.jpg", alt: "Drama Performance", category: "Drama", year: 2025 },
  { _id: "5", src: "/cultural-festival-crowd.jpg", alt: "Festival Crowd", category: "General", year: 2025 },
  { _id: "6", src: "/award-ceremony-stage.jpg", alt: "Award Ceremony", category: "General", year: 2025 },
]

export async function getResults(search?: string, category?: string): Promise<Result[]> {
  let results = [...staticResults]
  if (search) {
    const searchLower = search.toLowerCase()
    results = results.filter(
      (r) =>
        r.participant.toLowerCase().includes(searchLower) ||
        r.team?.toLowerCase().includes(searchLower) ||
        r.event.toLowerCase().includes(searchLower),
    )
  }
  if (category && category !== "all") {
    results = results.filter((r) => r.category.toLowerCase() === category.toLowerCase())
  }
  return results.sort((a, b) => a.rank - b.rank)
}

export async function getEvents(category?: string): Promise<Event[]> {
  // Import dynamically to avoid issues with server/client boundaries
  const { getEventsData } = await import("./events-storage")
  const events = await getEventsData()

  if (category && category !== "all") {
    return events.filter((e) => e.category.toLowerCase() === category.toLowerCase())
  }
  return events
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  return staticTeamMembers
}

export async function getNews(): Promise<NewsArticle[]> {
  return staticNews
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return staticTestimonials
}

export async function getGalleryImages(category?: string): Promise<GalleryImage[]> {
  if (category && category !== "all") {
    return staticGalleryImages.filter((i) => i.category.toLowerCase() === category.toLowerCase())
  }
  return staticGalleryImages
}

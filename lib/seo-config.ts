/**
 * SEO Configuration for Optimus Arts Fest
 * Centralized configuration for all SEO-related metadata
 */

export const siteConfig = {
    name: "Optimus Arts Fest",
    title: "Optimus Arts Fest 2026 | Ihyaul Aman Student Union",
    description:
        "Official portal for Optimus Arts Fest 2026. Live results, schedules, and updates from the Ihyaul Aman Student Union arts festival at Darul Aman, Edavannappara.",
    url: "https://optimusfest.in",
    ogImage: "/optimus-og-banner.jpg",
    keywords: [
        "Optimus",
        "Optimus Arts Fest",
        "Optimus Fest",
        "Optimus 2026",
        "Ihyaul Aman Student Union",
        "Darul Aman Arts Fest",
        "Edavannappara Fest",
        "Arts Festival Results",
        "Optimus Live Point Table",
        "cultural event",
        "music competition",
        "dance performance",
        "drama theatre",
        "visual arts",
    ],
    authors: [{ name: "Fikavo Collective" }, { name: "Ihyaul Aman" }],
    creator: "Fikavo Collective",
    publisher: "Ihyaul Aman Student Union",
    locale: "en_IN",
    type: "website",
}

// Structured Data Schemas for AEO
export const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Ihyaul Aman Student Union",
    alternateName: "Optimus Arts Fest",
    url: siteConfig.url,
    logo: `${siteConfig.url}/optimus-logo.png`,
    description: siteConfig.description,
    contactPoint: {
        "@type": "ContactPoint",
        contactType: "Event Organizer",
        availableLanguage: ["English", "Malayalam"],
    },
}

export const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Optimus Arts Fest 2026",
    startDate: "2026-01-25",
    endDate: "2026-01-26",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
        "@type": "Place",
        name: "Darul Aman Integrated Islamic Academy",
        address: {
            "@type": "PostalAddress",
            streetAddress: "Edavannappara",
            addressLocality: "Malappuram",
            addressRegion: "KL",
            postalCode: "673645",
            addressCountry: "IN"
        }
    },
    organizer: {
        "@type": "Organization",
        name: "Ihyaul Aman Student Union",
        url: siteConfig.url
    },
    description: "Optimus Arts Fest is the annual cultural festival of Ihyaul Aman Student Union at Darul Aman, Edavannappara. Featuring live arts competitions, literary events, and stage performances.",
    image: [`${siteConfig.url}/optimus-logo.png`]
}

export const faqSchema = (faqs: { question: string; answer: string }[]) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
        },
    })),
})

export const breadcrumbSchema = (items: { name: string; url: string }[]) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: `${siteConfig.url}${item.url}`,
    })),
})

export const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: {
        "@type": "Organization",
        name: siteConfig.publisher,
    },
    potentialAction: {
        "@type": "SearchAction",
        target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteConfig.url}/results?search={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
    },
}

// Common FAQs for AEO
export const commonFAQs = [
    {
        question: "What is Optimus Arts Fest?",
        answer:
            "Optimus Arts Fest is a premier celebration of artistic excellence featuring competitions in music, dance, drama, and visual arts. It showcases emerging talents and celebrates creativity across multiple artistic disciplines.",
    },
    {
        question: "Who organizes Optimus Arts Fest?",
        answer: "Optimus Arts Fest is organized by the Ihyaul Aman Student Union of Darul Aman Integrated Islamic Academy.",
    },
    {
        question: "Where is Optimus Arts Fest 2026 held?",
        answer: "The festival is held at Darul Aman Integrated Islamic Academy, Edavannappara, Malappuram.",
    },
    {
        question: "How can I view the live results?",
        answer: "Live results, point tables, and schedules are available on our official website: https://optimusfest.in",
    },
]

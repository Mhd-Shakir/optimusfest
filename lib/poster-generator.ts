/**
 * Result Poster Generator
 * Automatically generates beautiful result posters with student details
 */

export interface PosterData {
    studentName: string
    event: string
    category: string
    rank: number
    resultNumber: string // Format like "01", "02", "03"
}

/**
 * Generates an SVG poster for a result
 */
export function generatePosterSVG(data: PosterData): string {
    const { studentName, event, category, rank, resultNumber } = data

    // Medal/Position emoji mapping
    const positionEmoji = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : "🏅"

    // Gradient colors based on rank
    const gradientColors =
        rank === 1
            ? { start: "#FFD700", end: "#FFA500" } // Gold
            : rank === 2
                ? { start: "#C0C0C0", end: "#808080" } // Silver
                : rank === 3
                    ? { start: "#CD7F32", end: "#8B4513" } // Bronze
                    : { start: "#9333EA", end: "#EC4899" } // Purple-Pink

    const svg = `
<svg width="1200" height="1600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${gradientColors.start};stop-opacity:0.2" />
      <stop offset="100%" style="stop-color:${gradientColors.end};stop-opacity:0.2" />
    </linearGradient>
    <linearGradient id="headerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#9333EA;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#EC4899;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#F97316;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="boxGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${gradientColors.start};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${gradientColors.end};stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="1200" height="1600" fill="url(#bgGradient)"/>
  <rect width="1200" height="1600" fill="white" opacity="0.95"/>
  
  <!-- Decorative circles -->
  <circle cx="100" cy="100" r="150" fill="${gradientColors.start}" opacity="0.1"/>
  <circle cx="1100" cy="200" r="100" fill="${gradientColors.end}" opacity="0.1"/>
  <circle cx="150" cy="1400" r="120" fill="${gradientColors.start}" opacity="0.1"/>
  <circle cx="1050" cy="1500" r="80" fill="${gradientColors.end}" opacity="0.1"/>
  
  <!-- Header with gradient -->
  <rect x="0" y="0" width="1200" height="200" fill="url(#headerGradient)"/>
  
  <!-- Optimus Arts Fest Title -->
  <text x="600" y="90" font-family="Arial, sans-serif" font-size="56" font-weight="bold" fill="white" text-anchor="middle">
    OPTIMUS ARTS FEST
  </text>
  <text x="600" y="150" font-family="Arial, sans-serif" font-size="36" fill="white" text-anchor="middle" opacity="0.9">
    Competition Results
  </text>
  
  <!-- RESULT Label -->
  <text x="600" y="280" font-family="Arial, sans-serif" font-size="40" font-weight="600" fill="#666" text-anchor="middle" letter-spacing="4">
    RESULT
  </text>
  
  <!-- Event Result Number -->
  <text x="600" y="370" font-family="Arial, sans-serif" font-size="120" font-weight="bold" fill="url(#boxGradient)" text-anchor="middle">
    ${resultNumber}
  </text>
  
  <!-- Small Category Box -->
  <rect x="400" y="450" width="400" height="80" rx="15" fill="#F3F4F6" stroke="${gradientColors.start}" stroke-width="3"/>
  <text x="600" y="500" font-family="Arial, sans-serif" font-size="32" fill="#666" text-anchor="middle">
    ${category} Category
  </text>
  
  <!-- Event Name Box (Big Font) -->
  <rect x="100" y="580" width="1000" height="140" rx="20" fill="url(#boxGradient)"/>
  <text x="600" y="675" font-family="Arial, sans-serif" font-size="64" font-weight="bold" fill="white" text-anchor="middle">
    ${event.toUpperCase()}
  </text>
  
  <!-- Big Box for Student Name and Position -->
  <rect x="80" y="800" width="1040" height="600" rx="30" fill="white" stroke="${gradientColors.start}" stroke-width="4"/>
  
  <!-- Position/Rank Badge -->
  <circle cx="600" cy="950" r="100" fill="url(#boxGradient)"/>
  <text x="600" y="935" font-family="Arial, sans-serif" font-size="80" text-anchor="middle">
    ${positionEmoji}
  </text>
  <text x="600" y="1010" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="white" text-anchor="middle">
    ${rank === 1 ? "1st" : rank === 2 ? "2nd" : rank === 3 ? "3rd" : rank + "th"}
  </text>
  
  <!-- WINNER Label -->
  <text x="600" y="1120" font-family="Arial, sans-serif" font-size="36" fill="#666" text-anchor="middle" letter-spacing="3">
    ${rank <= 3 ? "WINNER" : "PARTICIPANT"}
  </text>
  
  <!-- Student Name -->
  <text x="600" y="1220" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="#1F2937" text-anchor="middle">
    ${studentName.toUpperCase()}
  </text>
  
  <!-- Decorative line -->
  <line x1="250" y1="1280" x2="950" y2="1280" stroke="${gradientColors.start}" stroke-width="3" opacity="0.3"/>
  
  <!-- Congratulations text -->
  <text x="600" y="1350" font-family="Arial, sans-serif" font-size="36" fill="${gradientColors.end}" text-anchor="middle" font-style="italic">
    Congratulations!
  </text>
  
  <!-- Footer -->
  <rect x="0" y="1450" width="1200" height="150" fill="#F3F4F6"/>
  <text x="600" y="1520" font-family="Arial, sans-serif" font-size="28" fill="#666" text-anchor="middle">
    Optimus Arts Festival 2026
  </text>
  <text x="600" y="1560" font-family="Arial, sans-serif" font-size="24" fill="#999" text-anchor="middle">
    Excellence in Arts & Culture
  </text>
</svg>`

    return svg
}

/**
 * Generate a sequential result number based on count
 * e.g., 1 -> "01", 12 -> "12", 123 -> "123"
 */
export function generateResultNumber(count: number): string {
    return count.toString().padStart(2, "0")
}

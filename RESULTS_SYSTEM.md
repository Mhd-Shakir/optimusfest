# Premium Results System 🏆

## Overview
A modern, grouped results management system featuring an Instagram-style chat bot interface for users and a powerful admin panel for managing competition results with manual poster uploads.

## Features

### 🤖 User Interface (Instagram Chat Bot)
- **Interactive Chat Experience**: Instagram-style chat interface with vibrant gradients and smooth animations.
- **Grouped Results**: Results are shown per event, listing all winners (🥇🥈🥉) in a single beautiful card.
- **Multiple Search Options**:
  - 🔍 Search by student name (returns all events where they won)
  - 📂 Browse by category (Alpha, Beta, Omega, General)
  - 🏆 View all results
- **Poster Display**: View and download high-quality result posters directly from the chat.
- **Premium Design**: 
  - Glassmorphic UI elements
  - Dynamic typing indicators
  - Rank-specific badges and colors
  - Responsive mobile-first design

### 👨‍💼 Admin Interface
- **Grouped Results Management**:
  - ➕ **Publish Results**: Add results for an entire event at once.
  - 👥 **Multiple Winners**: Add multiple winners for each position (1st, 2nd, 3rd).
  - 🖼️ **Manual Poster Upload**: Upload custom-designed posters for each event.
  - 🗑️ **Delete Results**: Remove event results as needed.
- **Advanced Filtering**:
  - 🔍 Real-time search by student, event, or category.
- **Premium Publishing Dialog**: A sleek, step-by-step form for entering winners and uploading posters.

## Technical Stack

### Backend
- **Database**: MongoDB via Mongoose (`lib/models/Result.ts`)
- **API Routes**:
  - `/api/results` - Public API for fetching and searching results.
  - `/api/admin/results` - Admin API for CRUD operations.
  - `/api/admin/upload-result-poster` - Cloudinary-powered poster upload.
- **Storage**: Result data is stored in MongoDB, posters are hosted on Cloudinary.

### Frontend
- **Components**:
  - `InstagramResultsBot` - User-facing chat interface with grouped results.
  - `AdminResultsPage` - Admin management interface.
- **Libraries**:
  - Next.js 14
  - Framer Motion (Animations)
  - Lucide React (Icons)
  - Tailwind CSS

## Data Structure

```typescript
interface ResultData {
    _id: string              // MongoDB Unique ID
    event: string           // Event name
    category: string        // Category (Alpha, Beta, Omega, etc.)
    winners: Array<{
        rank: number        // Position (1, 2, 3)
        studentName: string // Winner's name
    }>
    poster?: string         // Cloudinary URL for the poster
    createdAt: string       // Timestamp
    updatedAt: string       // Timestamp
}
```

## API Endpoints

### Public API
```
GET /api/results
  ?search=<query>     - Search by student name or event
  ?category=<name>    - Filter by category
  ?event=<name>       - Filter by event
```

### Admin API
```
GET    /api/admin/results                    - Get all results
POST   /api/admin/results                    - Create new grouped result
PUT    /api/admin/results                    - Update result
DELETE /api/admin/results?id=<id>           - Delete result

POST   /api/admin/upload-result-poster      - Upload poster to Cloudinary
```

## Usage

### For Users
1. Visit the results page.
2. Interact with the **Optimus Results Bot** to find winners.
3. Search for a specific student or browse categories.
4. View the results card and click the poster to see/download the full version.

### For Admins
1. Log in to the admin dashboard.
2. Navigate to **Results Management**.
3. Click **Publish Results**.
4. Select Category and Event.
5. Add winners for each position (use "Add Another" for multiple winners in the same rank).
6. Upload the event poster.
7. Click **Save Results**.

---
*Updated on 2026-01-31 to reflect the transition to MongoDB and Grouped Results System.*

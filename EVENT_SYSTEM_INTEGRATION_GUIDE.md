# 🔗 Optimus Event Management System Integration Guide

## Overview

This guide explains how to connect your **Optimus Event Management System** (which provides results) to the **Optimus Website** (which displays results to users).

---

## 🎯 Integration Architecture

```
┌─────────────────────────────────┐
│  Optimus Event Management       │
│  System (Backend)                │
│  - Manages competitions          │
│  - Stores results                │
│  - Provides API endpoints        │
└──────────────┬──────────────────┘
               │
               │ API Calls
               │ (REST/GraphQL)
               ↓
┌─────────────────────────────────┐
│  Optimus Website (Frontend)     │
│  - Displays results              │
│  - WhatsApp chat interface       │
│  - Downloads posters             │
└─────────────────────────────────┘
```

---

## 🔌 Integration Methods

### **Method 1: REST API Integration (Recommended)**

#### **Step 1: Event Management System - Create API Endpoints**

Your Event Management System should expose these endpoints:

```typescript
// 1. Get all categories
GET /api/categories
Response: [
  {
    id: "alpha",
    name: "Alpha",
    subtitle: "General-A Category",
    description: "Senior level competitions"
  },
  ...
]

// 2. Get events by category
GET /api/categories/{categoryId}/events
Response: [
  {
    id: "alpha-classical-dance",
    name: "Classical Dance",
    venue: "Main Auditorium",
    date: "2026-01-15",
    participants: 45,
    announced: true
  },
  ...
]

// 3. Get results by event
GET /api/events/{eventId}/results
Response: {
  eventId: "alpha-classical-dance",
  eventName: "Classical Dance",
  announced: true,
  results: [
    {
      rank: 1,
      name: "Aisha Rahman",
      team: "Phoenix Academy",
      score: 98.5,
      grade: "A+"
    },
    ...
  ]
}

// 4. Get result poster
GET /api/events/{eventId}/poster?template={templateId}
Response: PDF/Image file
```

#### **Step 2: Website - Update API Calls**

Update `components/results-explorer.tsx` to fetch from your Event Management System:

```typescript
// Add at the top of the file
const API_BASE_URL = process.env.NEXT_PUBLIC_EVENT_SYSTEM_API || 'https://your-event-system.com/api'

// Replace hardcoded data with API calls
useEffect(() => {
  async function fetchCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`)
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }
  fetchCategories()
}, [])

// Fetch events when category is selected
const handleCategorySelect = async (categoryId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/${categoryId}/events`)
    const events = await response.json()
    // Update state and show events
  } catch (error) {
    console.error('Error fetching events:', error)
  }
}

// Fetch results when event is selected
const handleEventSelect = async (eventId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/results`)
    const data = await response.json()
    // Display results
  } catch (error) {
    console.error('Error fetching results:', error)
  }
}
```

#### **Step 3: Environment Configuration**

Create `.env.local` file:

```bash
# Event Management System API
NEXT_PUBLIC_EVENT_SYSTEM_API=https://your-event-system.com/api

# API Authentication (if required)
EVENT_SYSTEM_API_KEY=your-api-key-here
```

---

### **Method 2: Database Integration**

If both systems share the same database:

#### **Step 1: Create Database Schema**

```sql
-- Categories Table
CREATE TABLE categories (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  subtitle VARCHAR(200),
  description TEXT,
  emoji VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events Table
CREATE TABLE events (
  id VARCHAR(100) PRIMARY KEY,
  category_id VARCHAR(50) REFERENCES categories(id),
  name VARCHAR(200) NOT NULL,
  venue VARCHAR(200),
  event_date DATE,
  participants INT,
  announced BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Results Table
CREATE TABLE results (
  id SERIAL PRIMARY KEY,
  event_id VARCHAR(100) REFERENCES events(id),
  rank INT NOT NULL,
  participant_name VARCHAR(200) NOT NULL,
  team_name VARCHAR(200),
  score DECIMAL(5,2),
  grade VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### **Step 2: Create API Routes in Website**

Create `app/api/events/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { db } from '@/lib/database' // Your database connection

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const categoryId = searchParams.get('category')
  
  try {
    const events = await db.query(
      'SELECT * FROM events WHERE category_id = $1',
      [categoryId]
    )
    return NextResponse.json(events.rows)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}
```

---

### **Method 3: Webhook Integration**

For real-time updates when results are published:

#### **Step 1: Event Management System - Send Webhooks**

```typescript
// When results are published
async function publishResults(eventId: string) {
  // Save results to database
  await saveResults(eventId)
  
  // Send webhook to website
  await fetch('https://optimus-website.com/api/webhooks/results', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Webhook-Secret': process.env.WEBHOOK_SECRET
    },
    body: JSON.stringify({
      event: 'results.published',
      eventId: eventId,
      timestamp: new Date().toISOString()
    })
  })
}
```

#### **Step 2: Website - Handle Webhooks**

Create `app/api/webhooks/results/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
  // Verify webhook secret
  const secret = request.headers.get('X-Webhook-Secret')
  if (secret !== process.env.WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const data = await request.json()
  
  // Revalidate results page to show new data
  revalidatePath('/results')
  
  return NextResponse.json({ success: true })
}
```

---

## 🔐 Security Considerations

### **1. API Authentication**

```typescript
// Add API key to requests
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${process.env.EVENT_SYSTEM_API_KEY}`
}

fetch(`${API_BASE_URL}/events`, { headers })
```

### **2. CORS Configuration**

In your Event Management System:

```typescript
// Allow website domain
app.use(cors({
  origin: 'https://optimus-website.com',
  credentials: true
}))
```

### **3. Rate Limiting**

```typescript
// Implement rate limiting
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})

app.use('/api/', limiter)
```

---

## 📊 Data Synchronization

### **Option A: Real-time (Recommended)**

```typescript
// Use Server-Sent Events (SSE) or WebSockets
const eventSource = new EventSource(`${API_BASE_URL}/events/stream`)

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data)
  if (data.type === 'results_published') {
    // Refresh results
    fetchResults(data.eventId)
  }
}
```

### **Option B: Polling**

```typescript
// Poll for updates every 30 seconds
useEffect(() => {
  const interval = setInterval(() => {
    fetchLatestResults()
  }, 30000)
  
  return () => clearInterval(interval)
}, [])
```

### **Option C: Cache with Revalidation**

```typescript
// Use Next.js ISR (Incremental Static Regeneration)
export const revalidate = 60 // Revalidate every 60 seconds

export async function getStaticProps() {
  const results = await fetchResults()
  return {
    props: { results },
    revalidate: 60
  }
}
```

---

## 🚀 Implementation Steps

### **Phase 1: Setup (Week 1)**

1. ✅ Document Event Management System API
2. ✅ Set up API authentication
3. ✅ Configure CORS
4. ✅ Test API endpoints

### **Phase 2: Integration (Week 2)**

1. ✅ Create API service layer in website
2. ✅ Update results-explorer component
3. ✅ Implement error handling
4. ✅ Add loading states

### **Phase 3: Testing (Week 3)**

1. ✅ Test with sample data
2. ✅ Test error scenarios
3. ✅ Performance testing
4. ✅ Security audit

### **Phase 4: Deployment (Week 4)**

1. ✅ Deploy to staging
2. ✅ User acceptance testing
3. ✅ Deploy to production
4. ✅ Monitor and optimize

---

## 💻 Code Example: Complete Integration

Create `lib/event-system-api.ts`:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_EVENT_SYSTEM_API!
const API_KEY = process.env.EVENT_SYSTEM_API_KEY!

class EventSystemAPI {
  private async request(endpoint: string, options = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        ...options.headers,
      },
    })
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }
    
    return response.json()
  }
  
  async getCategories() {
    return this.request('/categories')
  }
  
  async getEvents(categoryId: string) {
    return this.request(`/categories/${categoryId}/events`)
  }
  
  async getResults(eventId: string) {
    return this.request(`/events/${eventId}/results`)
  }
  
  async downloadPoster(eventId: string, templateId: number) {
    const response = await fetch(
      `${API_BASE_URL}/events/${eventId}/poster?template=${templateId}`,
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
        },
      }
    )
    return response.blob()
  }
}

export const eventSystemAPI = new EventSystemAPI()
```

Update `components/results-explorer.tsx`:

```typescript
import { eventSystemAPI } from '@/lib/event-system-api'

// Replace hardcoded data with API calls
const [categories, setCategories] = useState([])
const [loading, setLoading] = useState(true)

useEffect(() => {
  async function loadCategories() {
    try {
      const data = await eventSystemAPI.getCategories()
      setCategories(data)
    } catch (error) {
      console.error('Failed to load categories:', error)
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }
  loadCategories()
}, [])
```

---

## 📱 Mobile App Integration (Future)

If you plan to create a mobile app:

```typescript
// React Native / Flutter
const API_CONFIG = {
  baseURL: 'https://your-event-system.com/api',
  timeout: 10000,
  headers: {
    'Authorization': `Bearer ${API_KEY}`
  }
}

// Use same API endpoints
```

---

## 🔍 Monitoring & Analytics

### **Track API Usage**

```typescript
// Add analytics
import { analytics } from '@/lib/analytics'

async function fetchResults(eventId: string) {
  analytics.track('results_viewed', {
    eventId,
    timestamp: new Date()
  })
  
  return eventSystemAPI.getResults(eventId)
}
```

### **Error Tracking**

```typescript
// Use Sentry or similar
import * as Sentry from '@sentry/nextjs'

try {
  await eventSystemAPI.getResults(eventId)
} catch (error) {
  Sentry.captureException(error)
  throw error
}
```

---

## 📞 Support & Contact

For integration support:
- **Email**: tech@optimus-festival.com
- **Documentation**: https://docs.optimus-festival.com
- **API Status**: https://status.optimus-festival.com

---

## ✅ Checklist

Before going live:

- [ ] API endpoints documented
- [ ] Authentication configured
- [ ] CORS properly set up
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Security audit completed
- [ ] Performance tested
- [ ] Monitoring enabled
- [ ] Backup plan ready
- [ ] Team trained

---

**Ready to integrate? Start with Method 1 (REST API) for the quickest setup!** 🚀

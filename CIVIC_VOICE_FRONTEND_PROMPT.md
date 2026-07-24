# CIVIC VOICE — PREMIUM FRONTEND MASTER PROMPT

---

You are a Senior Product Designer who has worked at Apple, Stripe, Linear, and Vercel combined.

DO NOT generate a generic AI dashboard.
DO NOT use default Tailwind templates.
DO NOT create something that looks like a CRUD admin panel.
DO NOT make it look like a government website.
DO NOT use boring blue-gray color schemes.

My backend is already 100% complete with Node.js + Express.js + MongoDB.
My AI service is running on Python FastAPI with YOLOv8 + Gemini 2.5 Flash + NLP.

Your job is ONLY to build a premium frontend that connects to my existing backend APIs.

---

## PROJECT

**Civic Voice** — Smart Civic Complaint Management System
A platform where Indian citizens report civic issues (potholes, garbage, broken streetlights, water leakage) and AI automatically classifies, prioritizes, and routes complaints to the correct municipality department.

**Goal:**
Create a frontend that looks like a real SaaS product built by an experienced product design team — not a government portal, not an AI slop dashboard.

I want people to think:
> "This is the best civic tech product I have ever seen."

---

## DESIGN STYLE

Create a futuristic premium civic interface inspired by:
- Linear (clean, fast, keyboard-first)
- Stripe Dashboard (data-rich, trustworthy)
- Vercel (minimal, elegant, developer-quality)
- Apple (emotion, polish, whitespace)
- Arc Browser (personality, color, layers)
- Framer (motion, depth, creativity)
- Notion (clean typography, calm focus)
- Raycast (command palette, speed)

Mix all into one unique design.
Do NOT look identical to any one product.
Do NOT look like a typical Indian government civic portal.

**InSPIRATION FROM STITCH PROJECT:
- Civic Care Frontend Design System**
- Color palette: Professional blue-based design with trust colors
- Typography: Open Sans with excellent readability
- Glassmorphism principles
- Map-based interfaces with clean layouts
- Modern card-based UI with depth and shadows
- Mobile-first responsive design with desktop optimizations

---

## THEME

- Dark mode as default
- Background: deep dark navy with subtle texture
- Glassmorphism ONLY where it adds depth — not everywhere
- Soft blur on cards
- Floating cards with depth
- Rounded corners: 16–20px
- Premium shadows (not harsh box shadows)
- Smooth gradients — never flat color blocks
- Very subtle glowing borders on interactive elements
- Noise texture overlay on background
- Beautiful spacing — breathable, not cramped
- Excellent typography hierarchy
- NO ugly Tailwind defaults
- NO Bootstrap look
- NO Material Design look

---

## COLOR PALETTE

```
Background Primary:    #080C14
Background Secondary:  #0D1220
Background Card:       #111827

Primary Blue:          #3B82F6
Primary Purple:        #8B5CF6
Success Green:         #10B981
Warning Amber:         #F59E0B
Danger Red:            #EF4444
Accent Cyan:           #06B6D4

Accent Gradients:
  Blue   → Purple  (#3B82F6 → #8B5CF6)
  Teal   → Blue    (#14B8A6 → #3B82F6)
  Purple → Pink    (#8B5CF6 → #EC4899)

Severity Colors:
  Critical:  #EF4444 (red glow)
  High:      #F59E0B (amber glow)
  Medium:    #3B82F6 (blue glow)
  Low:       #10B981 (green glow)

Status Colors:
  Submitted:    #6B7280
  Under Review: #F59E0B
  Assigned:     #3B82F6
  In Progress:  #8B5CF6
  Resolved:     #10B981
  Closed:       #374151
```

Very minimal use of bright colors.
Color should convey meaning — severity, status, urgency.

---

## TYPOGRAPHY

Use **Inter** or **Plus Jakarta Sans**

- Large bold headings — confident, not loud
- Clean body text — readable at all sizes
- Monospace for IDs, codes, timestamps
- Beautiful line height and letter spacing
- No ugly default font rendering

---

## ANIMATION

Use **Vanilla CSS animations + GSAP or requestAnimationFrame**
(No React, no Framer Motion — pure HTML/CSS/JS)

- Page transitions — smooth fade + slide
- Card hover lift — translateY(-4px) + shadow increase
- Button press — subtle scale down
- Glow on hover — box-shadow color pulse
- Animated statistics — count up numbers on load
- Fade + slide on all elements entering viewport
- Micro interactions everywhere
- Floating blobs in background — slow, organic movement
- Smooth loading skeletons — shimmer placeholders
- Animated progress bars — fill on load
- Staggered animations — elements appear one by one
- Nothing should instantly appear
- AI analysis loader — unique animated pulse showing "AI thinking"
- Map pin drop animation
- Status change transition — smooth color morph

---

## LAYOUT

- Full responsive — desktop first
- Tablet optimized
- Mobile optimized (citizens will use mobile)
- No wasted space
- Sticky navigation
- Floating action buttons
- Collapsible sidebar on desktop
- Bottom navigation on mobile
- Clean grid system

---

## TECH STACK (Frontend Only)

```
HTML5
CSS3 (custom properties, no framework defaults)
Vanilla JavaScript (ES6+)
Tailwind CSS (utility only, heavily customized)
Antigravity (smooth animations)
Figma design tokens
Leaflet.js (maps)
Chart.js (analytics charts)
Axios (API calls)
```

---

## PAGES TO BUILD

---

### 1. LANDING PAGE

**Hero Section:**
- Animated headline: "Your City. Your Voice. Fast Fixes."
- Subheadline explaining AI-powered routing
- Two CTAs: "Report a Complaint" (primary) + "Track Your Complaint" (secondary)
- Animated illustration — city with glowing issue pins appearing and getting resolved
- Floating particles in background

**How It Works Section:**
- 3-step animated flow: Upload Photo → AI Analyzes → Department Fixes
- Each step card with icon, number, description
- Connecting animated line between steps

**Statistics Section:**
- Animated counters: Complaints Resolved / Departments Connected / Cities Active / Avg Resolution Time
- Numbers count up when scrolled into view

**Features Section:**
- Floating feature cards with hover glow
- AI Auto-Classification / Real-time Tracking / GPS Location / Proof Required / Department Routing / Mobile First

**Departments Section:**
- Show 6 Indian municipality departments as cards
- Roads & Highways / Solid Waste Management / Water Supply & Drainage Board / Street Lighting / Town Planning / Parks & Horticulture
- Each with icon and color coding

**Testimonials:**
- Citizen quotes with avatar, name, area

**Footer:**
- Clean, minimal
- Links, social, copyright
- "Powered by Greater Chennai Corporation"

---

### 2. AUTHENTICATION PAGES

**Login Page:**
- Split layout — left side animated city illustration, right side form
- Email + Password inputs with floating labels
- "Remember me" toggle
- Forgot password link
- Role auto-detected from credentials
- Animated background — slow moving gradient
- Error shake animation on wrong credentials

**Register Page:**
- Same split layout
- Name / Email / Phone / Password / Confirm Password
- Role selection: Citizen only (officers added by admin)
- Real-time validation with green checkmarks
- Password strength meter with animation

**Forgot Password:**
- Clean centered card
- Email input
- OTP verification step
- New password step
- Success animation — checkmark draw

---

### 3. CITIZEN DASHBOARD

**Welcome Section:**
- Personalized greeting: "Good morning, [Name] 👋"
- Complaint activity summary
- Quick action button: "Report New Issue" — floating, prominent

**My Complaints Feed:**
- Card-based layout
- Each card shows: thumbnail, category badge, severity badge, status badge, location, date, department
- Status badge with color glow matching severity system
- Click to expand full detail
- Empty state: beautiful illustration with "No complaints yet. Be the first to report an issue in your area."

**Complaint Detail View:**
- Full complaint view as slide-in panel
- Original photo + AI annotated photo side by side
- AI analysis result card: category, severity, confidence score, smart description
- Status timeline — animated vertical stepper
- Department assigned card
- Officer name (if assigned)
- Proof photo (when resolved)
- Share button

**Submit Complaint Page:**
- Multi-step form — 3 steps with animated progress bar

  **Step 1 — Upload**
  - Large drag-and-drop zone
  - Camera capture option (mobile)
  - Preview uploaded image
  - "AI will analyze your photo automatically" hint text

  **Step 2 — AI Analysis**
  - Full screen AI analyzing animation — unique, premium
  - Show: "Detecting issue type..." → "Classifying severity..." → "Finding department..." → "Done ✓"
  - Result card appears with detected category, severity, department, confidence
  - Citizen can correct if AI is wrong (dropdown overrides)
  - Smart description shown in editable textarea

  **Step 3 — Details**
  - Title (auto-filled from AI, editable)
  - Description (AI generated, editable)
  - GPS location auto-detected with map preview
  - Manual address override option
  - Submit button with ripple effect

**After Submit:**
- Full page success animation
- Complaint ID shown prominently
- "Track your complaint" CTA
- Share on WhatsApp button

---

### 4. OFFICER DASHBOARD

**Header:**
- Officer name, department badge, complaints assigned count

**Complaint Queue:**
- Kanban-style or list view toggle
- Filter by: severity, date, area
- Each complaint card: photo thumbnail, AI tags, severity glow, location
- "Accept" button → status changes to In Progress with animation

**Complaint Detail Panel:**
- Slide-in from right
- Photo, AI analysis, citizen description
- Map showing GPS location
- Accept / Reject buttons
- Upload proof photo (only shown when In Progress)
- Mark Complete button (only after proof uploaded)
- Status update animates in real time

**Map View:**
- Full screen Leaflet.js map
- Complaint pins color-coded by severity
- Click pin → complaint card pops up
- Filter by category, severity, status

---

### 5. HEAD OFFICER DASHBOARD

**Department Overview:**
- Department name header with icon
- Stats: Total Assigned / In Progress / Resolved / Pending
- Animated donut chart — complaint status distribution

**Officers List:**
- Card grid of officers in department
- Each: avatar, name, complaints assigned, resolved count, active status
- Add Officer button → modal form

**Complaint Overview:**
- Table of all department complaints
- Sortable by severity, date, status
- Assign to officer inline dropdown

---

### 6. ADMIN DASHBOARD

**Overview Page:**
- Full analytics overview
- Total complaints today / this week / this month
- Resolution rate percentage
- Avg resolution time
- Department performance comparison bar chart
- Recent activity feed
- Live complaint map — all cities

**Complaints Management:**
- Advanced table with filters
- Filter by: department, severity, status, date range, area
- Bulk actions: assign, escalate, close
- Export as CSV button
- Search with instant filter

**Users Management:**
- Tabs: Citizens / Officers / Head Officers / Admins
- Add user modal
- Edit user slide-in panel
- Delete with confirmation dialog
- Role badge color coded

**Departments Management:**
- 6 department cards
- Each: name, head officer, total officers, active complaints, resolved count
- Add / Edit / Delete department
- Add officers to department

**Analytics Page:**
- Complaints by category — bar chart
- Complaints by severity — donut chart
- Resolution time trend — line chart
- Department performance — horizontal bar chart
- Heatmap of complaint locations on map
- All charts animated on load

**Settings:**
- System settings
- Notification settings
- Role management
- Audit log table

---

## COMPONENTS TO BUILD

```
PremiumButton        — gradient, glow, ripple, loading state
FloatingInput        — floating label, validation, error state
SearchBar            — instant search with keyboard shortcut hint
StatusBadge          — color + glow per status
SeverityBadge        — color + icon per severity
ComplaintCard        — hover lift, thumbnail, badges
AIResultCard         — confidence bar, category, department
DepartmentCard       — icon, color, stats
OfficerCard          — avatar, name, stats
StatsCounter         — animated count up
ProgressRing         — animated SVG ring
TimelineStep         — vertical animated stepper
MapView              — Leaflet with custom markers
ImageUploader        — drag drop, preview, camera
AIAnalysisLoader     — premium animated AI thinking state
Sidebar              — collapsible, role-aware menu
TopNav               — breadcrumb, notifications, avatar
NotificationPanel    — slide-in, grouped by type
ConfirmDialog        — smooth modal, destructive warning
ToastNotification    — slide-in from corner, auto dismiss
EmptyState           — illustration + message + CTA
LoadingSkeleton      — shimmer placeholder
DataTable            — sort, filter, paginate, select
CommandPalette       — Ctrl+K search across everything
ThemeToggle          — smooth dark/light transition
MobileBottomNav      — citizen mobile navigation
ProofUploadZone      — officer proof photo upload
```

---

## BACKEND API INTEGRATION

Backend already exists on Node.js + Express.js.
AI service already exists on Python FastAPI.

DO NOT create mock backend.
DO NOT create fake data.
DO NOT hardcode anything.

Create a clean API layer:

```javascript
// api/index.js — Axios instance
const api = axios.create({
  baseURL: process.env.API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
})

// Attach JWT automatically
api.interceptors.request.use(config => {
  const token = localStorage.getItem('civic_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('civic_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)
```

**API Services:**
```
services/auth.service.js        → register, login, logout, getMe
services/complaint.service.js   → submit, getAll, getMy, getById, updateStatus, assign, uploadProof
services/user.service.js        → getAll, getById, create, update, delete
services/department.service.js  → getAll, create, update, delete, addOfficer
services/ai.service.js          → analyze (image + text → FastAPI)
services/analytics.service.js   → dashboard stats, charts data
```

**Auth:**
- JWT stored in localStorage with key `civic_token`
- Role stored in localStorage with key `civic_role`
- Role-based page redirect on login
- Protected pages redirect to /login if no token

**Environment Variables:**
```
API_BASE_URL=http://localhost:5000/api
AI_SERVICE_URL=http://localhost:8000
```

---

## FOLDER STRUCTURE

```
client/
├── index.html                  ← Landing page
├── login.html
├── register.html
├── citizen/
│   ├── dashboard.html
│   ├── submit.html
│   └── track.html
├── officer/
│   ├── dashboard.html
│   └── map.html
├── head-officer/
│   └── dashboard.html
├── admin/
│   ├── dashboard.html
│   ├── complaints.html
│   ├── users.html
│   ├── departments.html
│   └── analytics.html
├── css/
│   ├── base.css                ← CSS variables, reset
│   ├── components.css          ← All reusable components
│   ├── animations.css          ← All animations
│   ├── landing.css
│   ├── auth.css
│   ├── dashboard.css
│   └── mobile.css
├── js/
│   ├── api/
│   │   └── index.js            ← Axios instance
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── complaint.service.js
│   │   ├── user.service.js
│   │   ├── department.service.js
│   │   └── ai.service.js
│   ├── components/
│   │   ├── sidebar.js
│   │   ├── toast.js
│   │   ├── modal.js
│   │   ├── table.js
│   │   └── map.js
│   ├── pages/
│   │   ├── landing.js
│   │   ├── login.js
│   │   ├── citizen-dashboard.js
│   │   ├── submit-complaint.js
│   │   ├── officer-dashboard.js
│   │   └── admin-dashboard.js
│   └── utils/
│       ├── auth.js             ← Token helpers, role check
│       ├── format.js           ← Date, number formatting
│       └── constants.js        ← Status, severity, department maps
└── assets/
    ├── icons/
    ├── illustrations/
    └── images/
```

---

## UX RULES

- Every interaction must feel delightful
- Every click must have visual feedback
- Every form must validate beautifully in real time
- No sudden layout shifts
- No janky animations
- Everything must feel expensive and intentional
- Loading states for every API call
- Error states with helpful messages
- Empty states with beautiful illustrations
- Success states with satisfying animations
- Mobile citizens must feel this was built for them first

---

## EXTRA INSTRUCTIONS

Before writing any code, spend time designing the UI architecture.

Think like a Senior Product Designer who has shipped products used by millions.

Do NOT use prebuilt dashboard layouts.
Do NOT copy common AI patterns.
Do NOT use generic card layouts.

Every screen must have a unique visual identity while maintaining system-wide consistency.

If any screen looks generic or boring — redesign it until it feels like a premium civic tech product that could win a design award.

The goal: when a hackathon judge opens this on their laptop, their first reaction should be:

> "This team built something real."

Indian municipality departments in the system:
1. Roads & Highways Department
2. Solid Waste Management
3. Water Supply & Drainage Board
4. Street Lighting Department
5. Town Planning Department
6. Parks & Horticulture Department

Severity system:
- Critical → Red glow → 1 day resolution
- High → Amber glow → 3 days resolution
- Medium → Blue glow → 7 days resolution
- Low → Green glow → 14 days resolution

Status flow:
submitted → under_review → assigned → in_progress → resolved → closed

The product is called **Civic Voice**.
Tagline: **"Your city. Your voice. Fast fixes."**

# 🚀 AI MASTER PROMPT: FULL-FEATURED 3D/MODERN PORTFOLIO & REALTIME CMS

> **INSTRUCTION FOR THE USER:**  
> Copy and paste the entire prompt below into any AI agent (Claude, ChatGPT, Gemini, Cursor, Antigravity, etc.).  
> Before sending, fill in your personal information in the **[PORTFOLIO DATA CONFIGURATION]** section below.  
> The AI agent will automatically design and build a complete, state-of-the-art portfolio website with all backend, CMS, lightbox, and realtime synchronization features!

---

```markdown
# 🌟 MASTER SYSTEM PROMPT: ULTRA-MODERN PORTFOLIO & REALTIME ADMIN CMS

You are an elite Full-Stack Web Architect and Creative UI/UX Designer.
Your task is to build a complete, production-ready, ultra-modern Personal Portfolio Website and full-featured Admin CMS Dashboard from scratch.

--------------------------------------------------------------------------------
🎨 DESIGN DIRECTIVE: 100% CREATIVE DESIGN FREEDOM FOR THE AI AGENT
--------------------------------------------------------------------------------
- You have COMPLETE CREATIVE FREEDOM over the visual aesthetic, color palette, typography, micro-animations, glassmorphism, 3D card tilts, and spatial styling.
- DO NOT replicate a plain or generic template. Craft an original, breathtaking, state-of-the-art visual identity tailored to the portfolio owner's craft.
- Use modern Google Fonts (e.g. Outfit, Plus Jakarta Sans, Inter, Space Grotesk, Syne, or Sora).
- Incorporate subtle glassmorphism, luminous gradient glows, ambient lighting, smooth hover transitions, and clean typography hierarchy.
- Ensure 100% flawless responsiveness across mobile devices, tablets, laptops, and ultra-wide screens.

--------------------------------------------------------------------------------
👤 1. PORTFOLIO DATA CONFIGURATION (USER CUSTOMIZATION SECTION)
--------------------------------------------------------------------------------
[The user can fill in or customize their details below. If any field is left blank, provide premium, realistic default data.]

* FULL NAME: [e.g., Alex Rivera / Rammohan Murmu]
* PRIMARY ROLES / TITLES: [e.g., Graphics Designer, 3D Web Creator, Cinematic Video Editor]
* HERO TAGLINE: [e.g., Transforming bold concepts into viral visuals, high-conversion 3D web experiences, and cinematic stories.]
* SHORT BIO / ABOUT STORY: [e.g., Over 5+ years of experience helping brands, creators, and studios stand out through bespoke digital design and interactive storytelling.]
* LOCATION: [e.g., Kolkata, India / San Francisco, CA / Remote Worldwide]
* EMAIL ADDRESS: [e.g., creator@example.com]
* PHONE NUMBER: [e.g., +91 9876543210]
* WHATSAPP NUMBER: [e.g., 919876543210] (without '+' or dashes, for direct api links)
* SOCIAL PROFILES:
  - YouTube: [e.g., https://youtube.com/@channel]
  - Behance / Dribbble: [e.g., https://behance.net/username]
  - LinkedIn: [e.g., https://linkedin.com/in/username]
  - GitHub: [e.g., https://github.com/username]
  - Instagram / X: [e.g., https://instagram.com/username]
* CORE SERVICES:
  1. Service 1: [e.g., Brand Identity & Graphics Design (Thumbnails, Posters, Logos)]
  2. Service 2: [e.g., Interactive 3D Web Experiences & UI/UX Design (Figma, HTML5, CSS3)]
  3. Service 3: [e.g., Cinematic Video Editing & Motion Graphics (Teasers, Reels, Commercials)]
* FEATURED PROJECTS / WORKS:
  - Provide 4-8 initial projects across different categories with title, category, subcategory, cover banner, description, client, duration, and tools.
* SUPABASE CLOUD BACKEND CREDENTIALS (OPTIONAL / LOCAL STORAGE FALLBACK):
  - Supabase Project URL: [e.g., https://xyzcompany.supabase.co or leave blank for local mode]
  - Supabase Anon Public Key: [e.g., eyJhbGciOi... or leave blank for local mode]
  - Admin Fallback PIN: [Default: 1234]

--------------------------------------------------------------------------------
🛠️ 2. TECHNOLOGY STACK & ARCHITECTURE
--------------------------------------------------------------------------------
1. Frontend Architecture:
   - Pure Semantic HTML5 (`index.html` for Public Portfolio, `admin.html` for CMS).
   - Vanilla CSS3 with a unified CSS variable design system (`css/style.css`, `css/admin.css`).
   - Modular Modern JavaScript (ES6+) (`js/main.js`, `js/data.js`, `js/supabase-config.js`, `js/admin.js`).
   - Zero heavyweight framework dependencies; lightning-fast load times.
2. Backend & Cloud Integration:
   - Supabase JavaScript Client SDK (via official CDN).
   - Supabase PostgreSQL Database for cloud persistence.
   - Supabase Realtime Channels for live instant cross-device updates.
   - Supabase Auth for admin login and secure password recovery.
   - Supabase Storage Bucket (`portfolio-media`) for project and banner uploads.
   - Offline-first resilient fallback: Browser `localStorage` + `data.json` static baseline.

--------------------------------------------------------------------------------
🚀 3. DETAILED FUNCTIONAL SPECIFICATION & FEATURE MATRIX
--------------------------------------------------------------------------------

### A. PUBLIC PORTFOLIO WEBSITE (`index.html`)

1. Dynamic Preloader / Splash Screen:
   - Dynamic profile avatar or initials badge generated from active profile data.
   - Owner name and subtitle animated on screen.
   - Real animated progress bar and counter (0% to 100%).
   - Smooth dismiss transition unlocking page scroll once ready.

2. Interactive Header & Navigation:
   - Sticky navbar with backdrop blur active on scroll.
   - Desktop nav links with smooth section scrolling and active link highlighting via IntersectionObserver.
   - Call-to-action button ("Let's Talk" -> triggers Direct WhatsApp Inquiry Modal).
   - Mobile 3-line hamburger button that smoothly animates into a close "X".
   - Slide-out mobile drawer menu with navigation links and instant WhatsApp CTA button placed immediately below the nav list (not at bottom) so it's always visible on any screen size without scrolling.
   - YouTube Hub nav link in mobile drawer automatically shows/hides based on admin toggle.
   - Floating mobile bottom dock for quick thumb-navigation (Home, Works, Services, Contact).

3. Interactive Hero Section with 16:9 Featured Works Auto-Slider:
   - Real-time availability pulse badge ("Available for Freelance & Remote Work").
   - Dynamic typing animation cycling through the owner's roles.
   - Primary WhatsApp Action button + Secondary "Explore Works" anchor button.
   - 16:9 Showcase Banner & Featured Works Carousel:
     * Auto-advancing slides every 4.5 seconds with pause-on-hover.
     * Slide indicators / dot navigation.
     * Full touch-swipe gesture support on mobile and mouse-drag support on desktop.
     * Clicking any hero banner directly opens the project in the Project Lightbox Modal.

4. Services Showcase Section with 16:9 Media Slider:
   - Service cards detailing capabilities, tools, and tag pills.
   - Each service card contains an integrated 16:9 auto-sliding showcase banner box displaying sample works of that service.
   - Touch/swipe support on service banner sliders.
   - Direct "Inquire Service" button pre-filling the WhatsApp inquiry form.

5. Multi-Tier Works / Portfolio Filtering & Dynamic Grid:
   - Main Category filters: "All Works", "Graphic Design", "UI/UX & Web", "Cinematic Video", etc.
   - Dynamic Subcategory chip pills: Selecting a main category dynamically reveals its specific subcategories (e.g. YouTube Thumbnails, Posters & Hoardings, Logos & Branding, Teasers & Cinematic, Figma Apps).
   - Responsive grid of project cards with:
     * Category badge tag.
     * Dynamic Video Indicator: Projects with videos feature a distinct `▶ Video` badge and "Play Video" hover overlay button for instant media discoverability.
     * 16:9 thumbnail preview with hover scale and view overlay button.
     * Star rating badge calculated dynamically from client reviews.
     * Project title, concise description, and software tool pills.
     * Clicking a card triggers `openProjectModal(projectId)`.

6. Rich Multi-Media Project Lightbox Modal:
   - HIGH-CONTRAST VISIBLE CLOSE BUTTON ("X"):
     * Positioned at top-right (`top: 16px; right: 16px;`) with highest stacking priority (`z-index: 1000 !important;`).
     * Solid dark frosted circular backdrop (`background: rgba(15, 23, 42, 0.92); border: 2px solid rgba(255, 255, 255, 0.4);`).
     * Crisp, bold SVG cross icon (`stroke: #ffffff; stroke-width: 2.5; width: 20px; height: 20px;`).
     * Glowing hover state (transforms to red with scale and glow).
     * Accessible with keyboard `Escape` key shortcut and clicking the dark backdrop.
   - Universal Dynamic Media Container (Dual Video & Multi-Image):
     * Multi-image projects: Displays main image + horizontal thumbnail gallery row allowing one-click image switching.
     * Local video file support: Plays MP4/WebM video with HTML5 controls, playsinline, and autoplay.
     * Universal YouTube Player Engine (`window.YouTubeHelper`):
       - Parses and plays ANY valid YouTube URL format: standard watch links (`youtube.com/watch?v=...`), query params preceding `v=`, shortlinks (`youtu.be/...`), YouTube Shorts (`youtube.com/shorts/...`), YouTube Live (`youtube.com/live/...`), raw 11-char IDs, and full `<iframe>` embed codes.
       - Embeds bulletproof responsive iframe player with standard permissions (`allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen`).
       - Smooth autoplay on open with immediate audio/video cutoff upon closing the modal.
       - Auto-fetches YouTube HD thumbnail (`maxresdefault.jpg`) as project cover banner if no image was uploaded.
   - Project Metadata:
     * Category badge, project title, and in-depth description.
     * Client name and timeline duration cards.
     * Software and tools tag pills.
     * "Inquire Similar Project" WhatsApp button.
   - Interactive Client Reviews & Star Rating Sub-System:
     * Average rating counter (e.g. "★ 5.0 / 5.0 (3 reviews)").
     * List of verified client and community reviews with star badges.
     * Interactive review submission form: 5 clickable star rating buttons, name input, and comment field.
     * Submitting saves the review immediately to Supabase and recalculates the project's rating in real-time.

7. Smart WhatsApp Direct Dispatch Modal:
   - Interactive popup modal allowing visitors to select their project type, budget range, and project details.
   - Generates an encoded, professional WhatsApp message and redirects directly to `https://wa.me/{whatsapp_number}?text=...`.

8. Skills & Tools Matrix:
   - Categorized skills cards with proficiency percentage bars or animated badges.

9. Client Testimonials Section:
   - Showcase cards featuring client quotes, ratings, client photo/avatar, and company role.

10. YouTube Creator Channel Showcase & Social Hub Section (`#social-hub`):
    - **On/Off Visibility Toggle:** The entire section can be instantly shown or hidden on the portfolio via the Admin CMS toggle switch in Profile & Social Hub tab. When toggled off: section is hidden (`display:none`), the YouTube Hub nav link disappears from mobile drawer and desktop header.
    - Dedicated creator channel showcase featuring:
      * Channel profile avatar, channel name, handle, subscriber count badge, and glowing "▶ Subscribe" CTA button.
      * Integrated 16:9 featured video showcase player playing the channel's featured showcase video.
      * Dynamic Social Grid Cards (Instagram, Behance, Dribbble, WhatsApp Community) with glowing hover effects and direct profile routing.
      * Fully synchronized and editable in real-time from the Admin CMS Dashboard.

11. Working Contact Section:
    - Interactive contact form with input validation (Name, Email, Subject, Message).
    - Submits data to Supabase `messages` table and local store with success toast notifications.
    - Quick-copy contact cards (Email, WhatsApp, Location) with 1-click clipboard copy feedback.
    - Social links bar with glowing hover effects.

12. Ambient Canvas Particle Mesh & Visual Polish:
    - Background `<canvas>` running an interactive particle animation reacting smoothly to cursor movement.
    - Dual radial ambient glowing orbs adding visual depth.
    - Custom cursor follower with hover-scale effect.

---

### B. SECURE ADMIN CMS DASHBOARD (`admin.html`)

1. Multi-Factor Security & Authentication Portal:
   - Supabase Cloud Email/Password sign-in form.
   - "Forgot Password?" workflow triggering Supabase recovery emails with secure token redirect.
   - "Quick PIN Access" fallback allowing 4-digit PIN access (default: `1234`) for local offline administration.

2. Navigation & 3-Line Menu Architecture:
   - Main Topbar: Clean, uncluttered header displaying current tab title, description, and quick action buttons ("➕ Add Work", "💾 Export JSON"). NO messy status badges in the topbar header.
   - 3-Line Mobile & Sidebar Menu:
     * Clicking the 3-line hamburger menu opens the slide-out navigation drawer.
     * Inside the 3-line menu header, include an interactive Cloud Sync Status Widget:
       - Displays cloud status icon (`☁️`), title ("Cloud Sync"), and live state pill ("🟢 Live Connected", "🟡 Offline Mode", "🔴 Sync Error").
       - Clicking this widget immediately switches to the Supabase Cloud & Sync settings tab.
     * Sidebar Navigation tabs with icons: Overview, Project Manager, Services Manager, Profile & Socials, Skills & Tools, Client Reviews, Supabase & Sync, Theme Studio.
     * NO "Cloud" button in the bottom mobile dock bar — Cloud Sync is accessible ONLY through the 3-line sidebar menu widget to keep the dock uncluttered.
     * Sidebar Footer: "View Live Site" (opens `index.html` in new tab) and "Lock / Logout".

3. CMS Tabs & Content Management:
   - Tab 1: Dashboard Overview:
     * Metric counters: Total Projects, Total Services, Total Reviews, Cloud Media Files.
     * Quick action buttons and system health summary.
   - Tab 2: Project & Subcategory Manager:
     * List of all projects with thumbnail preview, title, category, rating, edit and delete buttons.
     * Add/Edit Project Modal:
       - Title, category dropdown, dynamic subcategory dropdown, thumbnail image upload/URL, multi-image gallery URLs.
       - Dual Video Integration with Live Player Preview:
         * YouTube input with real-time URL detection, instant 16:9 player preview, and 1-click "Use YouTube Thumbnail as Cover" button.
         * Local MP4/WebM file uploader with "Remove Video File" button to seamlessly switch between local and YouTube video sources.
       - Client name, duration, tools, tags, and rich description.
   - Tab 3: Services Manager:
     * Manage service cards, service titles, tag chips, software tools, and multi-banner showcase images carousel.
   - Tab 4: Profile & YouTube Social Hub Manager:
     * Edit owner name, title, bio, avatar image upload/URL, phone, WhatsApp number, and social media handles.
     * **YouTube Hub On/Off Toggle Switch:** A prominent toggle in the YouTube Hub section header allows instantly showing or hiding the entire `#social-hub` section on the live portfolio without page reload. Toggle state is persisted in data store and respected by both the public portfolio and nav link visibility.
     * YouTube Channel Hub Manager: Channel Name, Channel Handle, Channel URL, Subscriber Count Badge, and Featured Video URL with live interactive player preview.
   - Tab 5: Skills & Tools Manager:
     * Add/remove skills, categorize into Design, Web, Video, or 3D, and set mastery levels.
   - Tab 6: Client Reviews Moderation:
     * Review list with project name, reviewer name, rating stars, comment text, and delete/moderate buttons.
   - Tab 7: Supabase Cloud Database & Sync Settings:
     * Supabase Project URL and Anon Key input fields with "Save & Connect" button.
     * Live connection diagnostic test button.
     * **Live Supabase Storage Widget** on the Overview dashboard showing real-time storage usage (MB used / 1 GB free tier), file count, usage progress bar, and "🔄 Refresh" button. Widget loads with a 1.8-second deferred initialization to ensure the Supabase SDK is ready before querying the storage bucket.
     * "Seed Live Supabase Database from JSON" button (one-click cloud initialization).
     * "Export data.json" backup button (downloads full database as JSON file for GitHub Pages).
     * "Import data.json" restore button.
     * "Wipe All Demo Data" button with confirmation modal to provide a clean empty slate ready for personal works.
   - Tab 8: Theme & Display Studio:
     * Accent color preset switcher and visual customizer.

--------------------------------------------------------------------------------
💾 4. DATA ARCHITECTURE & SUPABASE BACKEND SCHEMA
--------------------------------------------------------------------------------

### Storage & State Management Flow:
1. `window.PortfolioData`: Centralized state management controller.
2. Read Hierarchy:
   - Level 1 (Primary): Fetch live data from Supabase Cloud Database via REST API / SDK.
   - Level 2 (Cache): Read from browser `localStorage` (`portfolio_data_v4`) if offline or loading.
   - Level 3 (Baseline): Fetch `data.json` if browser storage is empty.
3. Write Hierarchy:
   - When Admin saves any edit: Updates `localStorage` immediately, dispatches `portfolioDataChanged` custom event to update public pages in real-time, and asynchronously commits to Supabase Cloud Database.
4. Realtime Subscription:
   - Supabase Realtime channel listens to changes on `portfolio_data` table and synchronizes updates across all open tabs and visitors instantaneously without page reloads.

### Supabase SQL Schema (`supabase_schema.sql`):
```sql
-- 1. Create portfolio_data table
CREATE TABLE IF NOT EXISTS public.portfolio_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    data JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create visitor reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    user_avatar TEXT DEFAULT '',
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create contact messages table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.portfolio_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 5. Set RLS Policies (Public Read & Authenticated/Public Write)
CREATE POLICY "Public Read Portfolio Data" ON public.portfolio_data FOR SELECT USING (true);
CREATE POLICY "Public Write Portfolio Data" ON public.portfolio_data FOR ALL USING (true);
CREATE POLICY "Public Read Reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Public Insert Reviews" ON public.reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Messages" ON public.messages FOR INSERT WITH CHECK (true);

-- 6. Enable Realtime Publications
ALTER PUBLICATION supabase_realtime ADD TABLE public.portfolio_data;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reviews;
```

--------------------------------------------------------------------------------
📋 5. STEP-BY-STEP IMPLEMENTATION CHECKLIST FOR THE AI AGENT
--------------------------------------------------------------------------------
1. Step 1: Create repository structure:
   - `index.html` (Public Portfolio)
   - `admin.html` (Admin CMS Dashboard)
   - `css/style.css` (Main Portfolio Stylesheet with creative design system)
   - `css/admin.css` (CMS Dashboard Stylesheet)
   - `js/data.js` (Unified Data Store & Local Cache Layer)
   - `js/supabase-config.js` (Supabase Cloud API connector & Realtime subscriber)
   - `js/main.js` (Frontend controller, typing, sliders, modal, swipe gestures)
   - `js/admin.js` (CMS authentication, CRUD managers, backup/seed tools)
   - `data.json` (Default portfolio dataset)
   - `supabase_schema.sql` (Complete database schema)
2. Step 2: Implement the Data Store with graceful offline fallback and Supabase live synchronization.
3. Step 3: Implement your unique, jaw-dropping visual design system in `css/style.css`.
4. Step 4: Implement all interactive public features:
   - Dynamic splash screen with animated progress bar.
   - 16:9 featured works hero auto-slider with touch-swipe & mouse-drag.
   - 16:9 service banner auto-sliders with touch-swipe gestures.
   - Multi-level category and subcategory filtering.
   - Multi-media Lightbox Modal with high-contrast, clearly visible close button ("X"), ESC key shortcut, multi-image switcher, local video player, YouTube iframe embed, and interactive 5-star review submission.
   - WhatsApp inquiry builder modal.
   - Working contact form and copy-to-clipboard buttons.
5. Step 5: Implement Admin CMS Dashboard in `admin.html` and `js/admin.js`:
   - Supabase Auth + Forgot Password + Offline PIN login.
   - Clean topbar without cluttered status icons.
   - 3-line menu drawer with live Cloud Sync status button.
   - Full CRUD for Projects, Services, Profile, Skills, and Reviews.
   - One-click Seed Supabase Database, Export JSON, and Wipe Demo Data features.
6. Step 6: Test all interactions and verify 100% responsiveness and error-free console logs.

Now, begin building the entire system!
```
